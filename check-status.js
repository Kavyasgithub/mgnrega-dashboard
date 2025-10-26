#!/usr/bin/env node

const axios = require('axios');
const chalk = require('chalk');

console.log('🔍 MGNREGA Dashboard Status Check\n');

async function checkStatus() {
  const checks = [
    {
      name: 'Backend Server',
      url: 'http://localhost:5000/api/health',
      type: 'server'
    },
    {
      name: 'Districts API',
      url: 'http://localhost:5000/api/districts/state/09',
      type: 'api'
    },
    {
      name: 'React Frontend',
      url: 'http://localhost:3000',
      type: 'frontend'
    }
  ];

  for (const check of checks) {
    try {
      const response = await axios.get(check.url, { timeout: 5000 });
      
      if (check.type === 'server' && response.data.status === 'OK') {
        console.log(`✅ ${check.name}: Running (${response.data.environment})`);
        if (response.data.database) {
          console.log(`   📊 Database: ${response.data.database.status}`);
        }
        if (response.data.cache) {
          console.log(`   🚀 Cache: ${response.data.cache.status}`);
        }
      } else if (check.type === 'api' && response.data.success) {
        console.log(`✅ ${check.name}: Working (${response.data.count} districts)`);
        console.log(`   📡 Data source: ${response.data.source || 'database'}`);
      } else if (check.type === 'frontend') {
        console.log(`✅ ${check.name}: Accessible`);
      } else {
        console.log(`⚠️  ${check.name}: Unusual response`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${check.name}: Not running (connection refused)`);
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`⏰ ${check.name}: Timeout (server may be slow)`);
      } else {
        console.log(`❌ ${check.name}: Error (${error.message})`);
      }
    }
  }

  console.log('\n📋 Summary:');
  console.log('• If backend shows ❌: Run start-server.bat');
  console.log('• If frontend shows ❌: Run start-client.bat');
  console.log('• If APIs show ❌: Check server logs for errors');
  console.log('\n🌐 Access URLs:');
  console.log('• Frontend: http://localhost:3000');
  console.log('• Backend:  http://localhost:5000');
  console.log('• API Docs: http://localhost:5000/api');
}

checkStatus().catch(console.error);