const cron = require('node-cron');
const logger = require('../utils/logger');
const dataService = require('./dataService');
const District = require('../models/District');

class DataScheduler {
  constructor() {
    this.isRunning = false;
    this.lastRunTime = null;
    this.stats = {
      totalRuns: 0,
      successfulRuns: 0,
      errors: 0
    };
  }

  // Schedule data updates
  scheduleDataUpdates() {
    // Run every 4 hours
    cron.schedule('0 */4 * * *', async () => {
      await this.runDataUpdate();
    });

    // Run daily cleanup at 2 AM
    cron.schedule('0 2 * * *', async () => {
      await this.runCleanup();
    });

    logger.info('Data update scheduler initialized');
  }

  // Main data update routine
  async runDataUpdate() {
    if (this.isRunning) {
      logger.warn('Data update already running, skipping this cycle');
      return;
    }

    this.isRunning = true;
    this.stats.totalRuns++;
    const startTime = new Date();

    try {
      logger.info('Starting scheduled data update');

      // Get current financial year
      const currentFY = this.getCurrentFinancialYear();
      
      // Get priority districts (major districts from selected state - Uttar Pradesh for this demo)
      const priorityDistricts = await this.getPriorityDistricts();
      
      if (priorityDistricts.length === 0) {
        logger.warn('No priority districts found, seeding with sample districts');
        await this.seedSampleDistricts();
        return;
      }

      // Update data for priority districts
      let successCount = 0;
      let errorCount = 0;

      for (const district of priorityDistricts) {
        try {
          await dataService.getDistrictData(district.districtCode, currentFY, false);
          successCount++;
          logger.debug(`Updated data for ${district.districtName}`);
          
          // Add small delay to avoid overwhelming the API
          await this.delay(2000);
        } catch (error) {
          errorCount++;
          logger.error(`Failed to update ${district.districtName}:`, error.message);
        }
      }

      this.stats.successfulRuns++;
      this.lastRunTime = new Date();

      const duration = (new Date() - startTime) / 1000;
      logger.info(`Data update completed: ${successCount} successful, ${errorCount} errors, ${duration}s duration`);

    } catch (error) {
      this.stats.errors++;
      logger.error('Data update failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Get priority districts for updates
  async getPriorityDistricts() {
    try {
      // Focus on Uttar Pradesh (state code: 09) as it's the largest state
      const districts = await District.find({
        stateCode: '09', // Uttar Pradesh
        isActive: true
      }).sort({ districtName: 1 });

      // If no UP districts, get any active districts
      if (districts.length === 0) {
        return await District.find({
          isActive: true
        }).limit(20).sort({ districtName: 1 });
      }

      return districts;
    } catch (error) {
      logger.error('Error getting priority districts:', error);
      return [];
    }
  }

  // Seed sample districts if none exist
  async seedSampleDistricts() {
    try {
      logger.info('Seeding sample districts for Uttar Pradesh');

      const sampleDistricts = [
        { districtCode: '0901', districtName: 'Agra', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0902', districtName: 'Aligarh', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0903', districtName: 'Allahabad', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0904', districtName: 'Ambedkar Nagar', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0905', districtName: 'Amethi', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0906', districtName: 'Amroha', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0907', districtName: 'Auraiya', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0908', districtName: 'Azamgarh', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0909', districtName: 'Baghpat', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0910', districtName: 'Bahraich', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0911', districtName: 'Ballia', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0912', districtName: 'Balrampur', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0913', districtName: 'Banda', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0914', districtName: 'Barabanki', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0915', districtName: 'Bareilly', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0916', districtName: 'Basti', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0917', districtName: 'Bhadohi', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0918', districtName: 'Bijnor', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0919', districtName: 'Budaun', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0920', districtName: 'Bulandshahr', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0921', districtName: 'Chandauli', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0922', districtName: 'Chitrakoot', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0923', districtName: 'Deoria', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0924', districtName: 'Etah', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0925', districtName: 'Etawah', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0926', districtName: 'Faizabad', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0927', districtName: 'Farrukhabad', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0928', districtName: 'Fatehpur', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0929', districtName: 'Firozabad', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0930', districtName: 'Gautam Buddha Nagar', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0931', districtName: 'Ghaziabad', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0932', districtName: 'Ghazipur', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0933', districtName: 'Gonda', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0934', districtName: 'Gorakhpur', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0935', districtName: 'Hamirpur', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0936', districtName: 'Hapur', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0937', districtName: 'Hardoi', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0938', districtName: 'Hathras', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0939', districtName: 'Jalaun', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0940', districtName: 'Jaunpur', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0941', districtName: 'Jhusi', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0942', districtName: 'Kannauj', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0943', districtName: 'Kanpur Dehat', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0944', districtName: 'Kanpur Nagar', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0945', districtName: 'Kasganj', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0946', districtName: 'Kaushambi', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0947', districtName: 'Kheri', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0948', districtName: 'Kushinagar', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0949', districtName: 'Lalitpur', stateCode: '09', stateName: 'Uttar Pradesh' },
        { districtCode: '0950', districtName: 'Lucknow', stateCode: '09', stateName: 'Uttar Pradesh' }
      ];

      // Insert districts that don't already exist
      for (const districtData of sampleDistricts) {
        const existing = await District.findOne({ districtCode: districtData.districtCode });
        if (!existing) {
          const district = new District(districtData);
          await district.save();
        }
      }

      logger.info(`Seeded ${sampleDistricts.length} sample districts for Uttar Pradesh`);

      // Generate some sample data for these districts
      await this.generateSampleData(sampleDistricts.slice(0, 10)); // Generate for first 10 districts

    } catch (error) {
      logger.error('Error seeding sample districts:', error);
    }
  }

  // Generate sample data for testing
  async generateSampleData(districts) {
    try {
      const currentFY = this.getCurrentFinancialYear();
      const previousFY = this.getPreviousFinancialYear();

      for (const district of districts) {
        // Generate data for current and previous year
        for (const fy of [currentFY, previousFY]) {
          const sampleData = dataService.getSampleData(district.districtCode, fy);
          await dataService.saveToDatabase(sampleData);
          logger.debug(`Generated sample data for ${district.districtName} - ${fy}`);
        }
        
        // Small delay between districts
        await this.delay(500);
      }

      logger.info(`Generated sample data for ${districts.length} districts`);
    } catch (error) {
      logger.error('Error generating sample data:', error);
    }
  }

  // Cleanup old data
  async runCleanup() {
    try {
      logger.info('Starting data cleanup');

      // Remove data older than 5 years
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 5);

      const result = await require('../models/MgnregaData').deleteMany({
        createdAt: { $lt: cutoffDate }
      });

      logger.info(`Cleanup completed: ${result.deletedCount} old records removed`);
    } catch (error) {
      logger.error('Error during cleanup:', error);
    }
  }

  // Get current financial year (April to March)
  getCurrentFinancialYear() {
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

  // Get previous financial year
  getPreviousFinancialYear() {
    const currentFY = this.getCurrentFinancialYear();
    const year = parseInt(currentFY.split('-')[0]);
    return `${year - 1}-${year.toString().substr(2)}`;
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRunTime: this.lastRunTime,
      stats: this.stats,
      currentFinancialYear: this.getCurrentFinancialYear()
    };
  }

  // Utility method for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const dataScheduler = new DataScheduler();

// Export the scheduler instance and the schedule function
module.exports = {
  scheduleDataUpdates: () => dataScheduler.scheduleDataUpdates(),
  getSchedulerStatus: () => dataScheduler.getStatus(),
  runDataUpdateNow: () => dataScheduler.runDataUpdate()
};