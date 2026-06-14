import "./ChartBar.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

export default function ChartBar({ data }) {
  return (
    <div className="chart-card">
      <h2>Rata-rata Suhu Harian</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <XAxis dataKey="day" />
          <YAxis width={50} domain={[20, 45]} />
          <Tooltip formatter={(value) => Number(value).toFixed(2)} />
          <Line
            type="monotone"
            dataKey="avgTemp"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
          />

          <ReferenceLine y={33} stroke="orange" strokeDasharray="3 3" />
          <ReferenceLine y={40} stroke="red" strokeDasharray="3 3" />

          <CartesianGrid strokeDasharray="1" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
