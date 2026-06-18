import { API_URL } from "../config/api";

export const getDashboardSummary = async () => {
  const response = await fetch(`${API_URL}/api/dashboard_summary`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data");
  }

  return response.json();
};

export const getChartSummary = async () => {
  const response = await fetch(`${API_URL}/api/chart-summary`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data");
  }

  return response.json();
};
