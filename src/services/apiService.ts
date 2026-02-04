import { API_CONFIG } from '@/config/api';
import { MobileUsageRecord } from '@/types/mobileUsage';

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ML Prediction types
export interface BehaviorPrediction {
  predicted_class: number;
  confidence: number;
  probabilities: Record<number, number>;
}

export interface UsagePrediction {
  predicted_screen_time: number;
  predicted_app_usage: number;
  predicted_data_usage: number;
  predicted_battery_drain: number;
}

export interface SimulationResult {
  original: {
    behavior_class: number;
    screen_time: number;
    battery_drain: number;
    data_usage: number;
  };
  predicted: {
    behavior_class: number;
    screen_time: number;
    battery_drain: number;
    data_usage: number;
  };
  changes: Record<string, number>;
}

export interface AggregatedStats {
  totalUsers: number;
  avgAppUsage: number;
  avgScreenTime: number;
  avgBatteryDrain: number;
  avgDataUsage: number;
  avgAppsInstalled: number;
  deviceCounts: Record<string, number>;
  osCounts: Record<string, number>;
  behaviorCounts: Record<number, number>;
  ageGroups: Record<string, number>;
  genderCounts: Record<string, number>;
}

// API error handler
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error ${response.status}`,
        response.status,
        errorData.code
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      undefined,
      'NETWORK_ERROR'
    );
  }
}

// API Service methods
export const apiService = {
  // ============ Data Endpoints ============
  
  // Get all users data
  async getAllUsers(): Promise<MobileUsageRecord[]> {
    const response = await apiFetch<ApiResponse<MobileUsageRecord[]>>(
      API_CONFIG.ENDPOINTS.USERS
    );
    return response.data;
  },

  // Get user by ID
  async getUserById(userId: number): Promise<MobileUsageRecord> {
    const response = await apiFetch<ApiResponse<MobileUsageRecord>>(
      API_CONFIG.ENDPOINTS.USER_BY_ID(userId)
    );
    return response.data;
  },

  // ============ Analytics Endpoints ============
  
  // Get aggregated statistics
  async getStats(): Promise<AggregatedStats> {
    const response = await apiFetch<ApiResponse<AggregatedStats>>(
      API_CONFIG.ENDPOINTS.STATS
    );
    return response.data;
  },

  // Get device distribution
  async getDeviceDistribution(): Promise<Record<string, number>> {
    const response = await apiFetch<ApiResponse<Record<string, number>>>(
      API_CONFIG.ENDPOINTS.DEVICE_DISTRIBUTION
    );
    return response.data;
  },

  // Get OS distribution
  async getOSDistribution(): Promise<Record<string, number>> {
    const response = await apiFetch<ApiResponse<Record<string, number>>>(
      API_CONFIG.ENDPOINTS.OS_DISTRIBUTION
    );
    return response.data;
  },

  // Get behavior distribution
  async getBehaviorDistribution(): Promise<Record<number, number>> {
    const response = await apiFetch<ApiResponse<Record<number, number>>>(
      API_CONFIG.ENDPOINTS.BEHAVIOR_DISTRIBUTION
    );
    return response.data;
  },

  // Get demographics data
  async getDemographics(): Promise<{
    ageGroups: Record<string, number>;
    genderCounts: Record<string, number>;
  }> {
    const response = await apiFetch<
      ApiResponse<{
        ageGroups: Record<string, number>;
        genderCounts: Record<string, number>;
      }>
    >(API_CONFIG.ENDPOINTS.DEMOGRAPHICS);
    return response.data;
  },

  // ============ ML Prediction Endpoints ============
  
  // Predict user behavior class
  async predictBehavior(features: {
    device_model: string;
    operating_system: string;
    app_usage_time: number;
    screen_on_time: number;
    battery_drain: number;
    number_of_apps_installed: number;
    data_usage: number;
    age: number;
    gender: string;
  }): Promise<BehaviorPrediction> {
    const response = await apiFetch<ApiResponse<BehaviorPrediction>>(
      API_CONFIG.ENDPOINTS.PREDICT_BEHAVIOR,
      {
        method: 'POST',
        body: JSON.stringify(features),
      }
    );
    return response.data;
  },

  // Predict usage metrics
  async predictUsage(features: {
    device_model: string;
    operating_system: string;
    number_of_apps_installed: number;
    age: number;
    gender: string;
  }): Promise<UsagePrediction> {
    const response = await apiFetch<ApiResponse<UsagePrediction>>(
      API_CONFIG.ENDPOINTS.PREDICT_USAGE,
      {
        method: 'POST',
        body: JSON.stringify(features),
      }
    );
    return response.data;
  },

  // ============ Simulation Endpoint ============
  
  // Run what-if scenario simulation
  async simulate(params: {
    base_user_id: number;
    changes: {
      apps_installed_delta?: number;
      device_model?: string;
      operating_system?: string;
    };
  }): Promise<SimulationResult> {
    const response = await apiFetch<ApiResponse<SimulationResult>>(
      API_CONFIG.ENDPOINTS.SIMULATE,
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    return response.data;
  },

  // ============ Role-Specific Insights ============
  
  // Get individual user insights
  async getIndividualInsights(userId: number): Promise<{
    wellness_score: number;
    percentiles: Record<string, number>;
    recommendations: string[];
  }> {
    const response = await apiFetch<
      ApiResponse<{
        wellness_score: number;
        percentiles: Record<string, number>;
        recommendations: string[];
      }>
    >(API_CONFIG.ENDPOINTS.INDIVIDUAL_INSIGHTS(userId));
    return response.data;
  },

  // Get developer insights
  async getDeveloperInsights(): Promise<{
    user_segments: Record<string, any>;
    engagement_metrics: Record<string, number>;
    device_optimization: Record<string, any>;
  }> {
    const response = await apiFetch<
      ApiResponse<{
        user_segments: Record<string, any>;
        engagement_metrics: Record<string, number>;
        device_optimization: Record<string, any>;
      }>
    >(API_CONFIG.ENDPOINTS.DEVELOPER_INSIGHTS);
    return response.data;
  },

  // Get telecom insights
  async getTelecomInsights(): Promise<{
    total_data_traffic: number;
    segment_breakdown: Record<string, any>;
    network_load: Record<string, number>;
    pricing_recommendations: string[];
  }> {
    const response = await apiFetch<
      ApiResponse<{
        total_data_traffic: number;
        segment_breakdown: Record<string, any>;
        network_load: Record<string, number>;
        pricing_recommendations: string[];
      }>
    >(API_CONFIG.ENDPOINTS.TELECOM_INSIGHTS);
    return response.data;
  },

  // Get researcher insights
  async getResearcherInsights(): Promise<{
    correlations: Record<string, number>;
    statistical_summary: Record<string, any>;
    behavior_profiles: Record<string, any>;
  }> {
    const response = await apiFetch<
      ApiResponse<{
        correlations: Record<string, number>;
        statistical_summary: Record<string, any>;
        behavior_profiles: Record<string, any>;
      }>
    >(API_CONFIG.ENDPOINTS.RESEARCHER_INSIGHTS);
    return response.data;
  },
};

export default apiService;
