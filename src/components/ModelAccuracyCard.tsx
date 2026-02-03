import { CheckCircle2, Target, TrendingUp } from "lucide-react";

const metrics = [
  { 
    name: "Classification Accuracy", 
    value: "94.2%", 
    description: "User segment prediction",
    icon: Target,
    color: "text-segment-light"
  },
  { 
    name: "Regression RMSE", 
    value: "0.42", 
    description: "Screen time prediction error",
    icon: TrendingUp,
    color: "text-primary"
  },
  { 
    name: "Model Precision", 
    value: "92.8%", 
    description: "Heavy usage detection",
    icon: CheckCircle2,
    color: "text-accent"
  },
];

export function ModelAccuracyCard() {
  return (
    <div className="metric-card">
      <h3 className="text-lg font-semibold mb-6">Model Performance</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className={`p-2 rounded-lg bg-secondary ${metric.color}`}>
              <metric.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{metric.name}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last trained</span>
          <span className="font-medium text-primary">2 hours ago</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Training samples</span>
          <span className="font-medium">9,000 users</span>
        </div>
      </div>
    </div>
  );
}
