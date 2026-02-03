import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Users, Smartphone } from "lucide-react";

const ageData = [
  { age: "18-24", users: 2150, color: "hsl(174, 72%, 56%)" },
  { age: "25-34", users: 3200, color: "hsl(262, 83%, 68%)" },
  { age: "35-44", users: 2100, color: "hsl(38, 92%, 50%)" },
  { age: "45-54", users: 1050, color: "hsl(142, 71%, 45%)" },
  { age: "55+", users: 500, color: "hsl(0, 84%, 60%)" },
];

const osData = [
  { name: "Android", value: 5800, percentage: 64 },
  { name: "iOS", value: 3200, percentage: 36 },
];

export function DemographicsPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Age Distribution */}
      <div className="metric-card">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Age Distribution</h3>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="age" 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 11%)",
                  border: "1px solid hsl(222, 30%, 18%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 98%)",
                }}
                formatter={(value: number) => [`${value.toLocaleString()} users`, ""]}
              />
              <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OS Distribution */}
      <div className="metric-card">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold">OS Distribution</h3>
        </div>
        <div className="space-y-4 mt-6">
          {osData.map((os) => (
            <div key={os.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{os.name}</span>
                <span className="text-muted-foreground">{os.value.toLocaleString()} users</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    os.name === "Android" ? "bg-segment-light" : "bg-primary"
                  }`}
                  style={{ width: `${os.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">{os.percentage}%</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Device Models</h4>
          <div className="space-y-2">
            {[
              { model: "Samsung Galaxy S23", share: 18 },
              { model: "iPhone 14 Pro", share: 15 },
              { model: "Google Pixel 7", share: 12 },
              { model: "OnePlus 11", share: 8 },
            ].map((device) => (
              <div key={device.model} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{device.model}</span>
                <span className="font-medium">{device.share}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
