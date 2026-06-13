import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import client from "../services/mqttServices";
import useMqttStore from "../store/mqttStore";

export default function MqttProvider() {
  const setData = useMqttStore((state) => state.setData);

  const previousStatus = useRef("Normal");

  useEffect(() => {
    client.on("connect", () => {
      client.subscribe("iot-monitoring-kelompok/suhu");
    });

    client.on("message", (topic, message) => {
      const data = JSON.parse(message.toString());

      const status =
        data.temperature >= 40
          ? "Overheat"
          : data.temperature >= 37
            ? "Warning"
            : "Normal";

      if (status !== previousStatus.current) {
        toast.warning(`Status berubah menjadi ${status}`);

        previousStatus.current = status;
      }

      setData({
        temperature: data.temperature,
        humidity: data.humidity,
        status,
        lastUpdated: new Date().toLocaleTimeString(),
      });
    });

    return () => {
      client.removeAllListeners("message");
    };
  }, []);

  return null;
}
