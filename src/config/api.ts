// Flask API Configuration
// Update this URL to point to your Flask backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://insightful-device-whisperer-6.onrender.com';

export const API_CONFIG = {
  // Default to localhost for development, override in production
  BASE_URL: API_BASE_URL,
  
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    
    // Upload endpoint
    UPLOAD_DATASET: '/api/upload/dataset',
    
    // Data endpoints
    USERS: '/api/users',
    USER_BY_ID: (id: number) => `/api/users/${id}`,
    
    // Analytics endpoints
    STATS: '/api/stats',
    DEVICE_DISTRIBUTION: '/api/analytics/devices',
    OS_DISTRIBUTION: '/api/analytics/os',
    BEHAVIOR_DISTRIBUTION: '/api/analytics/behavior',
    DEMOGRAPHICS: '/api/analytics/demographics',
    
    // ML Prediction endpoints
    PREDICT_BEHAVIOR: '/api/predict/behavior',
    PREDICT_USAGE: '/api/predict/usage',
    
    // Scenario simulation
    SIMULATE: '/api/simulate',
    
    // Role-specific endpoints
    INDIVIDUAL_INSIGHTS: (userId: number) => `/api/insights/individual/${userId}`,
    DEVELOPER_INSIGHTS: '/api/insights/developer',
    TELECOM_INSIGHTS: '/api/insights/telecom',
    RESEARCHER_INSIGHTS: '/api/insights/researcher',
  },
};
