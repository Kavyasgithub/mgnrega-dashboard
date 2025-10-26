const express = require('express');
const District = require('../models/District');
const MgnregaData = require('../models/MgnregaData');
const inMemoryStore = require('../services/inMemoryStore');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const router = express.Router();

// Helper function to get current financial year
function getCurrentFinancialYear() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (currentMonth >= 4) {
    return `${currentYear}-${(currentYear + 1).toString().substr(2)}`;
  } else {
    return `${currentYear - 1}-${currentYear.toString().substr(2)}`;
  }
}

// Get all districts (popular districts from all states)
router.get('/all', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    let result;
    
    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const districts = await District.find({
          isActive: true
        })
        .sort({ stateName: 1, districtName: 1 })
        .limit(parseInt(limit));

        result = {
          success: true,
          districts,
          count: districts.length,
          source: 'database'
        };
      } catch (dbError) {
        logger.warn('Database query failed, falling back to in-memory store', { error: dbError.message });
        const allDistricts = inMemoryStore.getAllDistricts().slice(0, parseInt(limit));
        result = {
          success: true,
          districts: allDistricts,
          count: allDistricts.length,
          source: 'in-memory'
        };
      }
    } else {
      // Use in-memory store if MongoDB not connected
      const allDistricts = inMemoryStore.getAllDistricts().slice(0, parseInt(limit));
      result = {
        success: true,
        districts: allDistricts,
        count: allDistricts.length,
        source: 'in-memory'
      };
    }

    res.json(result);

  } catch (error) {
    logger.error('Error fetching all districts:', error);
    res.status(500).json({
      error: 'Failed to fetch districts',
      message: error.message
    });
  }
});

// Get all districts for a state
router.get('/state/:stateCode', async (req, res) => {
  try {
    const { stateCode } = req.params;
    
    if (!stateCode || stateCode.length !== 2) {
      return res.status(400).json({
        error: 'Invalid state code'
      });
    }

    let result;
    
    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const districts = await District.find({
          stateCode,
          isActive: true
        }).sort({ districtName: 1 });

        result = {
          success: true,
          stateCode,
          districts,
          count: districts.length,
          source: 'database'
        };
      } catch (dbError) {
        logger.warn('Database query failed, falling back to in-memory store', { error: dbError.message });
        result = {
          ...inMemoryStore.findDistrictsByState(stateCode),
          success: true,
          stateCode,
          source: 'in-memory'
        };
      }
    } else {
      // Use in-memory store if MongoDB not connected
      result = {
        ...inMemoryStore.findDistrictsByState(stateCode),
        success: true,
        stateCode,
        source: 'in-memory'
      };
    }

    res.json(result);

  } catch (error) {
    logger.error('Error fetching districts by state:', error);
    res.status(500).json({
      error: 'Failed to fetch districts',
      message: error.message
    });
  }
});

// Get district details
router.get('/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    
    if (!districtCode || districtCode.length !== 4) {
      return res.status(400).json({
        error: 'Invalid district code'
      });
    }

    let result;

    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const district = await District.findOne({
          districtCode,
          isActive: true
        });

        if (!district) {
          // Try in-memory store as fallback
          const inMemoryResult = inMemoryStore.findDistrictByCode(districtCode);
          if (inMemoryResult) {
            const currentFY = getCurrentFinancialYear();
            const mgnregaData = inMemoryStore.findMgnregaData(districtCode, currentFY);
            
            result = {
              success: true,
              district: inMemoryResult.district,
              latestData: mgnregaData?.data || null,
              lastUpdated: mgnregaData?.data?.dataQuality?.lastUpdated || null,
              source: 'in-memory'
            };
          } else {
            return res.status(404).json({
              error: 'District not found'
            });
          }
        } else {
          // Get latest performance data
          const latestData = await MgnregaData.findOne({
            districtCode
          }).sort({ updatedAt: -1 });

          result = {
            success: true,
            district,
            latestData,
            lastUpdated: latestData?.updatedAt || null,
            source: 'database'
          };
        }
      } catch (dbError) {
        logger.warn('Database query failed, falling back to in-memory store', { error: dbError.message });
        const inMemoryResult = inMemoryStore.findDistrictByCode(districtCode);
        if (inMemoryResult) {
          const currentFY = getCurrentFinancialYear();
          const mgnregaData = inMemoryStore.findMgnregaData(districtCode, currentFY);
          
          result = {
            success: true,
            district: inMemoryResult.district,
            latestData: mgnregaData?.data || null,
            lastUpdated: mgnregaData?.data?.dataQuality?.lastUpdated || null,
            source: 'in-memory'
          };
        } else {
          return res.status(404).json({
            error: 'District not found'
          });
        }
      }
    } else {
      // Use in-memory store if MongoDB not connected
      const inMemoryResult = inMemoryStore.findDistrictByCode(districtCode);
      if (inMemoryResult) {
        const currentFY = getCurrentFinancialYear();
        const mgnregaData = inMemoryStore.findMgnregaData(districtCode, currentFY);
        
        result = {
          success: true,
          district: inMemoryResult.district,
          latestData: mgnregaData?.data || null,
          lastUpdated: mgnregaData?.data?.dataQuality?.lastUpdated || null,
          source: 'in-memory'
        };
      } else {
        return res.status(404).json({
          error: 'District not found'
        });
      }
    }

    res.json(result);

  } catch (error) {
    logger.error('Error fetching district details:', error);
    res.status(500).json({
      error: 'Failed to fetch district details',
      message: error.message
    });
  }
});

// Search districts
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        error: 'Search query must be at least 2 characters'
      });
    }

    let result;

    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const districts = await District.find({
          $or: [
            { districtName: { $regex: query, $options: 'i' } },
            { stateName: { $regex: query, $options: 'i' } }
          ],
          isActive: true
        })
        .limit(parseInt(limit))
        .sort({ districtName: 1 });

        result = {
          success: true,
          query,
          districts,
          count: districts.length,
          source: 'database'
        };
      } catch (dbError) {
        logger.warn('Database search failed, falling back to in-memory store', { error: dbError.message });
        result = {
          ...inMemoryStore.searchDistricts(query),
          success: true,
          query,
          source: 'in-memory'
        };
      }
    } else {
      // Use in-memory store if MongoDB not connected
      result = {
        ...inMemoryStore.searchDistricts(query),
        success: true,
        query,
        source: 'in-memory'
      };
    }

    res.json(result);

  } catch (error) {
    logger.error('Error searching districts:', error);
    res.status(500).json({
      error: 'Failed to search districts',
      message: error.message
    });
  }
});

// Find districts by location (coordinates)
router.get('/location/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { limit = 5 } = req.query;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates'
      });
    }

    if (latitude < 6 || latitude > 38 || longitude < 68 || longitude > 98) {
      return res.status(400).json({
        error: 'Coordinates outside India bounds'
      });
    }

    let result;

    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        // Use MongoDB's geospatial query to find nearest districts
        const districts = await District.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [longitude, latitude]
              },
              distanceField: "distance",
              maxDistance: 200000, // 200km radius
              spherical: true,
              query: { isActive: true }
            }
          },
          {
            $limit: parseInt(limit)
          },
          {
            $project: {
              districtCode: 1,
              districtName: 1,
              stateName: 1,
              stateCode: 1,
              distance: { $round: ["$distance", 0] }
            }
          }
        ]);

        result = {
          success: true,
          location: { latitude, longitude },
          districts,
          count: districts.length,
          source: 'database'
        };
      } catch (dbError) {
        logger.warn('Database geospatial query failed, falling back to calculation', { error: dbError.message });
        result = findNearestDistrictsCalculated(latitude, longitude, limit);
      }
    } else {
      // Use calculation-based approach if MongoDB not connected
      result = findNearestDistrictsCalculated(latitude, longitude, limit);
    }

    res.json(result);

  } catch (error) {
    logger.error('Error finding districts by location:', error);
    res.status(500).json({
      error: 'Failed to find districts by location',
      message: error.message
    });
  }
});

// Helper function to calculate distance and find nearest districts
function findNearestDistrictsCalculated(lat, lng, limit) {
  const districts = inMemoryStore.getAllDistricts();
  
  // Calculate distance for each district (using approximate coordinates)
  const districtDistances = districts.map(district => {
    // Approximate district coordinates based on known major districts
    const districtCoords = getApproximateCoordinates(district.districtCode, district.stateName);
    const distance = calculateDistance(lat, lng, districtCoords.lat, districtCoords.lng);
    
    return {
      ...district,
      distance: Math.round(distance * 1000) // Convert to meters
    };
  });

  // Sort by distance and limit results
  const nearestDistricts = districtDistances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, parseInt(limit));

  return {
    success: true,
    location: { latitude: lat, longitude: lng },
    districts: nearestDistricts,
    count: nearestDistricts.length,
    source: 'calculated'
  };
}

// Helper function to get approximate coordinates for districts
function getApproximateCoordinates(districtCode, stateName) {
  // This is a simplified mapping - in a real application, you'd have actual coordinates
  const stateCoords = {
    'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
    'Maharashtra': { lat: 19.7515, lng: 75.7139 },
    'Bihar': { lat: 25.0961, lng: 85.3131 },
    'West Bengal': { lat: 22.9868, lng: 87.8550 },
    'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
    'Telangana': { lat: 18.1124, lng: 79.0193 },
    'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
    'Rajasthan': { lat: 27.0238, lng: 74.2179 },
    'Karnataka': { lat: 15.3173, lng: 75.7139 },
    'Gujarat': { lat: 22.2587, lng: 71.1924 },
    'Odisha': { lat: 20.9517, lng: 85.0985 },
    'Kerala': { lat: 10.8505, lng: 76.2711 },
    'Jharkhand': { lat: 23.6102, lng: 85.2799 },
    'Assam': { lat: 26.2006, lng: 92.9376 },
    'Punjab': { lat: 31.1471, lng: 75.3412 },
    'Chhattisgarh': { lat: 21.2787, lng: 81.8661 },
    'Haryana': { lat: 29.0588, lng: 76.0856 },
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Punjab': { lat: 31.1471, lng: 75.3412 },
    'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
    'Jammu and Kashmir': { lat: 34.0837, lng: 74.7973 },
    'Uttarakhand': { lat: 30.0668, lng: 79.0193 }
  };

  // Return state center coordinates as approximation
  return stateCoords[stateName] || { lat: 20.5937, lng: 78.9629 }; // India center as fallback
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get district rankings by performance
router.get('/rankings/:stateCode/:financialYear', async (req, res) => {
  try {
    const { stateCode, financialYear } = req.params;
    const { sortBy = 'overallScore', limit = 50 } = req.query;

    if (!stateCode || stateCode.length !== 2) {
      return res.status(400).json({
        error: 'Invalid state code'
      });
    }

    // Get all districts in the state
    const districts = await District.find({
      stateCode,
      isActive: true
    });

    const districtCodes = districts.map(d => d.districtCode);

    // Get performance data for all districts
    const performanceData = await MgnregaData.find({
      districtCode: { $in: districtCodes },
      financialYear
    });

    // Calculate rankings
    const rankings = performanceData.map(data => {
      const district = districts.find(d => d.districtCode === data.districtCode);
      const overallScore = data.overallPerformanceScore;
      
      return {
        districtCode: data.districtCode,
        districtName: district?.districtName || 'Unknown',
        overallScore,
        completionRate: data.performance.completionRate,
        utilizationRate: data.performance.utilizationRate,
        transparencyScore: data.performance.transparencyScore,
        employmentGenerated: data.performance.employmentGenerated,
        lastUpdated: data.updatedAt
      };
    });

    // Sort rankings
    let sortField = 'overallScore';
    switch (sortBy) {
      case 'completion':
        sortField = 'completionRate';
        break;
      case 'utilization':
        sortField = 'utilizationRate';
        break;
      case 'transparency':
        sortField = 'transparencyScore';
        break;
      case 'employment':
        sortField = 'employmentGenerated';
        break;
    }

    rankings.sort((a, b) => b[sortField] - a[sortField]);

    // Add rank numbers
    rankings.forEach((item, index) => {
      item.rank = index + 1;
    });

    res.json({
      success: true,
      stateCode,
      financialYear,
      sortBy,
      rankings: rankings.slice(0, parseInt(limit)),
      meta: {
        totalDistricts: rankings.length,
        topPerformer: rankings[0] || null,
        averageScore: rankings.length > 0 
          ? Math.round(rankings.reduce((sum, r) => sum + r.overallScore, 0) / rankings.length)
          : 0
      }
    });

  } catch (error) {
    logger.error('Error fetching district rankings:', error);
    res.status(500).json({
      error: 'Failed to fetch district rankings',
      message: error.message
    });
  }
});

module.exports = router;