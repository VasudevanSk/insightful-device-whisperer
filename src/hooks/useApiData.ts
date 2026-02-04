import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService, {
  AggregatedStats,
  BehaviorPrediction,
  UsagePrediction,
  SimulationResult,
} from '@/services/apiService';
import { MobileUsageRecord } from '@/types/mobileUsage';

// Query keys for caching
export const QUERY_KEYS = {
  users: ['users'],
  user: (id: number) => ['user', id],
  stats: ['stats'],
  deviceDistribution: ['analytics', 'devices'],
  osDistribution: ['analytics', 'os'],
  behaviorDistribution: ['analytics', 'behavior'],
  demographics: ['analytics', 'demographics'],
  individualInsights: (id: number) => ['insights', 'individual', id],
  developerInsights: ['insights', 'developer'],
  telecomInsights: ['insights', 'telecom'],
  researcherInsights: ['insights', 'researcher'],
};

// Hook to fetch all users
export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: apiService.getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch single user
export function useUser(userId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.user(userId),
    queryFn: () => apiService.getUserById(userId),
    enabled: !!userId,
  });
}

// Hook to fetch aggregated stats
export function useStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: apiService.getStats,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for device distribution
export function useDeviceDistribution() {
  return useQuery({
    queryKey: QUERY_KEYS.deviceDistribution,
    queryFn: apiService.getDeviceDistribution,
  });
}

// Hook for OS distribution
export function useOSDistribution() {
  return useQuery({
    queryKey: QUERY_KEYS.osDistribution,
    queryFn: apiService.getOSDistribution,
  });
}

// Hook for behavior distribution
export function useBehaviorDistribution() {
  return useQuery({
    queryKey: QUERY_KEYS.behaviorDistribution,
    queryFn: apiService.getBehaviorDistribution,
  });
}

// Hook for demographics
export function useDemographics() {
  return useQuery({
    queryKey: QUERY_KEYS.demographics,
    queryFn: apiService.getDemographics,
  });
}

// Hook for behavior prediction mutation
export function useBehaviorPrediction() {
  return useMutation({
    mutationFn: apiService.predictBehavior,
  });
}

// Hook for usage prediction mutation
export function useUsagePrediction() {
  return useMutation({
    mutationFn: apiService.predictUsage,
  });
}

// Hook for simulation
export function useSimulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulate = useCallback(
    async (params: Parameters<typeof apiService.simulate>[0]) => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.simulate(params);
        setResult(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Simulation failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { simulate, result, loading, error };
}

// Role-specific insight hooks
export function useIndividualInsights(userId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.individualInsights(userId),
    queryFn: () => apiService.getIndividualInsights(userId),
    enabled: !!userId,
  });
}

export function useDeveloperInsights() {
  return useQuery({
    queryKey: QUERY_KEYS.developerInsights,
    queryFn: apiService.getDeveloperInsights,
  });
}

export function useTelecomInsights() {
  return useQuery({
    queryKey: QUERY_KEYS.telecomInsights,
    queryFn: apiService.getTelecomInsights,
  });
}

export function useResearcherInsights() {
  return useQuery({
    queryKey: QUERY_KEYS.researcherInsights,
    queryFn: apiService.getResearcherInsights,
  });
}

// Combined hook that tries API first, falls back to local CSV
export function useMobileDataWithFallback() {
  const [data, setData] = useState<MobileUsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'local'>('api');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try API first
        const apiData = await apiService.getAllUsers();
        setData(apiData);
        setSource('api');
        setLoading(false);
      } catch (apiError) {
        console.warn('API unavailable, falling back to local CSV:', apiError);
        
        // Fall back to local CSV
        try {
          const { useMobileData } = await import('./useMobileData');
          // Since useMobileData is a hook, we need to fetch directly
          const response = await fetch('/data/mobile_usage.csv');
          const csvText = await response.text();
          const Papa = (await import('papaparse')).default;
          
          Papa.parse<MobileUsageRecord>(csvText, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
              setData(results.data.filter((row) => row.User_ID));
              setSource('local');
              setLoading(false);
            },
            error: (err) => {
              setError(err.message);
              setLoading(false);
            },
          });
        } catch (localError) {
          setError(
            localError instanceof Error
              ? localError.message
              : 'Failed to load data'
          );
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  return { data, loading, error, source };
}
