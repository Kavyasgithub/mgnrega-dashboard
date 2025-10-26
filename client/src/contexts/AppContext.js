import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  selectedDistrict: null,
  selectedFinancialYear: getCurrentFinancialYear(),
  comparisonDistricts: [],
  favorites: JSON.parse(localStorage.getItem('mgnrega_favorites') || '[]'),
  preferences: {
    theme: 'light',
    defaultView: 'cards',
    showTutorial: !localStorage.getItem('mgnrega_tutorial_completed'),
    language: 'en'
  },
  loading: false,
  error: null
};

// Action types
const ActionTypes = {
  SET_SELECTED_DISTRICT: 'SET_SELECTED_DISTRICT',
  SET_FINANCIAL_YEAR: 'SET_FINANCIAL_YEAR',
  ADD_COMPARISON_DISTRICT: 'ADD_COMPARISON_DISTRICT',
  REMOVE_COMPARISON_DISTRICT: 'REMOVE_COMPARISON_DISTRICT',
  CLEAR_COMPARISON: 'CLEAR_COMPARISON',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_DISTRICT:
      return {
        ...state,
        selectedDistrict: action.payload,
        error: null
      };

    case ActionTypes.SET_FINANCIAL_YEAR:
      return {
        ...state,
        selectedFinancialYear: action.payload,
        error: null
      };

    case ActionTypes.ADD_COMPARISON_DISTRICT:
      if (state.comparisonDistricts.length >= 5) {
        return {
          ...state,
          error: 'Maximum 5 districts can be compared at once'
        };
      }
      
      if (state.comparisonDistricts.find(d => d.districtCode === action.payload.districtCode)) {
        return {
          ...state,
          error: 'District already added to comparison'
        };
      }

      return {
        ...state,
        comparisonDistricts: [...state.comparisonDistricts, action.payload],
        error: null
      };

    case ActionTypes.REMOVE_COMPARISON_DISTRICT:
      return {
        ...state,
        comparisonDistricts: state.comparisonDistricts.filter(
          d => d.districtCode !== action.payload
        ),
        error: null
      };

    case ActionTypes.CLEAR_COMPARISON:
      return {
        ...state,
        comparisonDistricts: [],
        error: null
      };

    case ActionTypes.ADD_FAVORITE:
      if (state.favorites.find(f => f.districtCode === action.payload.districtCode)) {
        return state;
      }
      
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('mgnrega_favorites', JSON.stringify(newFavorites));
      
      return {
        ...state,
        favorites: newFavorites,
        error: null
      };

    case ActionTypes.REMOVE_FAVORITE:
      const filteredFavorites = state.favorites.filter(
        f => f.districtCode !== action.payload
      );
      localStorage.setItem('mgnrega_favorites', JSON.stringify(filteredFavorites));
      
      return {
        ...state,
        favorites: filteredFavorites,
        error: null
      };

    case ActionTypes.UPDATE_PREFERENCES:
      const updatedPreferences = { ...state.preferences, ...action.payload };
      localStorage.setItem('mgnrega_preferences', JSON.stringify(updatedPreferences));
      
      return {
        ...state,
        preferences: updatedPreferences,
        error: null
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved preferences on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('mgnrega_preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({
          type: ActionTypes.UPDATE_PREFERENCES,
          payload: preferences
        });
      } catch (error) {
        console.warn('Failed to load saved preferences:', error);
      }
    }
  }, []);

  // Action creators
  const actions = {
    setSelectedDistrict: (district) => 
      dispatch({ type: ActionTypes.SET_SELECTED_DISTRICT, payload: district }),

    setFinancialYear: (year) => 
      dispatch({ type: ActionTypes.SET_FINANCIAL_YEAR, payload: year }),

    addComparisonDistrict: (district) => 
      dispatch({ type: ActionTypes.ADD_COMPARISON_DISTRICT, payload: district }),

    removeComparisonDistrict: (districtCode) => 
      dispatch({ type: ActionTypes.REMOVE_COMPARISON_DISTRICT, payload: districtCode }),

    clearComparison: () => 
      dispatch({ type: ActionTypes.CLEAR_COMPARISON }),

    addFavorite: (district) => 
      dispatch({ type: ActionTypes.ADD_FAVORITE, payload: district }),

    removeFavorite: (districtCode) => 
      dispatch({ type: ActionTypes.REMOVE_FAVORITE, payload: districtCode }),

    updatePreferences: (preferences) => 
      dispatch({ type: ActionTypes.UPDATE_PREFERENCES, payload: preferences }),

    setLoading: (loading) => 
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),

    setError: (error) => 
      dispatch({ type: ActionTypes.SET_ERROR, payload: error }),

    clearError: () => 
      dispatch({ type: ActionTypes.CLEAR_ERROR })
  };

  const value = {
    ...state,
    actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Utility functions
function getCurrentFinancialYear() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  if (currentMonth >= 4) {
    // April to December: FY is current year to next year
    return `${currentYear}-${(currentYear + 1).toString().substr(2)}`;
  } else {
    // January to March: FY is previous year to current year
    return `${currentYear - 1}-${currentYear.toString().substr(2)}`;
  }
}

// Financial year utility functions
export const financialYearUtils = {
  getCurrentFinancialYear,
  
  getAvailableFinancialYears: (yearsBack = 5) => {
    const current = getCurrentFinancialYear();
    const currentStartYear = parseInt(current.split('-')[0]);
    
    const years = [];
    for (let i = 0; i < yearsBack; i++) {
      const startYear = currentStartYear - i;
      years.push(`${startYear}-${(startYear + 1).toString().substr(2)}`);
    }
    
    return years;
  },
  
  formatFinancialYear: (fy) => {
    const [startYear, endYear] = fy.split('-');
    return `${startYear}-${20}${endYear}`;
  },
  
  getFinancialYearLabel: (fy) => {
    const [startYear, endYear] = fy.split('-');
    return `FY ${startYear}-${endYear}`;
  }
};