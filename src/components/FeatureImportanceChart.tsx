import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const data = [
  { feature: "Apps Installed", importance: 0.28, color: "hsl(174, 72%, 56%)" },
  { feature: "Age Group", importance: 0.22, color: "hsl(262, 83%, 68%)" },
  { feature: "Device Model", importance: 0.18, color: "hsl(38, 92%, 50%)" },
  { feature: "OS Version", importance: 0.14, color: "hsl(142, 71%, 45%)" },
  { feature: "Network Type", importance: 0.10, color: "hsl(0, 84%, 60%)" },
  { feature: "Gender", importance: 0.08, color: "hsl(215, 20%, 55%)" },
];

export function FeatureImportanceChart() {
  return (
    <div className="metric-card h-full">
      <h3 className="text-lg font-semibold mb-6">Feature Importance Analysis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Key predictors for user behavior classification
      </p>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <XAxis 
              type="number" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <YAxis 
              type="category" 
              dataKey="feature" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 11%)",
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Importance"]}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
