import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common errors
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
    }

    return Promise.reject(new Error(errorMessage));
  }
);

// District services
export const districtService = {
  // Search districts by name
  searchDistricts: async (query) => {
    if (!query || query.length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }
    return api.get(`/districts/search/${encodeURIComponent(query)}`);
  },

  // Get all districts (popular districts from all available states)
  getAllDistricts: async (options = {}) => {
    const params = {
      limit: options.limit || 50
    };
    return api.get('/districts/all', { params });
  },

  // Get districts by state
  getDistrictsByState: async (stateCode) => {
    if (!stateCode) {
      throw new Error('State code is required');
    }
    return api.get(`/districts/state/${stateCode}`);
  },

  // Get district details
  getDistrictDetails: async (districtCode) => {
    if (!districtCode) {
      throw new Error('District code is required');
    }
    return api.get(`/districts/${districtCode}`);
  },

  // Get district rankings
  getDistrictRankings: async (stateCode, financialYear, options = {}) => {
    const params = {
      sortBy: options.sortBy || 'overallScore',
      limit: options.limit || 50
    };
    return api.get(`/districts/rankings/${stateCode}/${financialYear}`, { params });
  },

  // Find districts by location
  findDistrictsByLocation: async (latitude, longitude, options = {}) => {
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
    
    const params = {
      limit: options.limit || 5
    };
    return api.get(`/districts/location/${latitude}/${longitude}`, { params });
  }
};

// Data services
export const dataService = {
  // Get district data
  getDistrictData: async (districtCode, financialYear, useCache = true) => {
    if (!districtCode || !financialYear) {
      throw new Error('District code and financial year are required');
    }
    
    const params = { useCache };
    return api.get(`/data/district/${districtCode}/${financialYear}`, { params });
  },

  // Get bulk district data
  getBulkDistrictData: async (districtCodes, financialYear, useCache = true) => {
    if (!Array.isArray(districtCodes) || districtCodes.length === 0) {
      throw new Error('District codes array is required');
    }
    
    return api.post('/data/bulk', {
      districtCodes,
      financialYear,
      useCache
    });
  },

  // Get historical data
  getHistoricalData: async (districtCode, years = 5) => {
    if (!districtCode) {
      throw new Error('District code is required');
    }
    
    const params = { years };
    return api.get(`/data/history/${districtCode}`, { params });
  },

  // Refresh district data
  refreshDistrictData: async (districtCode, financialYear) => {
    if (!districtCode || !financialYear) {
      throw new Error('District code and financial year are required');
    }
    
    return api.post(`/data/refresh/${districtCode}/${financialYear}`);
  }
};

// Analytics services
export const analyticsService = {
  // Get performance trends
  getPerformanceTrends: async (districtCode, years = 5) => {
    if (!districtCode) {
      throw new Error('District code is required');
    }
    
    const params = { years };
    return api.get(`/analytics/trends/${districtCode}`, { params });
  },

  // Compare districts
  compareDistricts: async (districtCodes, financialYear) => {
    if (!Array.isArray(districtCodes) || districtCodes.length < 2) {
      throw new Error('At least 2 district codes are required for comparison');
    }
    
    return api.post('/analytics/compare', {
      districtCodes,
      financialYear
    });
  },

  // Get state analytics
  getStateAnalytics: async (stateCode, financialYear) => {
    if (!stateCode || !financialYear) {
      throw new Error('State code and financial year are required');
    }
    
    return api.get(`/analytics/state/${stateCode}/${financialYear}`);
  },

  // Get insights and recommendations
  getInsights: async (districtCode, financialYear) => {
    if (!districtCode || !financialYear) {
      throw new Error('District code and financial year are required');
    }
    
    return api.get(`/analytics/insights/${districtCode}/${financialYear}`);
  }
};

// Health check
export const healthService = {
  checkHealth: async () => {
    return api.get('/health');
  }
};

// Utility functions
export const apiUtils = {
  // Format error message for user display
  formatErrorMessage: (error) => {
    if (error.response?.status === 404) {
      return 'Data not found. Please try a different district or time period.';
    } else if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    } else if (error.response?.status >= 500) {
      return 'Server error. Please try again later.';
    } else if (error.code === 'NETWORK_ERROR') {
      return 'Network error. Please check your internet connection.';
    }
    
    return error.message || 'An unexpected error occurred.';
  },

  // Check if error is retryable
  isRetryableError: (error) => {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(error.response?.status) || 
           error.code === 'NETWORK_ERROR' || 
           error.code === 'TIMEOUT';
  },

  // Get current financial year
  getCurrentFinancialYear: () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (currentMonth >= 4) {
      return `${currentYear}-${(currentYear + 1).toString().substr(2)}`;
    } else {
      return `${currentYear - 1}-${currentYear.toString().substr(2)}`;
    }
  },

  // Get available financial years
  getAvailableFinancialYears: (yearsBack = 5) => {
    const currentFY = apiUtils.getCurrentFinancialYear();
    const currentStartYear = parseInt(currentFY.split('-')[0]);
    
    const years = [];
    for (let i = 0; i < yearsBack; i++) {
      const startYear = currentStartYear - i;
      years.push(`${startYear}-${(startYear + 1).toString().substr(2)}`);
    }
    
    return years;
  },

  // Format financial year for display
  formatFinancialYear: (fy) => {
    const [startYear, endYear] = fy.split('-');
    return `FY ${startYear}-20${endYear}`;
  }
};

export default api;