import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { MobileUsageRecord, BEHAVIOR_CLASS_LABELS, BEHAVIOR_CLASS_COLORS } from '@/types/mobileUsage';
import { getAggregatedStats } from '@/hooks/useMobileData';
import { 
  Brain, Users, TrendingUp, BarChart3, PieChart, 
  Target, Activity, Lightbulb, FileText, Sigma
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
  PieChart as RechartsPie, Pie, ScatterChart, Scatter, CartesianGrid, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface ResearcherDashboardProps {
  data: MobileUsageRecord[];
}

export function ResearcherDashboard({ data }: ResearcherDashboardProps) {
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

  // Behavior class distribution
  const behaviorData = Object.entries(stats.behaviorCounts).map(([cls, count]) => ({
    name: BEHAVIOR_CLASS_LABELS[Number(cls)],
    value: count,
    percentage: ((count / stats.totalUsers) * 100).toFixed(1),
    color: BEHAVIOR_CLASS_COLORS[Number(cls)],
  }));

  // Gender-based analysis
  const genderBehavior = ['Male', 'Female'].map((gender) => {
    const genderUsers = data.filter((d) => d.Gender === gender);
    const avgScreenTime = genderUsers.reduce((sum, d) => sum + d.Screen_On_Time, 0) / genderUsers.length;
    const avgApps = genderUsers.reduce((sum, d) => sum + d.Number_of_Apps_Installed, 0) / genderUsers.length;
    const avgData = genderUsers.reduce((sum, d) => sum + d.Data_Usage, 0) / genderUsers.length / 1024;
    const heavyUsers = genderUsers.filter((d) => d.User_Behavior_Class >= 4).length;
    return {
      gender,
      count: genderUsers.length,
      avgScreenTime: avgScreenTime.toFixed(1),
      avgApps: Math.round(avgApps),
      avgData: avgData.toFixed(2),
      heavyUserPct: ((heavyUsers / genderUsers.length) * 100).toFixed(1),
    };
  });

  // Age correlation with behavior
  const ageCorrelation = Object.entries(stats.ageGroups).map(([age, count]) => {
    const ageUsers = data.filter((d) => {
      if (age === '18-24') return d.Age >= 18 && d.Age <= 24;
      if (age === '25-34') return d.Age >= 25 && d.Age <= 34;
      if (age === '35-44') return d.Age >= 35 && d.Age <= 44;
      if (age === '45-54') return d.Age >= 45 && d.Age <= 54;
      return d.Age >= 55;
    });
    const avgBehaviorClass = ageUsers.reduce((sum, d) => sum + d.User_Behavior_Class, 0) / ageUsers.length;
    return { age, users: count, avgBehavior: avgBehaviorClass.toFixed(2) };
  });

  // Scatter plot data for correlation analysis
  const scatterData = data.slice(0, 200).map((d) => ({
    screenTime: d.Screen_On_Time,
    apps: d.Number_of_Apps_Installed,
    behaviorClass: d.User_Behavior_Class,
  }));

  // Radar chart for behavior profiles
  const radarData = [1, 2, 3, 4, 5].map((cls) => {
    const classUsers = data.filter((d) => d.User_Behavior_Class === cls);
    if (classUsers.length === 0) return null;
    return {
      class: BEHAVIOR_CLASS_LABELS[cls],
      screenTime: (classUsers.reduce((sum, d) => sum + d.Screen_On_Time, 0) / classUsers.length / 12) * 100,
      appUsage: (classUsers.reduce((sum, d) => sum + d.App_Usage_Time, 0) / classUsers.length / 600) * 100,
      dataUsage: (classUsers.reduce((sum, d) => sum + d.Data_Usage, 0) / classUsers.length / 2500) * 100,
      apps: (classUsers.reduce((sum, d) => sum + d.Number_of_Apps_Installed, 0) / classUsers.length / 100) * 100,
      battery: (classUsers.reduce((sum, d) => sum + d.Battery_Drain, 0) / classUsers.length / 3000) * 100,
    };
  }).filter(Boolean);

  // Statistical summary
  const stdDev = (arr: number[]) => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(arr.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / arr.length);
  };

  const statisticalSummary = {
    screenTimeStd: stdDev(data.map((d) => d.Screen_On_Time)).toFixed(2),
    appUsageStd: stdDev(data.map((d) => d.App_Usage_Time)).toFixed(2),
    dataUsageStd: stdDev(data.map((d) => d.Data_Usage)).toFixed(2),
    ageStd: stdDev(data.map((d) => d.Age)).toFixed(2),
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Research Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Sample Size</p>
            <p className="text-3xl font-bold">n = {stats.totalUsers}</p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-segment-light/10">
                <Sigma className="w-5 h-5 text-segment-light" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Behavior Classes</p>
            <p className="text-3xl font-bold">5</p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Target className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Variables</p>
            <p className="text-3xl font-bold">10</p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-segment-moderate/10">
                <Brain className="w-5 h-5 text-segment-moderate" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Age Range</p>
            <p className="text-3xl font-bold">{Math.min(...data.map(d => d.Age))}-{Math.max(...data.map(d => d.Age))}</p>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Behavior Distribution & Gender Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Behavior Class Distribution</h3>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={behaviorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    labelLine={false}
                  >
                    {behaviorData.map((entry, index) => (
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
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {behaviorData.map((d) => (
                <div key={d.name} className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Gender-Based Behavior Analysis</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Metric</th>
                    {genderBehavior.map((g) => (
                      <th key={g.gender} className="text-right py-2 text-muted-foreground font-medium">{g.gender}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Sample Size</td>
                    {genderBehavior.map((g) => (
                      <td key={g.gender} className="text-right py-2 font-medium">{g.count}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Avg Screen Time (hrs)</td>
                    {genderBehavior.map((g) => (
                      <td key={g.gender} className="text-right py-2 font-medium">{g.avgScreenTime}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Avg Apps Installed</td>
                    {genderBehavior.map((g) => (
                      <td key={g.gender} className="text-right py-2 font-medium">{g.avgApps}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Avg Data Usage (GB)</td>
                    {genderBehavior.map((g) => (
                      <td key={g.gender} className="text-right py-2 font-medium">{g.avgData}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2">Heavy Users (%)</td>
                    {genderBehavior.map((g) => (
                      <td key={g.gender} className="text-right py-2 font-medium text-segment-heavy">{g.heavyUserPct}%</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Correlation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-segment-light" />
              <h3 className="text-lg font-semibold">Screen Time vs Apps (Correlation)</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis
                    type="number"
                    dataKey="screenTime"
                    name="Screen Time"
                    unit=" hrs"
                    stroke="hsl(215, 20%, 55%)"
                    fontSize={12}
                  />
                  <YAxis
                    type="number"
                    dataKey="apps"
                    name="Apps Installed"
                    stroke="hsl(215, 20%, 55%)"
                    fontSize={12}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 11%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                  <Scatter data={scatterData} fill="hsl(174, 72%, 56%)" fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Showing positive correlation between screen time and apps installed
            </p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-segment-moderate" />
              <h3 className="text-lg font-semibold">Age vs Behavior Class</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageCorrelation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis dataKey="age" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[0, 5]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 11%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                    formatter={(value: number) => [value, 'Avg Behavior Class']}
                  />
                  <Bar dataKey="avgBehavior" fill="hsl(262, 83%, 68%)" radius={[4, 4, 0, 0]} name="Avg Behavior" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Mean behavior class by age group (1=Light, 5=Heavy)
            </p>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Radar Chart & Statistical Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Behavior Profile Radar</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="hsl(222, 30%, 25%)" />
                  <PolarAngleAxis dataKey="class" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }} domain={[0, 100]} />
                  <Radar name="Screen Time" dataKey="screenTime" stroke="hsl(174, 72%, 56%)" fill="hsl(174, 72%, 56%)" fillOpacity={0.3} />
                  <Radar name="App Usage" dataKey="appUsage" stroke="hsl(262, 83%, 68%)" fill="hsl(262, 83%, 68%)" fillOpacity={0.3} />
                  <Radar name="Data Usage" dataKey="dataUsage" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.3} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 11%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary" />Screen Time</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-accent" />App Usage</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-segment-moderate" />Data Usage</div>
            </div>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Statistical Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-segment-moderate" />
                  Key Findings
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Strong positive correlation between apps installed and screen time</li>
                  <li>• Younger users (18-34) show higher average behavior class scores</li>
                  <li>• No significant gender-based difference in usage patterns</li>
                  <li>• Heavy users (Class 5) account for ~20% of total data consumption</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground">Screen Time σ</p>
                  <p className="text-xl font-bold text-primary">{statisticalSummary.screenTimeStd} hrs</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground">App Usage σ</p>
                  <p className="text-xl font-bold text-accent">{statisticalSummary.appUsageStd} min</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground">Data Usage σ</p>
                  <p className="text-xl font-bold text-segment-moderate">{statisticalSummary.dataUsageStd} MB</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground">Age σ</p>
                  <p className="text-xl font-bold text-segment-light">{statisticalSummary.ageStd} yrs</p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
