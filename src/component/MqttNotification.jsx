import { useEffect, useRef } from "react";
import { client } from "../mqtt/mqttService";
import { toast } from "react-toastify";

export default function MqttNotification() {
  const previousStatus = useRef("Normal");

  useEffect(() => {
    client.subscribe("iot-monitoring-kelompok/suhu");

    client.on("message", (topic, message) => {
      const data = JSON.parse(message.toString());

      const status =
        data.temperature >= 40
          ? "Overheat"
          : data.temperature >= 34
            ? "Warning"
            : "Normal";

      if (status !== previousStatus.current) {
        toast.warning(`Status berubah menjadi ${status}`);

        previousStatus.current = status;
      }
    });

    return () => {
      client.removeAllListeners("message");
    };
  }, []);

  return null;
}
