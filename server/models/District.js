const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  districtCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  districtName: {
    type: String,
    required: true
  },
  stateCode: {
    type: String,
    required: true,
    index: true
  },
  stateName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
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

// Update the updatedAt field before saving
districtSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('District', districtSchema);