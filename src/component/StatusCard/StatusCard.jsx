import "./StatusCard.css";

export default function StatusCard({ status, humidity, eventWarn, eventOver }) {
  return (
    <div className="status-card-container">
      <div className="status-row">
        <div className={`status-card ${status.toLowerCase()}`}>
          <h3>Status</h3>
          <div className="status-text">{status}</div>
        </div>
        <div
          className={`humidity-card ${humidity < 70 ? "normal" : "warning"}`}
        >
          <h3>Kelembapan</h3>
          <div className="humidity-text">{humidity}%</div>
        </div>
      </div>
      <div className="event-row">
        <div className="event-warning">
          <h3>Warning</h3>
          <h4>{eventWarn}</h4>
        </div>
        <div className="event-overheat">
          <h3>Overheat</h3>
          <h4>{eventOver}</h4>
        </div>
      </div>
    </div>
  );
}
