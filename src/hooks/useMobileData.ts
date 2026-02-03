import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { MobileUsageRecord } from '@/types/mobileUsage';

export function useMobileData() {
  const [data, setData] = useState<MobileUsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/mobile_usage.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<MobileUsageRecord>(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setData(results.data.filter(row => row.User_ID));
            setLoading(false);
          },
          error: (err) => {
            setError(err.message);
            setLoading(false);
          },
        });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function getAggregatedStats(data: MobileUsageRecord[]) {
  if (data.length === 0) return null;

  const totalUsers = data.length;
  const avgAppUsage = data.reduce((sum, d) => sum + d.App_Usage_Time, 0) / totalUsers;
  const avgScreenTime = data.reduce((sum, d) => sum + d.Screen_On_Time, 0) / totalUsers;
  const avgBatteryDrain = data.reduce((sum, d) => sum + d.Battery_Drain, 0) / totalUsers;
  const avgDataUsage = data.reduce((sum, d) => sum + d.Data_Usage, 0) / totalUsers;
  const avgAppsInstalled = data.reduce((sum, d) => sum + d.Number_of_Apps_Installed, 0) / totalUsers;

  // Device distribution
  const deviceCounts = data.reduce((acc, d) => {
    acc[d.Device_Model] = (acc[d.Device_Model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // OS distribution
  const osCounts = data.reduce((acc, d) => {
    acc[d.Operating_System] = (acc[d.Operating_System] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Behavior class distribution
  const behaviorCounts = data.reduce((acc, d) => {
    acc[d.User_Behavior_Class] = (acc[d.User_Behavior_Class] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Age distribution
  const ageGroups = {
    '18-24': data.filter(d => d.Age >= 18 && d.Age <= 24).length,
    '25-34': data.filter(d => d.Age >= 25 && d.Age <= 34).length,
    '35-44': data.filter(d => d.Age >= 35 && d.Age <= 44).length,
    '45-54': data.filter(d => d.Age >= 45 && d.Age <= 54).length,
    '55+': data.filter(d => d.Age >= 55).length,
  };

  // Gender distribution
  const genderCounts = data.reduce((acc, d) => {
    acc[d.Gender] = (acc[d.Gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalUsers,
    avgAppUsage,
    avgScreenTime,
    avgBatteryDrain,
    avgDataUsage,
    avgAppsInstalled,
    deviceCounts,
    osCounts,
    behaviorCounts,
    ageGroups,
    genderCounts,
  };
}
