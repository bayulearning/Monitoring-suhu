import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import mqtt from "mqtt";
import rateLimit from "express-rate-limit";

console.log("=== SERVER STARTING ===");

const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

const prisma = new PrismaClient();
const app = express();

let maintenanceState = {
  maintenance: false,
  temperature: 35,
};

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: "Terlalu banyak request, coba lagi nanti.",
  },
});

const controlLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
});

app.use("/api/maintenance", controlLimiter);

app.use("/api", limiter);

app.use(
  cors({
    origin: [
      "https://blanchedalmond-goldfinch-407258.hostingersite.com",
      "http://localhost:5173",
    ],
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("IOT Monitoring Berhasil berjalan");
});

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await prisma.monitoring_logs.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan ",
    });
  }
});

app.post("/api/logs", async (req, res) => {
  try {
    const { temperature, humidity, status } = req.body;

    const logs = await prisma.monitoring_logs.create({
      data: {
        temperature,
        humidity,
        status,
      },
    });
    res.status(201).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan ",
    });
  }
});

app.post("/api/maintenance", (req, res) => {
  try {
    const { maintenance, temperature } = req.body;

    maintenanceState = {
      maintenance,
      temperature,
    };

    client.publish(
      "iot-monitoring-kelompok/control",
      JSON.stringify({
        maintenance,
        temperature,
      }),
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi Kesalahan",
    });
  }
});

app.get("/api/maintenance", (req, res) => {
  res.json(maintenanceState);
});

app.get("/api/logs/latest", async (req, res) => {
  try {
    const logs = await prisma.monitoring_logs.findFirst({
      orderBy: {
        created_at: "desc",
      },
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi Kesalahan",
    });
  }
});

app.get("/api/logs/grouped", async (req, res) => {
  try {
    const logs = await prisma.monitoring_logs.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    const grouped = {};

    logs.forEach((log) => {
      const dateObj = new Date(log.created_at);

      const date = dateObj.toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
      });

      const day = dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        timeZone: "Asia/Jakarta",
      });

      if (!grouped[date]) {
        grouped[date] = {
          day: day.charAt(0).toUpperCase() + day.slice(1),
          date,
          records: [],
        };
      }

      grouped[date].records.push({
        time: dateObj.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }),
        temp: `${log.temperature}°C`,
        humidity: `${log.humidity}%`,
        status: log.status,
      });
    });

    res.json(Object.values(grouped));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan",
    });
  }
});

app.get("/api/dashboard_summary", async (req, res) => {
  try {
    const overheatCount = await prisma.monitoring_logs.count({
      where: {
        status: "Overheat",
      },
    });

    const warningCount = await prisma.monitoring_logs.count({
      where: {
        status: "Warning",
      },
    });

    res.json({ overheatCount, warningCount });
  } catch (error) {
    res.status(500).json({ message: "Terjadi Kesalahan" });
  }
});

app.get("/api/chart-summary", async (req, res) => {
  try {
    const logs = await prisma.monitoring_logs.findMany({
      orderBy: {
        created_at: "asc",
      },
    });

    const grouped = {};

    logs.forEach((log) => {
      const date = new Date(log.created_at).toISOString().split("T")[0];

      if (!grouped[date]) {
        grouped[date] = {
          totalTemp: 0,
          count: 0,
        };
      }

      grouped[date].totalTemp += log.temperature;
      grouped[date].count += 1;
    });

    const result = Object.entries(grouped).map(([date, value]) => ({
      day: date,
      avgTemp: Number(value.totalTemp / value.count).toFixed(2),
    }));

    const last7Days = result.slice(-7);

    res.json(last7Days);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan",
    });
  }
});

// MQTT

client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe("iot-monitoring-kelompok/suhu");
});

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});

client.on("close", () => {
  console.log("MQTT Disconnected");
});

let previousStatus = null;
let lastOverheatSave = 0;
let lastNormalSave = 0;

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const status =
      data.temperature >= 40
        ? "Overheat"
        : data.temperature >= 34
          ? "Warning"
          : "Normal";

    const now = Date.now();

    const enteredWarning = status === "Warning" && previousStatus !== "Warning";

    const enteredOverheat =
      status === "Overheat" && previousStatus !== "Overheat";

    const periodicOverheat =
      status === "Overheat" && now - lastOverheatSave >= 5000;

    const periodicNormal =
      status === "Normal" && now - lastNormalSave >= 600000; // 5 menit

    const backToNormal = status === "Normal" && previousStatus !== "Normal";

    if (
      enteredWarning ||
      enteredOverheat ||
      periodicOverheat ||
      periodicNormal ||
      backToNormal
    ) {
      await prisma.monitoring_logs.create({
        data: {
          temperature: data.temperature,
          humidity: data.humidity,
          status,
        },
      });

      if (status === "Overheat") {
        lastOverheatSave = now;
      }

      if (status === "Normal") {
        lastNormalSave = now;
      }

      console.log(`${status} tersimpan (${data.temperature}°C)`);
    }

    previousStatus = status;
  } catch (error) {
    console.error(error);
  }
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database Connected");

    const PORT = process.env.PORT || 3000;
    console.log("=== BEFORE APP LISTEN ===");

    app.listen(PORT, () => {
      console.log(`Server berjalan di PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Database Error:", error);
  }
}

startServer();
