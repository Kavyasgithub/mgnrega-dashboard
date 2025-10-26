const axios = require('axios');
const NodeCache = require('node-cache');
const logger = require('../utils/logger');
const { setCache, getCache } = require('../config/redis');
const MgnregaData = require('../models/MgnregaData');
const District = require('../models/District');
const inMemoryStore = require('./inMemoryStore');
const mongoose = require('mongoose');

// In-memory cache as fallback
const memoryCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

class DataService {
  constructor() {
    this.baseURL = 'https://mnregaweb4.nic.in/netnrega/';
    this.apiTimeout = 10000; // 10 seconds
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  // Check if MongoDB is available
  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  // Get data with multiple fallback layers
  async getDistrictData(districtCode, financialYear, useCache = true) {
    const cacheKey = `district_data_${districtCode}_${financialYear}`;
    
    try {
      // Layer 1: Redis Cache
      if (useCache) {
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
          logger.info(`Data served from Redis cache for ${districtCode}`);
          return cachedData;
        }
      }

      // Layer 2: Memory Cache
      if (useCache) {
        const memoryCachedData = memoryCache.get(cacheKey);
        if (memoryCachedData) {
          logger.info(`Data served from memory cache for ${districtCode}`);
          return memoryCachedData;
        }
      }

      // Layer 3: Database
      const dbData = await this.getFromDatabase(districtCode, financialYear);
      if (dbData && this.isDataFresh(dbData.dataQuality.lastUpdated)) {
        logger.info(`Data served from database for ${districtCode}`);
        
        // Cache the database data
        if (useCache) {
          await this.cacheData(cacheKey, dbData);
        }
        
        return dbData;
      }

      // Layer 4: Live API
      const apiData = await this.fetchFromAPI(districtCode, financialYear);
      if (apiData) {
        logger.info(`Data served from API for ${districtCode}`);
        
        // Save to database
        await this.saveToDatabase(apiData);
        
        // Cache the API data
        if (useCache) {
          await this.cacheData(cacheKey, apiData);
        }
        
        return apiData;
      }

      // Layer 5: Stale database data as last resort
      if (dbData) {
        logger.warn(`Serving stale data from database for ${districtCode}`);
        return dbData;
      }

      throw new Error('No data available from any source');

    } catch (error) {
      logger.error(`Error getting district data for ${districtCode}:`, error);
      
      // Try to get any available data as fallback
      const fallbackData = await this.getFallbackData(districtCode, financialYear);
      if (fallbackData) {
        return fallbackData;
      }
      
      throw error;
    }
  }

  // Fetch data from MGNREGA API
  async fetchFromAPI(districtCode, financialYear) {
    try {
      const response = await this.makeAPIRequest(
        `/citizen_data_card/citizen_data_card_generate.aspx`,
        'GET',
        {
          state_code: districtCode.substring(0, 2),
          district_code: districtCode,
          fin_year: financialYear
        }
      );

      return this.parseAPIResponse(response.data, districtCode, financialYear);
    } catch (error) {
      logger.error(`API request failed for ${districtCode}:`, error.message);
      return null;
    }
  }

  // Make API request with retry logic
  async makeAPIRequest(endpoint, method = 'GET', params = {}, retryCount = 0) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        timeout: this.apiTimeout,
        headers: {
          'User-Agent': 'MGNREGA-Dashboard-Bot/1.0',
          'Accept': 'application/json, text/plain, */*'
        }
      };

      if (method === 'GET') {
        config.params = params;
      } else {
        config.data = params;
      }

      const response = await axios(config);
      return response;

    } catch (error) {
      if (retryCount < this.retryAttempts) {
        logger.warn(`API request failed, retrying... (${retryCount + 1}/${this.retryAttempts})`);
        await this.delay(this.retryDelay * (retryCount + 1));
        return this.makeAPIRequest(endpoint, method, params, retryCount + 1);
      }
      throw error;
    }
  }

  // Parse API response and convert to our data model
  parseAPIResponse(apiData, districtCode, financialYear) {
    // This is a simplified parser - actual implementation would depend on API response format
    try {
      return {
        districtCode,
        financialYear,
        demandForWork: {
          households: this.safeParseNumber(apiData.demand_households) || 0,
          persons: this.safeParseNumber(apiData.demand_persons) || 0
        },
        workProvided: {
          households: this.safeParseNumber(apiData.work_households) || 0,
          persons: this.safeParseNumber(apiData.work_persons) || 0
        },
        worksCompleted: {
          total: this.safeParseNumber(apiData.works_completed) || 0,
          ongoing: this.safeParseNumber(apiData.works_ongoing) || 0
        },
        budget: {
          approved: this.safeParseNumber(apiData.budget_approved) || 0,
          available: this.safeParseNumber(apiData.budget_available) || 0,
          expenditure: this.safeParseNumber(apiData.expenditure) || 0
        },
        wagePayments: {
          total: this.safeParseNumber(apiData.wage_payments) || 0,
          pendingPayments: this.safeParseNumber(apiData.pending_payments) || 0,
          averageWageRate: this.safeParseNumber(apiData.avg_wage_rate) || 0
        },
        performance: {
          employmentGenerated: this.safeParseNumber(apiData.employment_generated) || 0,
          averageWageDays: this.safeParseNumber(apiData.avg_wage_days) || 0,
          completionRate: this.calculateCompletionRate(apiData) || 0,
          utilizationRate: this.calculateUtilizationRate(apiData) || 0,
          transparencyScore: this.calculateTransparencyScore(apiData) || 0
        },
        assets: {
          individualBeneficiary: this.safeParseNumber(apiData.individual_assets) || 0,
          publicWorks: this.safeParseNumber(apiData.public_works) || 0,
          commonProperty: this.safeParseNumber(apiData.common_property) || 0
        },
        socialAudit: {
          conductedGramPanchayats: this.safeParseNumber(apiData.audit_gps) || 0,
          totalGramPanchayats: this.safeParseNumber(apiData.total_gps) || 0,
          issuesRaised: this.safeParseNumber(apiData.issues_raised) || 0,
          issuesResolved: this.safeParseNumber(apiData.issues_resolved) || 0
        },
        dataQuality: {
          lastUpdated: new Date(),
          source: 'data.gov.in',
          isVerified: true,
          confidence: 95
        }
      };
    } catch (error) {
      logger.error('Error parsing API response:', error);
      return null;
    }
  }

  // Get data from database
  async getFromDatabase(districtCode, financialYear) {
    try {
      // Try MongoDB if connected
      if (this.isMongoConnected()) {
        return await MgnregaData.findOne({
          districtCode,
          financialYear
        }).sort({ updatedAt: -1 });
      } else {
        // Use in-memory store as fallback
        logger.info(`MongoDB not connected, using in-memory store for ${districtCode}`);
        const result = inMemoryStore.findMgnregaData(districtCode, financialYear);
        return result ? result.data : null;
      }
    } catch (error) {
      logger.error(`Database query error for ${districtCode}:`, error);
      // Fallback to in-memory store on database error
      const result = inMemoryStore.findMgnregaData(districtCode, financialYear);
      return result ? result.data : null;
    }
  }

  // Save data to database
  async saveToDatabase(data) {
    try {
      // Only save to database if MongoDB is connected
      if (!this.isMongoConnected()) {
        logger.warn('MongoDB not connected, cannot save data to database');
        return data; // Return the data as-is
      }

      const existingData = await MgnregaData.findOne({
        districtCode: data.districtCode,
        financialYear: data.financialYear
      });

      if (existingData) {
        Object.assign(existingData, data);
        existingData.calculatePerformanceMetrics();
        await existingData.save();
        return existingData;
      } else {
        const newData = new MgnregaData(data);
        newData.calculatePerformanceMetrics();
        await newData.save();
        return newData;
      }
    } catch (error) {
      logger.error('Error saving to database:', error);
      return null;
    }
  }

  // Cache data in both Redis and memory
  async cacheData(key, data, ttl = 3600) {
    try {
      // Cache in Redis
      await setCache(key, data, ttl);
      
      // Cache in memory as fallback
      memoryCache.set(key, data, ttl);
    } catch (error) {
      logger.error('Error caching data:', error);
    }
  }

  // Get fallback data from any available source
  async getFallbackData(districtCode, financialYear) {
    try {
      // Try to get the most recent data for this district
      const recentData = await MgnregaData.findOne({
        districtCode
      }).sort({ updatedAt: -1 });

      if (recentData) {
        logger.info(`Serving most recent available data for ${districtCode}`);
        return recentData;
      }

      // If no data for specific district, try getting sample/template data
      return this.getSampleData(districtCode, financialYear);
    } catch (error) {
      logger.error('Error getting fallback data:', error);
      return null;
    }
  }

  // Generate sample data for demonstration
  getSampleData(districtCode, financialYear) {
    return {
      districtCode,
      financialYear,
      demandForWork: { households: 1000, persons: 1500 },
      workProvided: { households: 800, persons: 1200 },
      worksCompleted: { total: 50, ongoing: 20 },
      budget: { approved: 10000000, available: 8000000, expenditure: 6000000 },
      wagePayments: { total: 4000000, pendingPayments: 500000, averageWageRate: 200 },
      performance: {
        employmentGenerated: 25000,
        averageWageDays: 45,
        completionRate: 71,
        utilizationRate: 75,
        transparencyScore: 80
      },
      assets: { individualBeneficiary: 30, publicWorks: 15, commonProperty: 5 },
      socialAudit: {
        conductedGramPanchayats: 8,
        totalGramPanchayats: 10,
        issuesRaised: 5,
        issuesResolved: 4
      },
      dataQuality: {
        lastUpdated: new Date(),
        source: 'sample',
        isVerified: false,
        confidence: 50
      }
    };
  }

  // Utility methods
  safeParseNumber(value) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  calculateCompletionRate(data) {
    const completed = this.safeParseNumber(data.works_completed);
    const ongoing = this.safeParseNumber(data.works_ongoing);
    const total = completed + ongoing;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  calculateUtilizationRate(data) {
    const approved = this.safeParseNumber(data.budget_approved);
    const expenditure = this.safeParseNumber(data.expenditure);
    return approved > 0 ? Math.round((expenditure / approved) * 100) : 0;
  }

  calculateTransparencyScore(data) {
    // Simple transparency score based on data completeness and audit coverage
    let score = 0;
    
    if (data.audit_gps && data.total_gps) {
      const auditCoverage = (this.safeParseNumber(data.audit_gps) / this.safeParseNumber(data.total_gps)) * 100;
      score += auditCoverage * 0.6;
    }
    
    // Add points for data completeness
    const requiredFields = ['demand_households', 'work_households', 'budget_approved', 'expenditure'];
    const completedFields = requiredFields.filter(field => data[field] && this.safeParseNumber(data[field]) > 0);
    score += (completedFields.length / requiredFields.length) * 40;
    
    return Math.round(Math.min(score, 100));
  }

  isDataFresh(lastUpdated, maxAgeHours = 24) {
    const now = new Date();
    const dataAge = (now - new Date(lastUpdated)) / (1000 * 60 * 60);
    return dataAge < maxAgeHours;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new DataService();