import mqtt from "mqtt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

client.on("connect", () => {
  console.log("MQTT Connected");

  client.subscribe("iot-monitoring-kelompok/suhu");
});

let saveTime = 0;

let lastSaveTime = 0;

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const status =
      data.temperature >= 40
        ? "Overheat"
        : data.temperature >= 37
          ? "Warning"
          : "Normal";

    const now = Date.now();

    const shouldSave = status === "Overheat" && now - lastSaveTime >= 5000;

    if (shouldSave) {
      await prisma.monitoring_logs.create({
        data: {
          temperature: data.temperature,
          humidity: data.humidity,
          status,
        },
      });

      lastSaveTime = now;

      console.log(`Overheat tersimpan (${data.temperature}°C)`);
    }
  } catch (error) {
    console.error(error);
  }
});
