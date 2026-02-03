import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { MobileUsageRecord, BEHAVIOR_CLASS_LABELS, BEHAVIOR_CLASS_COLORS } from '@/types/mobileUsage';
import { getAggregatedStats } from '@/hooks/useMobileData';
import { 
  Wifi, Signal, Users, TrendingUp, Smartphone, 
  Database, BarChart3, Activity, Zap, Globe
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
  PieChart, Pie, AreaChart, Area, CartesianGrid, ComposedChart, Line
} from 'recharts';

interface TelecomDashboardProps {
  data: MobileUsageRecord[];
}

export function TelecomDashboard({ data }: TelecomDashboardProps) {
  const stats = getAggregatedStats(data);
  if (!stats) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Calculate total data consumption
  const totalDataGB = data.reduce((sum, d) => sum + d.Data_Usage, 0) / 1024;
  const avgDataPerUser = stats.avgDataUsage / 1024;

  // Data usage by behavior class
  const dataByBehavior = [1, 2, 3, 4, 5].map((cls) => {
    const classUsers = data.filter((d) => d.User_Behavior_Class === cls);
    const totalData = classUsers.reduce((sum, d) => sum + d.Data_Usage, 0) / 1024;
    const avgData = classUsers.length > 0 ? totalData / classUsers.length : 0;
    return {
      class: BEHAVIOR_CLASS_LABELS[cls],
      totalData: Math.round(totalData),
      avgData: avgData.toFixed(2),
      users: classUsers.length,
      color: BEHAVIOR_CLASS_COLORS[cls],
    };
  });

  // OS distribution for network optimization
  const osData = Object.entries(stats.osCounts).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / stats.totalUsers) * 100).toFixed(1),
    color: name === 'Android' ? 'hsl(142, 71%, 45%)' : 'hsl(174, 72%, 56%)',
  }));

  // Device network load simulation
  const deviceLoad = Object.entries(stats.deviceCounts).map(([device, count]) => {
    const deviceUsers = data.filter((d) => d.Device_Model === device);
    const avgData = deviceUsers.reduce((sum, d) => sum + d.Data_Usage, 0) / deviceUsers.length / 1024;
    return {
      device: device.replace('Samsung ', '').replace('Google ', ''),
      users: count,
      avgData: avgData.toFixed(2),
      totalLoad: Math.round((count * avgData)),
    };
  }).sort((a, b) => b.totalLoad - a.totalLoad);

  // User segments for pricing tiers
  const pricingSegments = [
    { tier: 'Basic', range: '< 0.5 GB', users: data.filter(d => d.Data_Usage < 512).length },
    { tier: 'Standard', range: '0.5-1 GB', users: data.filter(d => d.Data_Usage >= 512 && d.Data_Usage < 1024).length },
    { tier: 'Premium', range: '1-2 GB', users: data.filter(d => d.Data_Usage >= 1024 && d.Data_Usage < 2048).length },
    { tier: 'Unlimited', range: '> 2 GB', users: data.filter(d => d.Data_Usage >= 2048).length },
  ];

  // Peak usage simulation by age
  const usageByAge = Object.entries(stats.ageGroups).map(([age, count]) => {
    const ageUsers = data.filter((d) => {
      if (age === '18-24') return d.Age >= 18 && d.Age <= 24;
      if (age === '25-34') return d.Age >= 25 && d.Age <= 34;
      if (age === '35-44') return d.Age >= 35 && d.Age <= 44;
      if (age === '45-54') return d.Age >= 45 && d.Age <= 54;
      return d.Age >= 55;
    });
    const avgData = ageUsers.length > 0 
      ? ageUsers.reduce((sum, d) => sum + d.Data_Usage, 0) / ageUsers.length / 1024
      : 0;
    return { age, users: count, avgData: parseFloat(avgData.toFixed(2)) };
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total Data Traffic</p>
            <p className="text-3xl font-bold">{totalDataGB.toFixed(0)} GB</p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-segment-light/10">
                <Wifi className="w-5 h-5 text-segment-light" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Avg Data/User</p>
            <p className="text-3xl font-bold">{avgDataPerUser.toFixed(2)} GB</p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Active Subscribers</p>
            <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-segment-heavy/10">
                <Zap className="w-5 h-5 text-segment-heavy" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">High-Bandwidth Users</p>
            <p className="text-3xl font-bold">{data.filter(d => d.Data_Usage > 1500).length}</p>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Network Load Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <Signal className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Data Consumption by User Segment</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dataByBehavior}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis dataKey="class" stroke="hsl(215, 20%, 55%)" fontSize={10} />
                  <YAxis yAxisId="left" stroke="hsl(174, 72%, 56%)" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(262, 83%, 68%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 11%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                  />
                  <Bar yAxisId="left" dataKey="totalData" name="Total Data (GB)" radius={[4, 4, 0, 0]}>
                    {dataByBehavior.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="users" stroke="hsl(262, 83%, 68%)" strokeWidth={2} name="User Count" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Platform Distribution</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={osData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {osData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 11%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {osData.map((os) => (
                <div key={os.name} className="text-center">
                  <div className="flex items-center gap-2 justify-center mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: os.color }} />
                    <span className="font-medium">{os.name}</span>
                  </div>
                  <p className="text-2xl font-bold">{os.percentage}%</p>
                  <p className="text-xs text-muted-foreground">{os.value} users</p>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Pricing Segments & Device Load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-segment-light" />
              <h3 className="text-lg font-semibold">Suggested Pricing Tiers</h3>
            </div>
            <div className="space-y-4">
              {pricingSegments.map((segment, index) => {
                const percentage = (segment.users / stats.totalUsers) * 100;
                const colors = ['hsl(142, 71%, 45%)', 'hsl(174, 72%, 56%)', 'hsl(262, 83%, 68%)', 'hsl(38, 92%, 50%)'];
                return (
                  <div key={segment.tier} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{segment.tier}</span>
                      <span className="text-muted-foreground">{segment.range} • {segment.users} users</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: colors[index] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{percentage.toFixed(1)}%</p>
                  </div>
                );
              })}
            </div>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-segment-moderate" />
              <h3 className="text-lg font-semibold">Network Load by Device</h3>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceLoad} layout="vertical">
                  <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis type="category" dataKey="device" stroke="hsl(215, 20%, 55%)" fontSize={10} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 11%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'totalLoad') return [`${value} GB`, 'Total Load'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="totalLoad" fill="hsl(38, 92%, 50%)" radius={[0, 4, 4, 0]} name="totalLoad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Usage by Age Demographics */}
      <motion.div variants={itemVariants}>
        <AnimatedCard>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Data Consumption by Age Demographics</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageByAge}>
                <defs>
                  <linearGradient id="dataGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                <XAxis dataKey="age" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(222, 30%, 18%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'avgData') return [`${value} GB`, 'Avg Data Usage'];
                    return [value, name];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgData"
                  stroke="hsl(174, 72%, 56%)"
                  strokeWidth={2}
                  fill="url(#dataGradient)"
                  name="avgData"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
      </motion.div>
    </motion.div>
  );
}
