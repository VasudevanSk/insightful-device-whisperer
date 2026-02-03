import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { IndividualDashboard } from '@/components/dashboards/IndividualDashboard';
import { DeveloperDashboard } from '@/components/dashboards/DeveloperDashboard';
import { TelecomDashboard } from '@/components/dashboards/TelecomDashboard';
import { ResearcherDashboard } from '@/components/dashboards/ResearcherDashboard';
import { useMobileData } from '@/hooks/useMobileData';
import { UserRole } from '@/types/mobileUsage';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('individual');
  const { data, loading, error } = useMobileData();

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-destructive text-lg mb-2">Failed to load data</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }

    const dashboards = {
      individual: <IndividualDashboard data={data} />,
      developer: <DeveloperDashboard data={data} />,
      telecom: <TelecomDashboard data={data} />,
      researcher: <ResearcherDashboard data={data} />,
    };

    return dashboards[currentRole];
  };

  const roleDescriptions: Record<UserRole, { title: string; subtitle: string }> = {
    individual: {
      title: 'Personal Usage Insights',
      subtitle: 'Track your digital wellness, compare with others, and understand your mobile habits.',
    },
    developer: {
      title: 'App Developer Analytics',
      subtitle: 'Understand user engagement patterns, device distribution, and optimize for your target audience.',
    },
    telecom: {
      title: 'Network & Subscriber Analytics',
      subtitle: 'Monitor data consumption, network load, and segment users for optimized pricing strategies.',
    },
    researcher: {
      title: 'Behavioral Research Dashboard',
      subtitle: 'Analyze correlations, demographic patterns, and statistical insights for academic research.',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <Header />
      
      <main className="container relative px-4 md:px-6 py-6 md:py-8">
        {/* Role Switcher */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />
        </motion.div>

        {/* Dynamic Header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              {roleDescriptions[currentRole].title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="gradient-text">{roleDescriptions[currentRole].title.split(' ').slice(-1)}</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
              {roleDescriptions[currentRole].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderDashboard()}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>DeviceIQ Analytics Platform • AI-Driven Mobile Usage Intelligence</p>
          <p className="mt-1">Dataset: {data.length} users • Built for multi-stakeholder insights</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
