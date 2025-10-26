#!/usr/bin/env node

console.log('Testing MGNREGA Dashboard Server Setup...\n');

// Test if all required modules can be loaded
const requiredModules = [
  'express',
  'mongoose', 
  'redis',
  './config/database',
  './services/inMemoryStore'
];

let allModulesOk = true;

for (const module of requiredModules) {
  try {
    require(module);
    console.log(`✓ ${module} - OK`);
  } catch (error) {
    console.log(`❌ ${module} - ERROR: ${error.message}`);
    allModulesOk = false;
  }
}

console.log('\n--- Testing In-Memory Store ---');
try {
  const inMemoryStore = require('./services/inMemoryStore');
  
  // Test district search
  const searchResult = inMemoryStore.searchDistricts('agra');
  console.log(`✓ Search districts: Found ${searchResult.count} districts`);
  
  // Test districts by state  
  const stateResult = inMemoryStore.findDistrictsByState('09');
  console.log(`✓ Districts by state: Found ${stateResult.count} districts in UP`);
  
  // Test MGNREGA data
  const currentFY = '2024-25';
  const mgnregaData = inMemoryStore.findMgnregaData('0901', currentFY);
  console.log(`✓ MGNREGA data: ${mgnregaData ? 'Available' : 'Not found'}`);
  
} catch (error) {
  console.log(`❌ In-Memory Store test failed: ${error.message}`);
  allModulesOk = false;
}

console.log('\n--- Testing Database Connection ---');
try {
  const mongoose = require('mongoose');
  console.log(`MongoDB connection state: ${mongoose.connection.readyState} (0=disconnected, 1=connected)`);
} catch (error) {
  console.log(`❌ MongoDB test failed: ${error.message}`);
}

console.log('\n--- Summary ---');
if (allModulesOk) {
  console.log('✅ All tests passed! Server should be ready to start.');
  console.log('\nTo start the server:');
  console.log('  npm start');
  console.log('\nServer will be available at: http://localhost:5000');
} else {
  console.log('❌ Some tests failed. Please check the errors above.');
}

console.log('\nPress any key to exit...');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));