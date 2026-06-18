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
          : data.temperature >= 34
            ? "Warning"
            : "Normal";
      // console.log(`Status berubah: ${previousStatus.current} -> ${status}`);

      if (status !== previousStatus.current) {
        toast.dismiss();

        if (status === "Overheat") {
          toast.error("Suhu Overheat");
        } else if (status === "Warning") {
          toast.warning("Suhu Berada dikondisi Warning");
        } else {
          toast.success("Suhu dalam kondisi Normal");
        }

        previousStatus.current = status;
      }

      setData({
        temperature: data.temperature,
        humidity: data.humidity,
        status,
        lastUpdated: new Date().toLocaleTimeString("id-ID", {
          hour12: false,
        }),
      });
    });

    return () => {
      client.removeAllListeners("message");
    };
  }, []);

  return null;
}
