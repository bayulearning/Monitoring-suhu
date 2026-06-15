import mqtt from "mqtt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe("iot-monitoring-kelompok/suhu");
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
