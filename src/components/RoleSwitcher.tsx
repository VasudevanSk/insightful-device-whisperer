import { motion } from 'framer-motion';
import { UserRole } from '@/types/mobileUsage';
import { User, Code2, Radio, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: { id: UserRole; label: string; icon: typeof User; description: string }[] = [
  { id: 'individual', label: 'Individual User', icon: User, description: 'Personal insights' },
  { id: 'developer', label: 'App Developer', icon: Code2, description: 'Usage analytics' },
  { id: 'telecom', label: 'Telecom', icon: Radio, description: 'Network insights' },
  { id: 'researcher', label: 'Researcher', icon: Brain, description: 'Behavior analysis' },
];

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max p-1 bg-secondary/50 rounded-xl backdrop-blur-sm">
        {roles.map((role) => {
          const isActive = currentRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-3 rounded-lg transition-colors text-left min-w-[140px]',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeRole"
                  className="absolute inset-0 bg-gradient-primary rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2">
                <role.icon className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium whitespace-nowrap">{role.label}</p>
                  <p className={cn(
                    'text-xs hidden sm:block',
                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}>
                    {role.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
