import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { SegmentChart } from "@/components/SegmentChart";
import { UsageTrendsChart } from "@/components/UsageTrendsChart";
import { FeatureImportanceChart } from "@/components/FeatureImportanceChart";
import { ScenarioSimulator } from "@/components/ScenarioSimulator";
import { DemographicsPanel } from "@/components/DemographicsPanel";
import { ModelAccuracyCard } from "@/components/ModelAccuracyCard";
import { Smartphone, Clock, Wifi, Battery, AppWindow, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <Header />
      
      <main className="container relative px-4 md:px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Mobile Usage <span className="gradient-text">Analytics</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            AI-powered insights into device usage patterns, user behavior segmentation, 
            and predictive analytics for app developers, telcos, and digital wellness platforms.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <MetricCard
            title="Total Users"
            value="9,000"
            subtitle="Active in dataset"
            icon={<Users className="w-5 h-5" />}
            trend={12}
          />
          <MetricCard
            title="Avg Screen Time"
            value="5.2 hrs"
            subtitle="Daily average"
            icon={<Clock className="w-5 h-5" />}
            trend={8}
          />
          <MetricCard
            title="Data Usage"
            value="2.4 GB"
            subtitle="Daily average"
            icon={<Wifi className="w-5 h-5" />}
            trend={-3}
          />
          <MetricCard
            title="Battery Drain"
            value="52%"
            subtitle="Avg daily consumption"
            icon={<Battery className="w-5 h-5" />}
            trend={5}
          />
          <MetricCard
            title="Apps Installed"
            value="38"
            subtitle="Average per user"
            icon={<AppWindow className="w-5 h-5" />}
            trend={15}
          />
          <MetricCard
            title="Device Models"
            value="142"
            subtitle="Unique devices"
            icon={<Smartphone className="w-5 h-5" />}
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <UsageTrendsChart />
          </div>
          <SegmentChart />
        </div>

        {/* Feature Importance & Model Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FeatureImportanceChart />
          <ModelAccuracyCard />
        </div>

        {/* Scenario Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ScenarioSimulator />
          <div className="metric-card flex flex-col justify-center items-center text-center p-8">
            <div className="p-4 rounded-2xl bg-gradient-primary mb-6">
              <Smartphone className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ready for Production</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Deploy the prediction API for real-time user behavior classification and 
              usage metric forecasting in your applications.
            </p>
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-lg bg-secondary text-sm">
                <span className="text-muted-foreground">API Endpoint</span>
                <p className="font-mono text-primary">/api/v1/predict</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-secondary text-sm">
                <span className="text-muted-foreground">Response Time</span>
                <p className="font-mono text-segment-light">~45ms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics Panel */}
        <DemographicsPanel />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>DeviceIQ Analytics Platform • AI-Driven Mobile Usage Intelligence</p>
          <p className="mt-1">Built for app developers, telcos, and digital wellness platforms</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
