export interface MobileUsageRecord {
  User_ID: number;
  Device_Model: string;
  Operating_System: string;
  App_Usage_Time: number; // minutes
  Screen_On_Time: number; // hours
  Battery_Drain: number; // mAh
  Number_of_Apps_Installed: number;
  Data_Usage: number; // MB
  Age: number;
  Gender: string;
  User_Behavior_Class: number; // 1-5 (1=Light, 5=Heavy)
}

export type UserRole = 'individual' | 'developer' | 'telecom' | 'researcher';

export const BEHAVIOR_CLASS_LABELS: Record<number, string> = {
  1: 'Light',
  2: 'Low-Moderate',
  3: 'Moderate',
  4: 'High',
  5: 'Heavy',
};

export const BEHAVIOR_CLASS_COLORS: Record<number, string> = {
  1: 'hsl(142, 71%, 45%)',
  2: 'hsl(142, 50%, 55%)',
  3: 'hsl(38, 92%, 50%)',
  4: 'hsl(25, 95%, 53%)',
  5: 'hsl(0, 84%, 60%)',
};
