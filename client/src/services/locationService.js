// Location service for handling geolocation functionality
export class LocationService {
  constructor() {
    this.cachedPosition = null;
    this.lastCacheTime = null;
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Check if geolocation is supported
  isGeolocationSupported() {
    return 'geolocation' in navigator;
  }

  // Get current position with caching
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000, // 5 minutes
      ...options
    };

    // Return cached position if still valid
    if (this.cachedPosition && this.lastCacheTime) {
      const cacheAge = Date.now() - this.lastCacheTime;
      if (cacheAge < this.cacheTimeout) {
        return this.cachedPosition;
      }
    }

    if (!this.isGeolocationSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const result = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          // Cache the position
          this.cachedPosition = result;
          this.lastCacheTime = Date.now();
          
          resolve(result);
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location';
              break;
          }
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }

  // Watch position changes
  watchPosition(callback, errorCallback, options = {}) {
    if (!this.isGeolocationSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        const result = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        callback(result);
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location';
            break;
        }
        if (errorCallback) {
          errorCallback(new Error(errorMessage));
        }
      },
      defaultOptions
    );
  }

  // Clear watch
  clearWatch(watchId) {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  // Check location permission status
  async checkPermissionStatus() {
    if (!navigator.permissions) {
      return 'unknown';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      return 'unknown';
    }
  }

  // Request location permission
  async requestPermission() {
    const status = await this.checkPermissionStatus();
    
    if (status === 'granted') {
      return true;
    }
    
    if (status === 'denied') {
      return false;
    }

    // For 'prompt' or 'unknown', try to get position which will trigger permission request
    try {
      await this.getCurrentPosition({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Clear cached position
  clearCache() {
    this.cachedPosition = null;
    this.lastCacheTime = null;
  }

  // Get cached position if available
  getCachedPosition() {
    if (this.cachedPosition && this.lastCacheTime) {
      const cacheAge = Date.now() - this.lastCacheTime;
      if (cacheAge < this.cacheTimeout) {
        return this.cachedPosition;
      }
    }
    return null;
  }

  // Validate coordinates
  static validateCoordinates(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return false;
    }
    
    // Check for valid latitude/longitude ranges
    if (latitude < -90 || latitude > 90) {
      return false;
    }
    
    if (longitude < -180 || longitude > 180) {
      return false;
    }
    
    return true;
  }

  // Check if coordinates are within India bounds (approximate)
  static isWithinIndiaBounds(latitude, longitude) {
    if (!LocationService.validateCoordinates(latitude, longitude)) {
      return false;
    }
    
    // Approximate bounds of India
    const indiaBounds = {
      north: 37.5,
      south: 6.0,
      east: 97.5,
      west: 68.0
    };
    
    return (
      latitude >= indiaBounds.south &&
      latitude <= indiaBounds.north &&
      longitude >= indiaBounds.west &&
      longitude <= indiaBounds.east
    );
  }

  // Calculate distance between two points (Haversine formula)
  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Format distance for display
  static formatDistance(distanceInKm) {
    if (distanceInKm < 1) {
      return `${Math.round(distanceInKm * 1000)} m`;
    } else if (distanceInKm < 10) {
      return `${distanceInKm.toFixed(1)} km`;
    } else {
      return `${Math.round(distanceInKm)} km`;
    }
  }
}

// Create singleton instance
export const locationService = new LocationService();

export default locationService;