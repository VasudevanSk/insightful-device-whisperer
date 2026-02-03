import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { MobileUsageRecord, BEHAVIOR_CLASS_LABELS, BEHAVIOR_CLASS_COLORS } from '@/types/mobileUsage';
import { getAggregatedStats } from '@/hooks/useMobileData';
import { 
  Smartphone, Clock, Battery, Wifi, AppWindow, Trophy, 
  TrendingUp, TrendingDown, AlertTriangle, Heart, Target
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IndividualDashboardProps {
  data: MobileUsageRecord[];
}

export function IndividualDashboard({ data }: IndividualDashboardProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(data[0]?.User_ID?.toString() || '1');
  const user = data.find(d => d.User_ID.toString() === selectedUserId) || data[0];
  const stats = getAggregatedStats(data);

  if (!user || !stats) return null;

  const screenTimePercentile = (data.filter(d => d.Screen_On_Time <= user.Screen_On_Time).length / data.length) * 100;
  const appUsagePercentile = (data.filter(d => d.App_Usage_Time <= user.App_Usage_Time).length / data.length) * 100;
  const dataUsagePercentile = (data.filter(d => d.Data_Usage <= user.Data_Usage).length / data.length) * 100;

  const behaviorLabel = BEHAVIOR_CLASS_LABELS[user.User_Behavior_Class];
  const behaviorColor = BEHAVIOR_CLASS_COLORS[user.User_Behavior_Class];

  const getWellnessScore = () => {
    // Lower usage = higher wellness score (simplified)
    const screenScore = Math.max(0, 100 - (user.Screen_On_Time / 12) * 100);
    return Math.round(screenScore);
  };

  const wellnessScore = getWellnessScore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* User Selector */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
            {user.Gender === 'Male' ? '👨' : '👩'}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Viewing profile for</p>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-[180px] mt-1">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {data.slice(0, 50).map((d) => (
                  <SelectItem key={d.User_ID} value={d.User_ID.toString()}>
                    User #{d.User_ID} • {d.Age}y • {d.Gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${behaviorColor}20` }}>
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: behaviorColor }} />
          <span className="text-sm font-medium" style={{ color: behaviorColor }}>{behaviorLabel} User</span>
        </div>
      </motion.div>

      {/* Wellness Score */}
      <motion.div variants={itemVariants}>
        <AnimatedCard className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={wellnessScore > 60 ? 'hsl(142, 71%, 45%)' : wellnessScore > 30 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)'}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 352' }}
                  animate={{ strokeDasharray: `${(wellnessScore / 100) * 352} 352` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{wellnessScore}</p>
                  <p className="text-xs text-muted-foreground">Wellness</p>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 justify-center md:justify-start">
                <Heart className="w-5 h-5 text-segment-light" />
                Digital Wellness Score
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {wellnessScore > 60 
                  ? "Great balance! Your screen time is within healthy limits."
                  : wellnessScore > 30
                  ? "Consider reducing screen time for better digital wellness."
                  : "High usage detected. Try setting app limits for a healthier balance."}
              </p>
              {wellnessScore < 50 && (
                <div className="flex items-center gap-2 text-sm text-segment-moderate">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Consider taking regular breaks</span>
                </div>
              )}
            </div>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* Personal Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Screen Time</span>
            </div>
            <p className="text-2xl font-bold">{user.Screen_On_Time} hrs</p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              {user.Screen_On_Time > stats.avgScreenTime ? (
                <>
                  <TrendingUp className="w-3 h-3 text-segment-heavy" />
                  <span className="text-segment-heavy">Above avg</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-segment-light" />
                  <span className="text-segment-light">Below avg</span>
                </>
              )}
            </div>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Smartphone className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">App Usage</span>
            </div>
            <p className="text-2xl font-bold">{user.App_Usage_Time} min</p>
            <p className="text-xs text-muted-foreground mt-2">
              Top {Math.round(100 - appUsagePercentile)}% of users
            </p>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-segment-moderate/10">
                <Battery className="w-5 h-5 text-segment-moderate" />
              </div>
              <span className="text-sm text-muted-foreground">Battery Drain</span>
            </div>
            <p className="text-2xl font-bold">{user.Battery_Drain} mAh</p>
            <Progress value={(user.Battery_Drain / 3000) * 100} className="mt-2 h-2" />
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <Wifi className="w-5 h-5 text-chart-2" />
              </div>
              <span className="text-sm text-muted-foreground">Data Usage</span>
            </div>
            <p className="text-2xl font-bold">{(user.Data_Usage / 1024).toFixed(1)} GB</p>
            <p className="text-xs text-muted-foreground mt-2">
              Top {Math.round(100 - dataUsagePercentile)}% of users
            </p>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Comparison Section */}
      <motion.div variants={itemVariants}>
        <AnimatedCard>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Your Usage vs Average
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Screen Time', value: user.Screen_On_Time, avg: stats.avgScreenTime, unit: 'hrs', max: 12 },
              { label: 'App Usage', value: user.App_Usage_Time, avg: stats.avgAppUsage, unit: 'min', max: 600 },
              { label: 'Apps Installed', value: user.Number_of_Apps_Installed, avg: stats.avgAppsInstalled, unit: '', max: 100 },
              { label: 'Data Usage', value: user.Data_Usage, avg: stats.avgDataUsage, unit: 'MB', max: 2500 },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">
                    {item.value.toFixed(1)} {item.unit}
                    <span className="text-muted-foreground"> / avg {item.avg.toFixed(1)}</span>
                  </span>
                </div>
                <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full bg-muted-foreground/30 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.avg / item.max) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                  <motion.div
                    className={`absolute h-full rounded-full ${item.value > item.avg ? 'bg-segment-heavy' : 'bg-segment-light'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / item.max) * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </motion.div>

      {/* Device Info */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedCard>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-secondary">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Device</p>
              <p className="text-lg font-semibold">{user.Device_Model}</p>
              <p className="text-sm text-muted-foreground">{user.Operating_System}</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-secondary">
              <AppWindow className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Apps Installed</p>
              <p className="text-lg font-semibold">{user.Number_of_Apps_Installed} apps</p>
              <p className="text-sm text-muted-foreground">
                {user.Number_of_Apps_Installed > stats.avgAppsInstalled ? 'Above' : 'Below'} average
              </p>
            </div>
          </div>
        </AnimatedCard>
      </motion.div>
    </motion.div>
  );
}
