import "./ControlCard.css";
import { useState } from "react";

export default function ControlCard({ title, icon }) {
  const [status, setStatus] = useState(false);

  const handleClick = () => {
    setStatus(!status);
  };
  return (
    <div className="Card-Container">
      <div className="Card-Event">
        <div className="card-left">
          <h1>{title}</h1>
          <div className="device-icon">{icon}</div>
        </div>
        <button className={status ? "btn-on" : "btn-off"} onClick={handleClick}>
          {status ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}
