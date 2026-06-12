import "./Control.css";
import ControlCard from "../component/ControlCard/ControlCard";
import { FaFan, FaLightbulb } from "react-icons/fa";
import { HiMiniBellAlert } from "react-icons/hi2";

export default function Control() {
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

  return (
    <div className="control-page">
      <h1>Control Center</h1>
      {devices.map((device) => {
        return (
          <ControlCard
            key={device.id}
            title={device.title}
            topic={device.topic}
            icon={device.icon}
          />
        );
      })}
    </div>
  );
}
