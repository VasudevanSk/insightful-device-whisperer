import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { MobileUsageRecord, BEHAVIOR_CLASS_LABELS, BEHAVIOR_CLASS_COLORS } from '@/types/mobileUsage';
import { getAggregatedStats } from '@/hooks/useMobileData';
import { 
  Users, Clock, AppWindow, TrendingUp, Zap, Target, 
  Smartphone, BarChart3, PieChart, Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, 
  PieChart as RechartsPie, Pie, LineChart, Line, CartesianGrid, Area, AreaChart
} from 'recharts';

interface DeveloperDashboardProps {
  data: MobileUsageRecord[];
}

export function DeveloperDashboard({ data }: DeveloperDashboardProps) {
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

  // Prepare chart data
  const deviceData = Object.entries(stats.deviceCounts).map(([name, value]) => ({
    name: name.replace('Samsung ', '').replace('Google ', ''),
    value,
    color: ['hsl(174, 72%, 56%)', 'hsl(262, 83%, 68%)', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)', 'hsl(0, 84%, 60%)'][
      Object.keys(stats.deviceCounts).indexOf(name) % 5
    ],
  }));

  const behaviorData = Object.entries(stats.behaviorCounts).map(([cls, count]) => ({
    name: BEHAVIOR_CLASS_LABELS[Number(cls)],
    value: count,
    color: BEHAVIOR_CLASS_COLORS[Number(cls)],
  }));

  // App usage by behavior class
  const usageByBehavior = [1, 2, 3, 4, 5].map((cls) => {
    const classUsers = data.filter((d) => d.User_Behavior_Class === cls);
    const avgUsage = classUsers.length > 0 
      ? classUsers.reduce((sum, d) => sum + d.App_Usage_Time, 0) / classUsers.length 
      : 0;
    return {
      class: BEHAVIOR_CLASS_LABELS[cls],
      usage: Math.round(avgUsage),
      color: BEHAVIOR_CLASS_COLORS[cls],
    };
  });

  // Engagement by age
  const engagementByAge = Object.entries(stats.ageGroups).map(([age, count]) => {
    const ageUsers = data.filter((d) => {
      if (age === '18-24') return d.Age >= 18 && d.Age <= 24;
      if (age === '25-34') return d.Age >= 25 && d.Age <= 34;
      if (age === '35-44') return d.Age >= 35 && d.Age <= 44;
      if (age === '45-54') return d.Age >= 45 && d.Age <= 54;
      return d.Age >= 55;
    });
    const avgScreenTime = ageUsers.length > 0
      ? ageUsers.reduce((sum, d) => sum + d.Screen_On_Time, 0) / ageUsers.length
      : 0;
    return { age, users: count, screenTime: avgScreenTime.toFixed(1) };
  });

  // Feature importance (simulated based on correlation)
  const featureImportance = [
    { feature: 'Apps Installed', importance: 0.32 },
    { feature: 'Screen Time', importance: 0.28 },
    { feature: 'Age', importance: 0.18 },
    { feature: 'Battery Drain', importance: 0.12 },
    { feature: 'Device Model', importance: 0.06 },
    { feature: 'Gender', importance: 0.04 },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-segment-light/10">
                <Clock className="w-5 h-5 text-segment-light" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Avg App Usage</p>
            <p className="text-3xl font-bold">{Math.round(stats.avgAppUsage)} min</p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <AppWindow className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Avg Apps Installed</p>
            <p className="text-3xl font-bold">{Math.round(stats.avgAppsInstalled)}</p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-segment-moderate/10">
                <Zap className="w-5 h-5 text-segment-moderate" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Heavy Users</p>
            <p className="text-3xl font-bold">
              {Math.round(((stats.behaviorCounts[4] || 0) + (stats.behaviorCounts[5] || 0)) / stats.totalUsers * 100)}%
            </p>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">User Behavior Distribution</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behaviorData} layout="vertical">
                  <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={11} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 11%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                    formatter={(value: number) => [`${value} users`, 'Count']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {behaviorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Device Market Share</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
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
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {deviceData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-segment-light" />
              <h3 className="text-lg font-semibold">App Usage by Behavior Class</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageByBehavior}>
                  <defs>
                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis dataKey="class" stroke="hsl(215, 20%, 55%)" fontSize={11} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 11%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                    formatter={(value: number) => [`${value} min`, 'Avg Usage']}
                  />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="hsl(174, 72%, 56%)"
                    strokeWidth={2}
                    fill="url(#usageGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-segment-moderate" />
              <h3 className="text-lg font-semibold">Feature Importance for Engagement</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportance} layout="vertical">
                  <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <YAxis type="category" dataKey="feature" stroke="hsl(215, 20%, 55%)" fontSize={10} width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 11%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
                  />
                  <Bar dataKey="importance" fill="hsl(262, 83%, 68%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Engagement by Age */}
      <motion.div variants={itemVariants}>
        <AnimatedCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">User Engagement by Age Group</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementByAge}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                <XAxis dataKey="age" stroke="hsl(215, 20%, 55%)" fontSize={12} />
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
                <Bar yAxisId="left" dataKey="users" fill="hsl(174, 72%, 56%)" radius={[4, 4, 0, 0]} name="Users" />
                <Line yAxisId="right" type="monotone" dataKey="screenTime" stroke="hsl(262, 83%, 68%)" strokeWidth={2} name="Avg Screen Time (hrs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" />
              <span className="text-muted-foreground">User Count</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent" />
              <span className="text-muted-foreground">Avg Screen Time</span>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>
    </motion.div>
  );
}
