// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('Starting MongoDB initialization...');

// Create indexes for better performance
db = db.getSiblingDB('mgnrega_dashboard');

// Districts collection indexes
db.districts.createIndex({ "districtCode": 1 }, { unique: true });
db.districts.createIndex({ "stateCode": 1 });
db.districts.createIndex({ "districtName": "text", "stateName": "text" });

// MGNREGA data collection indexes
db.mgnregadatas.createIndex({ "districtCode": 1, "financialYear": 1 });
db.mgnregadatas.createIndex({ "districtCode": 1, "financialYear": 1, "month": 1 });
db.mgnregadatas.createIndex({ "financialYear": 1, "createdAt": -1 });
db.mgnregadatas.createIndex({ "dataQuality.lastUpdated": 1 });

print('Database indexes created successfully');

// Create initial admin user (optional)
// db.createUser({
//   user: "mgnrega_admin",
//   pwd: "secure_password_here", // Change this in production
//   roles: [
//     { role: "readWrite", db: "mgnrega_dashboard" }
//   ]
// });

print('MongoDB initialization completed');