import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon: ReactNode;
  className?: string;
}

export function MetricCard({ title, value, subtitle, trend, icon, className }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-segment-light" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return "";
    if (trend > 0) return "text-segment-light";
    if (trend < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <div className={cn("metric-card group", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
            {getTrendIcon()}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
