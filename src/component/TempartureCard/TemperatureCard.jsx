import "./TemperatureCard.css";

export default function TemperatureCard({ temperature, status, lastUpdated }) {
  return (
    <div className="temperature-card">
      <h2>Suhu Ruangan</h2>
      <p className="temperature-value">{temperature}°C</p>
      <span className="status">{status}</span>
      <br />
      <br />
      <span className="lastUpdate">Last Updated: {lastUpdated}</span>
    </div>
  );
}
