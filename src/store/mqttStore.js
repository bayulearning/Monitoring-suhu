import { create } from "zustand";

const useMqttStore = create((set) => ({
  temperature: 0,
  humidity: 0,
  status: "Normal",
  lastUpdated: "-",

  setData: (data) => {
    set({
      temperature: data.temperature,
      humidity: data.humidity,
      status: data.status,
      lastUpdated: data.lastUpdated,
    });
  },
}));

export default useMqttStore;
