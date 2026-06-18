import "./Control.css";
import ControlCard from "../component/ControlCard/ControlCard";
import { FaFan, FaLightbulb } from "react-icons/fa";
import { HiMiniBellAlert } from "react-icons/hi2";
import { useState, useEffect } from "react";

import {
  postSendMaintenance,
  getMaintenance,
} from "../services/controlService";

export default function Control() {
  const [maintenance, setMaintenance] = useState(false);
  const [temperature, setTemperature] = useState("35");

  const sendMaintenance = async () => {
    console.log("BUTTON DIKLIK");

    try {
      const response = await postSendMaintenance();

      console.log("STATUS:", response.status);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMaintenance = async () => {
    try {
      const data = await getMaintenance();

      setMaintenance(data.maintenance);
      setTemperature(String(data.temperature));
    } catch (error) {
      console.error(error);
    }
  };

  const devices = [
    {
      id: "led",
      title: "LED",
      topic: "iot/control/led",
      icon: <FaLightbulb />,
    },
    {
      id: "fan",
      title: "Fan",
      topic: "iot/control/fan",
      icon: <FaFan />,
    },
    {
      id: "buzzer",
      title: "Buzzer",
      topic: "iot/control/buzzer",
      icon: <HiMiniBellAlert />,
    },
  ];

  useEffect(() => {
    loadMaintenance();
  }, []);

  return (
    <div className="control-page">
      <h1>Control Center</h1>

      <div className="maintenance-mode">
        <label htmlFor="">
          <input
            type="checkbox"
            checked={maintenance}
            onChange={(e) => setMaintenance(e.target.checked)}
          />
          Maintenance
        </label>

        <input
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />

        <button onClick={sendMaintenance}>Test</button>
      </div>
      {/* {devices.map((device) => {
        return (
          <ControlCard
            key={device.id}
            title={device.title}
            topic={device.topic}
            icon={device.icon}
          />
        );
      })} */}
    </div>
  );
}
