import { API_URL } from "../config/api";

export const postSendMaintenance = async () => {
  const response = await fetch(`${API_URL}/api/maintenance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maintenance,
      temperature: Number(temperature),
    }),
  });

  if (!response.ok) {
    throw new Error("Gagal export data");
  }

  return response.json();
};

export const getMaintenance = async () => {
  const response = await fetch(`${API_URL}/api/maintenance`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data");
  }

  return response.json();
};
