import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", screenTime: 4.2, dataUsage: 1.8, batteryDrain: 45 },
  { day: "Tue", screenTime: 5.1, dataUsage: 2.1, batteryDrain: 52 },
  { day: "Wed", screenTime: 4.8, dataUsage: 1.9, batteryDrain: 48 },
  { day: "Thu", screenTime: 5.5, dataUsage: 2.4, batteryDrain: 58 },
  { day: "Fri", screenTime: 6.2, dataUsage: 2.8, batteryDrain: 65 },
  { day: "Sat", screenTime: 7.1, dataUsage: 3.2, batteryDrain: 72 },
  { day: "Sun", screenTime: 6.8, dataUsage: 3.0, batteryDrain: 68 },
];

export function UsageTrendsChart() {
  return (
    <div className="metric-card h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Weekly Usage Trends</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Screen Time (hrs)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Data (GB)</span>
          </div>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScreenTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDataUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262, 83%, 68%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(262, 83%, 68%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 11%)",
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
            />
            <Area
              type="monotone"
              dataKey="screenTime"
              stroke="hsl(174, 72%, 56%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorScreenTime)"
            />
            <Area
              type="monotone"
              dataKey="dataUsage"
              stroke="hsl(262, 83%, 68%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDataUsage)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
