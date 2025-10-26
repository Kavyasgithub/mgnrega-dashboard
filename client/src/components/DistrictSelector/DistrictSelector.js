import React, { useState, useEffect, useMemo } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
  Collapse
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Search as SearchIcon,
  MyLocation as MyLocationIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { districtUtils } from '../../data/districts';
import { locationService } from '../../services/locationService';

function DistrictSelector({ 
  value, 
  onChange, 
  label = 'Select District',
  placeholder = 'Search for a district...',
  size = 'medium',
  fullWidth = false,
  error = false,
  helperText = '',
  disabled = false,
  showLocationButton = true
}) {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Search results using static data
  const searchResults = useMemo(() => {
    if (searchQuery.length >= 2) {
      return districtUtils.searchDistricts(searchQuery, 20);
    }
    return [];
  }, [searchQuery]);

  // Popular districts from all available states
  const popularDistricts = useMemo(() => {
    return districtUtils.getAllDistricts(30);
  }, []);

  // Nearby districts based on user location
  const nearbyDistricts = useMemo(() => {
    if (userLocation && 
        locationService.constructor.isWithinIndiaBounds(
          userLocation.latitude, 
          userLocation.longitude
        )) {
      return districtUtils.findNearbyDistricts(
        userLocation.latitude,
        userLocation.longitude,
        10
      );
    }
    return [];
  }, [userLocation]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear any cached position on unmount to prevent stale data
      if (userLocation) {
        locationService.clearCache();
      }
    };
  }, [userLocation]);

  // Combine options: search results, nearby districts, or popular districts
  const options = searchQuery.length >= 2 
    ? searchResults 
    : nearbyDistricts.length > 0 
      ? nearbyDistricts 
      : popularDistricts;
  
  // No loading since we're using static data
  const isLoading = false;

  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  // Handle location detection
  const handleDetectLocation = async () => {
    if (!showLocationButton || disabled) return;
    
    setIsDetectingLocation(true);
    setLocationError(null);

    try {
      // Check if geolocation is supported
      if (!locationService.isGeolocationSupported()) {
        throw new Error('Geolocation is not supported by your browser');
      }

      // Get current position
      const position = await locationService.getCurrentPosition({
        timeout: 15000,
        enableHighAccuracy: true
      });

      // Validate coordinates are within India bounds
      if (!locationService.constructor.isWithinIndiaBounds(
        position.latitude, 
        position.longitude
      )) {
        throw new Error('Your location appears to be outside India');
      }

      setUserLocation(position);
      
      // Clear any previous search query to show nearby districts
      setInputValue('');
      setSearchQuery('');

    } catch (error) {
      console.error('Location detection failed:', error);
      setLocationError(error.message);
      setUserLocation(null);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Clear location error
  const handleClearLocationError = () => {
    setLocationError(null);
  };

  const renderOption = (props, option) => (
    <Box component="li" {...props} key={option.districtCode}>
      <LocationIcon sx={{ mr: 2, color: 'text.secondary' }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2">
          {option.districtName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {option.stateName}
          {option.distance && (
            <> • {locationService.constructor.formatDistance(option.distance / 1000)} away</>
          )}
        </Typography>
      </Box>
    </Box>
  );

  const renderTags = (value, getTagProps) => (
    value.map((option, index) => (
      <Chip
        variant="outlined"
        label={`${option.districtName}, ${option.stateName}`}
        size="small"
        {...getTagProps({ index })}
        key={option.districtCode}
      />
    ))
  );

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option) => 
        option ? `${option.districtName}, ${option.stateName}` : ''
      }
      isOptionEqualToValue={(option, value) => 
        option.districtCode === value?.districtCode
      }
      loading={false}
      loadingText=""
      noOptionsText={
        searchQuery.length < 2 
          ? (showLocationButton ? "Type to search or use location button to find nearby districts" : "Type at least 2 characters to search")
          : "No districts found"
      }
      renderOption={renderOption}
      renderTags={renderTags}
      filterOptions={(x) => x} // Don't filter, we handle it via API
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      renderInput={(params) => (
        <Box>
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <React.Fragment>
                  {showLocationButton && !disabled && (
                    <InputAdornment position="end">
                      <Tooltip 
                        title={
                          userLocation 
                            ? "Showing nearby districts" 
                            : "Detect your location to find nearby districts"
                        }
                      >
                        <IconButton
                          onClick={handleDetectLocation}
                          disabled={isDetectingLocation}
                          size="small"
                          color={userLocation ? "primary" : "default"}
                          sx={{ mr: 1 }}
                        >
                          {isDetectingLocation ? (
                            <CircularProgress size={20} />
                          ) : (
                            <MyLocationIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
          
          {/* Location Error Alert */}
          <Collapse in={!!locationError}>
            <Alert 
              severity="warning" 
              sx={{ mt: 1 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handleClearLocationError}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {locationError}
            </Alert>
          </Collapse>

          {/* Location Success Info */}
          <Collapse in={!!userLocation && nearbyDistricts.length > 0}>
            <Alert 
              severity="info" 
              sx={{ mt: 1 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setUserLocation(null);
                    locationService.clearCache();
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Showing {nearbyDistricts.length} districts near your location
            </Alert>
          </Collapse>
        </Box>
      )}
      sx={{
        '& .MuiAutocomplete-option': {
          padding: '8px 16px',
        },
        '& .MuiAutocomplete-listbox': {
          maxHeight: '300px',
        }
      }}
    />
  );
}

export default DistrictSelector;