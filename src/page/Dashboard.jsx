import "./Dashboard.css";
import TemperatureCard from "../component/TempartureCard/TemperatureCard";
import StatusCard from "../component/StatusCard/StatusCard";
import { dailySummary } from "../assets/data/DummyData";
import ChartBar from "../component/ChartBar/ChartBar";
import { useState, useEffect } from "react";
import client from "../services/mqttServices";

export default function Dashboard() {
  useEffect(() => {
    client.on("connect", () => {
      console.log("Connected");

      client.subscribe("iot-monitoring-kelompok/suhu", (err) => {
        if (!err) {
          console.log("Subscribed");
        }
      });
    });

    client.on("message", (topic, message) => {
      const data = JSON.parse(message.toString());

      setdataTemp({
        temperature: data.temperature,
        humidity: data.humidity,
        status: data.temperature > 35 ? "Overheat" : "Normal",
        lastUpdated: new Date().toLocaleTimeString(),
      });
    });

    return () => {
      client.removeAllListeners("message");
    };
  }, []);

  const [dataTemp, setdataTemp] = useState({
    temperature: 0,
    humidity: 0,
    status: "Normal",
    lastUpdated: "-",
  });

  const hour = new Date().getHours();
  let greeting = "Selamat Pagi";

  if (hour >= 12 && hour < 15) {
    greeting = "Selamat Siang";
  } else if (hour >= 15 && hour < 18) {
    greeting = "Selamat Sore";
  } else if (hour >= 18 && hour < 24) {
    greeting = "Selamat Malam";
  }

  const totalWarning = dailySummary.reduce(
    (total, item) => total + item.warningCount,
    0,
  );

  const totalOverheat = dailySummary.reduce(
    (total, item) => total + item.overheatCount,
    0,
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <p>{greeting}</p>
        <h1>Dashboard</h1>
        <p>Monitoring Suhu Ruangan</p>
      </div>
      <TemperatureCard
        temperature={dataTemp.temperature}
        status={dataTemp.status}
        lastUpdated={dataTemp.lastUpdated}
      />

      <StatusCard
        status={dataTemp.status}
        humidity={dataTemp.humidity}
        eventWarn={totalWarning}
        eventOver={totalOverheat}
      />

      <ChartBar data={dailySummary} />
    </div>
  );
}
