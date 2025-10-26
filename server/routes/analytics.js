const express = require('express');
const MgnregaData = require('../models/MgnregaData');
const District = require('../models/District');
const logger = require('../utils/logger');

const router = express.Router();

// Get performance trends for a district
router.get('/trends/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const { years = 5 } = req.query;

    if (!districtCode || districtCode.length !== 4) {
      return res.status(400).json({
        error: 'Invalid district code'
      });
    }

    const district = await District.findOne({ districtCode });
    if (!district) {
      return res.status(404).json({
        error: 'District not found'
      });
    }

    // Get historical data
    const historicalData = await MgnregaData.find({
      districtCode
    })
    .sort({ financialYear: -1, updatedAt: -1 })
    .limit(parseInt(years));

    // Calculate trends
    const trends = {
      employmentTrend: [],
      budgetTrend: [],
      performanceTrend: [],
      completionTrend: []
    };

    historicalData.forEach(data => {
      trends.employmentTrend.push({
        year: data.financialYear,
        value: data.performance.employmentGenerated,
        demandMet: data.demandForWork.persons > 0 
          ? Math.round((data.workProvided.persons / data.demandForWork.persons) * 100)
          : 0
      });

      trends.budgetTrend.push({
        year: data.financialYear,
        approved: data.budget.approved,
        expenditure: data.budget.expenditure,
        utilization: data.performance.utilizationRate
      });

      trends.performanceTrend.push({
        year: data.financialYear,
        overallScore: data.overallPerformanceScore,
        completion: data.performance.completionRate,
        utilization: data.performance.utilizationRate,
        transparency: data.performance.transparencyScore
      });

      trends.completionTrend.push({
        year: data.financialYear,
        completed: data.worksCompleted.total,
        ongoing: data.worksCompleted.ongoing,
        rate: data.performance.completionRate
      });
    });

    res.json({
      success: true,
      districtCode,
      districtName: district.districtName,
      trends,
      dataPoints: historicalData.length,
      meta: {
        yearsAnalyzed: parseInt(years),
        latestYear: historicalData[0]?.financialYear || null,
        oldestYear: historicalData[historicalData.length - 1]?.financialYear || null
      }
    });

  } catch (error) {
    logger.error('Error fetching performance trends:', error);
    res.status(500).json({
      error: 'Failed to fetch performance trends',
      message: error.message
    });
  }
});

// Compare multiple districts
router.post('/compare', async (req, res) => {
  try {
    const { districtCodes, financialYear } = req.body;

    if (!Array.isArray(districtCodes) || districtCodes.length < 2 || districtCodes.length > 10) {
      return res.status(400).json({
        error: 'Provide 2-10 district codes for comparison'
      });
    }

    if (!financialYear || !financialYear.match(/^\d{4}-\d{2}$/)) {
      return res.status(400).json({
        error: 'Invalid financial year format'
      });
    }

    // Get district details
    const districts = await District.find({
      districtCode: { $in: districtCodes }
    });

    // Get performance data
    const performanceData = await MgnregaData.find({
      districtCode: { $in: districtCodes },
      financialYear
    });

    // Build comparison data
    const comparison = districtCodes.map(code => {
      const district = districts.find(d => d.districtCode === code);
      const data = performanceData.find(d => d.districtCode === code);

      if (!district) {
        return {
          districtCode: code,
          error: 'District not found'
        };
      }

      if (!data) {
        return {
          districtCode: code,
          districtName: district.districtName,
          stateName: district.stateName,
          error: 'No data available for this financial year'
        };
      }

      return {
        districtCode: code,
        districtName: district.districtName,
        stateName: district.stateName,
        performance: {
          overallScore: data.overallPerformanceScore,
          completionRate: data.performance.completionRate,
          utilizationRate: data.performance.utilizationRate,
          transparencyScore: data.performance.transparencyScore,
          employmentGenerated: data.performance.employmentGenerated
        },
        employment: {
          demandMet: data.demandForWork.persons > 0 
            ? Math.round((data.workProvided.persons / data.demandForWork.persons) * 100)
            : 0,
          averageWageDays: data.performance.averageWageDays,
          personDaysGenerated: data.performance.employmentGenerated
        },
        financial: {
          budgetUtilization: data.performance.utilizationRate,
          totalExpenditure: data.budget.expenditure,
          pendingPayments: data.wagePayments.pendingPayments,
          averageWageRate: data.wagePayments.averageWageRate
        },
        works: {
          completionRate: data.performance.completionRate,
          totalCompleted: data.worksCompleted.total,
          ongoing: data.worksCompleted.ongoing
        },
        lastUpdated: data.updatedAt
      };
    });

    // Calculate benchmarks
    const validData = comparison.filter(d => !d.error && d.performance);
    const benchmarks = {
      avgOverallScore: validData.length > 0 
        ? Math.round(validData.reduce((sum, d) => sum + d.performance.overallScore, 0) / validData.length)
        : 0,
      bestPerformer: validData.reduce((best, current) => 
        !best || current.performance.overallScore > best.performance.overallScore ? current : best
      , null),
      worstPerformer: validData.reduce((worst, current) => 
        !worst || current.performance.overallScore < worst.performance.overallScore ? current : worst
      , null)
    };

    res.json({
      success: true,
      financialYear,
      comparison,
      benchmarks,
      meta: {
        totalCompared: districtCodes.length,
        validComparisons: validData.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error in district comparison:', error);
    res.status(500).json({
      error: 'Failed to compare districts',
      message: error.message
    });
  }
});

// Get state-level analytics
router.get('/state/:stateCode/:financialYear', async (req, res) => {
  try {
    const { stateCode, financialYear } = req.params;

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

    if (performanceData.length === 0) {
      return res.status(404).json({
        error: 'No data found for this state and financial year'
      });
    }

    // Calculate state-level aggregations
    const stateAnalytics = {
      totalDistricts: districts.length,
      districtsWithData: performanceData.length,
      
      employment: {
        totalDemand: performanceData.reduce((sum, d) => sum + d.demandForWork.persons, 0),
        totalWorkProvided: performanceData.reduce((sum, d) => sum + d.workProvided.persons, 0),
        totalEmploymentGenerated: performanceData.reduce((sum, d) => sum + d.performance.employmentGenerated, 0),
        avgWageDays: Math.round(performanceData.reduce((sum, d) => sum + d.performance.averageWageDays, 0) / performanceData.length)
      },
      
      financial: {
        totalBudgetApproved: performanceData.reduce((sum, d) => sum + d.budget.approved, 0),
        totalExpenditure: performanceData.reduce((sum, d) => sum + d.budget.expenditure, 0),
        avgUtilizationRate: Math.round(performanceData.reduce((sum, d) => sum + d.performance.utilizationRate, 0) / performanceData.length),
        totalPendingPayments: performanceData.reduce((sum, d) => sum + d.wagePayments.pendingPayments, 0)
      },
      
      works: {
        totalCompleted: performanceData.reduce((sum, d) => sum + d.worksCompleted.total, 0),
        totalOngoing: performanceData.reduce((sum, d) => sum + d.worksCompleted.ongoing, 0),
        avgCompletionRate: Math.round(performanceData.reduce((sum, d) => sum + d.performance.completionRate, 0) / performanceData.length)
      },
      
      performance: {
        avgOverallScore: Math.round(performanceData.reduce((sum, d) => sum + d.overallPerformanceScore, 0) / performanceData.length),
        avgTransparencyScore: Math.round(performanceData.reduce((sum, d) => sum + d.performance.transparencyScore, 0) / performanceData.length),
        topPerformingDistricts: performanceData
          .sort((a, b) => b.overallPerformanceScore - a.overallPerformanceScore)
          .slice(0, 5)
          .map(d => ({
            districtCode: d.districtCode,
            districtName: districts.find(dist => dist.districtCode === d.districtCode)?.districtName,
            score: d.overallPerformanceScore
          }))
      }
    };

    // Calculate employment ratio
    stateAnalytics.employment.demandMetRatio = stateAnalytics.employment.totalDemand > 0
      ? Math.round((stateAnalytics.employment.totalWorkProvided / stateAnalytics.employment.totalDemand) * 100)
      : 0;

    // Calculate budget utilization
    stateAnalytics.financial.overallUtilizationRate = stateAnalytics.financial.totalBudgetApproved > 0
      ? Math.round((stateAnalytics.financial.totalExpenditure / stateAnalytics.financial.totalBudgetApproved) * 100)
      : 0;

    res.json({
      success: true,
      stateCode,
      stateName: districts[0]?.stateName || 'Unknown',
      financialYear,
      analytics: stateAnalytics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error fetching state analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch state analytics',
      message: error.message
    });
  }
});

// Get insights and recommendations
router.get('/insights/:districtCode/:financialYear', async (req, res) => {
  try {
    const { districtCode, financialYear } = req.params;

    const district = await District.findOne({ districtCode });
    if (!district) {
      return res.status(404).json({
        error: 'District not found'
      });
    }

    const data = await MgnregaData.findOne({
      districtCode,
      financialYear
    });

    if (!data) {
      return res.status(404).json({
        error: 'No data found for this district and financial year'
      });
    }

    // Generate insights
    const insights = {
      strengths: [],
      concerns: [],
      recommendations: [],
      keyMetrics: {
        demandMetRatio: data.demandForWork.persons > 0 
          ? Math.round((data.workProvided.persons / data.demandForWork.persons) * 100)
          : 0,
        budgetUtilization: data.performance.utilizationRate,
        workCompletion: data.performance.completionRate,
        transparencyLevel: data.performance.transparencyScore
      }
    };

    // Analyze strengths
    if (data.performance.completionRate > 80) {
      insights.strengths.push('Excellent work completion rate');
    }
    if (data.performance.utilizationRate > 85) {
      insights.strengths.push('Good budget utilization');
    }
    if (data.performance.transparencyScore > 75) {
      insights.strengths.push('High transparency in operations');
    }

    // Identify concerns
    if (insights.keyMetrics.demandMetRatio < 70) {
      insights.concerns.push('Low demand fulfillment ratio');
    }
    if (data.performance.utilizationRate < 60) {
      insights.concerns.push('Poor budget utilization');
    }
    if (data.wagePayments.pendingPayments > data.wagePayments.total * 0.1) {
      insights.concerns.push('High pending wage payments');
    }
    if (data.performance.completionRate < 50) {
      insights.concerns.push('Low work completion rate');
    }

    // Generate recommendations
    if (insights.keyMetrics.demandMetRatio < 80) {
      insights.recommendations.push('Increase work allocation to meet employment demand');
    }
    if (data.performance.utilizationRate < 75) {
      insights.recommendations.push('Improve budget planning and expenditure tracking');
    }
    if (data.performance.transparencyScore < 70) {
      insights.recommendations.push('Enhance transparency through better social audits');
    }
    if (data.performance.averageWageDays < 30) {
      insights.recommendations.push('Focus on providing adequate days of employment per household');
    }

    res.json({
      success: true,
      districtCode,
      districtName: district.districtName,
      financialYear,
      insights,
      overallPerformance: data.overallPerformanceScore,
      grade: data.overallPerformanceScore >= 80 ? 'A' : 
             data.overallPerformanceScore >= 60 ? 'B' : 
             data.overallPerformanceScore >= 40 ? 'C' : 'D',
      lastUpdated: data.updatedAt
    });

  } catch (error) {
    logger.error('Error generating insights:', error);
    res.status(500).json({
      error: 'Failed to generate insights',
      message: error.message
    });
  }
});

module.exports = router;