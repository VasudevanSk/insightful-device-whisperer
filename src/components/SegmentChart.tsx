import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Light Usage", value: 2847, color: "hsl(142, 71%, 45%)" },
  { name: "Moderate Usage", value: 4231, color: "hsl(38, 92%, 50%)" },
  { name: "Heavy Usage", value: 1922, color: "hsl(0, 84%, 60%)" },
];

export function SegmentChart() {
  return (
    <div className="metric-card h-full">
      <h3 className="text-lg font-semibold mb-4">User Behavior Segments</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 11%)",
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
              formatter={(value: number) => [`${value.toLocaleString()} users`, ""]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span style={{ color: "hsl(210, 40%, 98%)", fontSize: "12px" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
        {data.map((segment) => (
          <div key={segment.name} className="text-center">
            <p className="text-2xl font-bold" style={{ color: segment.color }}>
              {Math.round((segment.value / 9000) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">{segment.name.split(" ")[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
