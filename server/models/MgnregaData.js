const mongoose = require('mongoose');

const mgnregaDataSchema = new mongoose.Schema({
  districtCode: {
    type: String,
    required: true,
    index: true
  },
  financialYear: {
    type: String,
    required: true,
    index: true
  },
  
  // Employment Statistics
  demandForWork: {
    households: { type: Number, default: 0 },
    persons: { type: Number, default: 0 }
  },
  
  workProvided: {
    households: { type: Number, default: 0 },
    persons: { type: Number, default: 0 }
  },
  
  // Work Completion
  worksCompleted: {
    total: { type: Number, default: 0 },
    ongoing: { type: Number, default: 0 }
  },
  
  // Financial Data
  budget: {
    approved: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    expenditure: { type: Number, default: 0 }
  },
  
  wagePayments: {
    total: { type: Number, default: 0 },
    pendingPayments: { type: Number, default: 0 },
    averageWageRate: { type: Number, default: 0 }
  },
  
  // Performance Indicators
  performance: {
    employmentGenerated: { type: Number, default: 0 }, // person-days
    averageWageDays: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }, // percentage
    utilizationRate: { type: Number, default: 0 }, // percentage
    transparencyScore: { type: Number, default: 0 } // out of 100
  },
  
  // Asset Creation
  assets: {
    individualBeneficiary: { type: Number, default: 0 },
    publicWorks: { type: Number, default: 0 },
    commonProperty: { type: Number, default: 0 }
  },
  
  // Social Audit
  socialAudit: {
    conductedGramPanchayats: { type: Number, default: 0 },
    totalGramPanchayats: { type: Number, default: 0 },
    issuesRaised: { type: Number, default: 0 },
    issuesResolved: { type: Number, default: 0 }
  },
  
  // Data Quality
  dataQuality: {
    lastUpdated: { type: Date, default: Date.now },
    source: { type: String, default: 'data.gov.in' },
    isVerified: { type: Boolean, default: false },
    confidence: { type: Number, default: 0 } // 0-100
  },
  
  // Metadata
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for efficient queries
mgnregaDataSchema.index({ districtCode: 1, financialYear: 1 });
mgnregaDataSchema.index({ districtCode: 1, financialYear: 1, month: 1 });
mgnregaDataSchema.index({ financialYear: 1, createdAt: -1 });

// Update the updatedAt field before saving
mgnregaDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for calculating performance score
mgnregaDataSchema.virtual('overallPerformanceScore').get(function() {
  const completion = this.performance.completionRate || 0;
  const utilization = this.performance.utilizationRate || 0;
  const transparency = this.performance.transparencyScore || 0;
  
  return Math.round((completion + utilization + transparency) / 3);
});

// Methods
mgnregaDataSchema.methods.calculatePerformanceMetrics = function() {
  // Calculate completion rate
  if (this.worksCompleted.total > 0) {
    this.performance.completionRate = Math.round(
      (this.worksCompleted.total / (this.worksCompleted.total + this.worksCompleted.ongoing)) * 100
    );
  }
  
  // Calculate utilization rate
  if (this.budget.approved > 0) {
    this.performance.utilizationRate = Math.round(
      (this.budget.expenditure / this.budget.approved) * 100
    );
  }
  
  // Calculate employment generation efficiency
  if (this.demandForWork.persons > 0) {
    this.performance.employmentGenerated = this.workProvided.persons;
  }
  
  return this;
};

module.exports = mongoose.model('MgnregaData', mgnregaDataSchema);