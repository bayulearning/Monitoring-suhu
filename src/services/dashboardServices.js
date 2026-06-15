export const getDashboardSummary = async () => {
  const response = await fetch("http://localhost:3000/api/dashboard_summary");

  if (!response.ok) {
    throw new Error("Gagal mengambil data");
  }

  return response.json();
};

export const getChartSummary = async () => {
  const response = await fetch("http://localhost:3000/api/chart-summary");

  if (!response.ok) {
    throw new Error("Gagal mengambil data");
  }

  return response.json();
};
