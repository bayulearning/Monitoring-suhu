import { API_URL } from "../config/api";

export const getLogs = async () => {
  const response = await fetch(`${API_URL}/api/logs`);

  if (!response.ok) {
    throw new Error("Gagal mengambil logs");
  }

  return response.json();
};
