const express = require('express');
const Joi = require('joi');
const dataService = require('../services/dataService');
const logger = require('../utils/logger');

const router = express.Router();

// Validation schemas
const getDataSchema = Joi.object({
  districtCode: Joi.string().length(4).required(),
  financialYear: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  useCache: Joi.boolean().default(true)
});

const bulkDataSchema = Joi.object({
  districtCodes: Joi.array().items(Joi.string().length(4)).min(1).max(50).required(),
  financialYear: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  useCache: Joi.boolean().default(true)
});

// Get district data
router.get('/district/:districtCode/:financialYear', async (req, res) => {
  try {
    const { error, value } = getDataSchema.validate({
      districtCode: req.params.districtCode,
      financialYear: req.params.financialYear,
      useCache: req.query.useCache !== 'false'
    });

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    const { districtCode, financialYear, useCache } = value;
    
    logger.info(`Fetching data for district ${districtCode}, FY ${financialYear}`);
    
    const data = await dataService.getDistrictData(districtCode, financialYear, useCache);
    
    res.json({
      success: true,
      data,
      meta: {
        districtCode,
        financialYear,
        timestamp: new Date().toISOString(),
        cached: useCache
      }
    });

  } catch (error) {
    logger.error('Error in district data endpoint:', error);
    res.status(500).json({
      error: 'Failed to fetch district data',
      message: error.message
    });
  }
});

// Get bulk district data
router.post('/bulk', async (req, res) => {
  try {
    const { error, value } = bulkDataSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    const { districtCodes, financialYear, useCache } = value;
    
    logger.info(`Fetching bulk data for ${districtCodes.length} districts, FY ${financialYear}`);
    
    const results = await Promise.allSettled(
      districtCodes.map(districtCode => 
        dataService.getDistrictData(districtCode, financialYear, useCache)
      )
    );

    const successfulResults = [];
    const failedResults = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        successfulResults.push({
          districtCode: districtCodes[index],
          data: result.value
        });
      } else {
        failedResults.push({
          districtCode: districtCodes[index],
          error: result.reason?.message || 'Unknown error'
        });
      }
    });

    res.json({
      success: true,
      results: successfulResults,
      failed: failedResults,
      meta: {
        totalRequested: districtCodes.length,
        successful: successfulResults.length,
        failed: failedResults.length,
        financialYear,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error in bulk data endpoint:', error);
    res.status(500).json({
      error: 'Failed to fetch bulk data',
      message: error.message
    });
  }
});

// Get historical data for a district
router.get('/history/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const { years = 5 } = req.query;

    if (!districtCode || districtCode.length !== 4) {
      return res.status(400).json({
        error: 'Invalid district code'
      });
    }

    logger.info(`Fetching historical data for district ${districtCode}`);

    // Generate financial years for the last N years
    const currentYear = new Date().getFullYear();
    const financialYears = [];
    
    for (let i = 0; i < parseInt(years); i++) {
      const year = currentYear - i;
      financialYears.push(`${year}-${(year + 1).toString().substr(2)}`);
    }

    const historicalData = await Promise.allSettled(
      financialYears.map(fy => 
        dataService.getDistrictData(districtCode, fy, true)
      )
    );

    const results = historicalData
      .map((result, index) => ({
        financialYear: financialYears[index],
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason?.message : null
      }))
      .filter(item => item.data !== null);

    res.json({
      success: true,
      districtCode,
      historicalData: results,
      meta: {
        yearsRequested: parseInt(years),
        dataPointsFound: results.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error in historical data endpoint:', error);
    res.status(500).json({
      error: 'Failed to fetch historical data',
      message: error.message
    });
  }
});

// Refresh data for a district (force API call)
router.post('/refresh/:districtCode/:financialYear', async (req, res) => {
  try {
    const { districtCode, financialYear } = req.params;

    if (!districtCode || districtCode.length !== 4) {
      return res.status(400).json({
        error: 'Invalid district code'
      });
    }

    if (!financialYear.match(/^\d{4}-\d{2}$/)) {
      return res.status(400).json({
        error: 'Invalid financial year format. Use YYYY-YY format.'
      });
    }

    logger.info(`Refreshing data for district ${districtCode}, FY ${financialYear}`);
    
    // Force refresh by not using cache
    const data = await dataService.getDistrictData(districtCode, financialYear, false);
    
    res.json({
      success: true,
      message: 'Data refreshed successfully',
      data,
      meta: {
        districtCode,
        financialYear,
        refreshedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error in refresh data endpoint:', error);
    res.status(500).json({
      error: 'Failed to refresh data',
      message: error.message
    });
  }
});

module.exports = router;