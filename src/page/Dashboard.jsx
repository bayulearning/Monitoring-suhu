import "./Dashboard.css";
import TemperatureCard from "../component/TempartureCard/TemperatureCard";
import StatusCard from "../component/StatusCard/StatusCard";
import { dailySummary, dataTemp } from "../assets/data/DummyData";
import ChartBar from "../component/ChartBar/ChartBar";

export default function Dashboard() {
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
