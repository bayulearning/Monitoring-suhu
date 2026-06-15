import "dotenv/config";
import express, { json } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from "cors";

import mqtt from "mqtt";

const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

const prisma = new PrismaClient();
const app = express();

let maintenanceState = {
  maintenance: false,
  temperature: 35,
};

app.use(cors());
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

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di PORT ${PORT}`);
});
