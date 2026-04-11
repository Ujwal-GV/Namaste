import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RequestChart({ data }) {
  const chartData = [
    { name: "Users", value: data?.users },
    { name: "Owners", value: data?.owners },
    { name: "Properties", value: data?.properties },
    { name: "Requests", value: data?.requests },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  );
}