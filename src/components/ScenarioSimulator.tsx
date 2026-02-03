import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Zap, Battery, Wifi, Smartphone, Play } from "lucide-react";

export function ScenarioSimulator() {
  const [appsInstalled, setAppsInstalled] = useState([35]);
  const [ageGroup, setAgeGroup] = useState("25-34");
  const [deviceType, setDeviceType] = useState("flagship");
  const [predictions, setPredictions] = useState({
    screenTime: 5.2,
    batteryDrain: 48,
    dataUsage: 2.1,
    segment: "Moderate",
  });

  const runSimulation = () => {
    // Simulate ML prediction based on inputs
    const baseScreen = 4.0;
    const appsFactor = appsInstalled[0] * 0.05;
    const ageFactor = ageGroup === "18-24" ? 1.5 : ageGroup === "25-34" ? 1.2 : 0.8;
    const deviceFactor = deviceType === "flagship" ? 1.1 : deviceType === "midrange" ? 1.0 : 0.9;

    const screenTime = +(baseScreen + appsFactor * ageFactor * deviceFactor).toFixed(1);
    const batteryDrain = Math.min(95, Math.round(30 + appsInstalled[0] * 0.8 + screenTime * 5));
    const dataUsage = +(screenTime * 0.4 + appsInstalled[0] * 0.02).toFixed(1);
    
    let segment = "Light";
    if (screenTime > 6) segment = "Heavy";
    else if (screenTime > 4) segment = "Moderate";

    setPredictions({ screenTime, batteryDrain, dataUsage, segment });
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "Light": return "text-segment-light";
      case "Moderate": return "text-segment-moderate";
      case "Heavy": return "text-segment-heavy";
      default: return "text-foreground";
    }
  };

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <Zap className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">What-If Scenario Simulator</h3>
          <p className="text-sm text-muted-foreground">Predict usage based on user features</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Apps Installed Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Apps Installed</span>
            <span className="font-medium">{appsInstalled[0]} apps</span>
          </div>
          <Slider
            value={appsInstalled}
            onValueChange={setAppsInstalled}
            max={100}
            min={5}
            step={1}
            className="cursor-pointer"
          />
        </div>

        {/* Age Group Select */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Age Group</label>
          <Select value={ageGroup} onValueChange={setAgeGroup}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18-24">18-24 years</SelectItem>
              <SelectItem value="25-34">25-34 years</SelectItem>
              <SelectItem value="35-44">35-44 years</SelectItem>
              <SelectItem value="45+">45+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Device Type Select */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Device Type</label>
          <Select value={deviceType} onValueChange={setDeviceType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flagship">Flagship</SelectItem>
              <SelectItem value="midrange">Mid-range</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={runSimulation} className="w-full" size="lg">
          <Play className="w-4 h-4 mr-2" />
          Run Prediction
        </Button>

        {/* Predictions Display */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-4 text-muted-foreground">Predicted Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Screen Time</span>
              </div>
              <p className="text-xl font-bold">{predictions.screenTime} hrs</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-1">
                <Battery className="w-4 h-4 text-segment-moderate" />
                <span className="text-xs text-muted-foreground">Battery Drain</span>
              </div>
              <p className="text-xl font-bold">{predictions.batteryDrain}%</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">Data Usage</span>
              </div>
              <p className="text-xl font-bold">{predictions.dataUsage} GB</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-segment-light" />
                <span className="text-xs text-muted-foreground">Segment</span>
              </div>
              <p className={`text-xl font-bold ${getSegmentColor(predictions.segment)}`}>
                {predictions.segment}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
