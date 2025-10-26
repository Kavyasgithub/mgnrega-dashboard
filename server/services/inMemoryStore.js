// In-memory data store for development when databases are not available
class InMemoryStore {
  constructor() {
    this.districts = new Map();
    this.mgnregaData = new Map();
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample Uttar Pradesh districts
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
      { districtCode: '0950', districtName: 'Lucknow', stateCode: '09', stateName: 'Uttar Pradesh' },
      { districtCode: '0944', districtName: 'Kanpur Nagar', stateCode: '09', stateName: 'Uttar Pradesh' },
      { districtCode: '0934', districtName: 'Gorakhpur', stateCode: '09', stateName: 'Uttar Pradesh' },
      { districtCode: '0926', districtName: 'Faridabad', stateCode: '09', stateName: 'Uttar Pradesh' },
      { districtCode: '0931', districtName: 'Ghaziabad', stateCode: '09', stateName: 'Uttar Pradesh' },
      
      // Haryana districts
      { districtCode: '0601', districtName: 'Ambala', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0602', districtName: 'Bhiwani', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0603', districtName: 'Charkhi Dadri', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0604', districtName: 'Faridabad', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0605', districtName: 'Fatehabad', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0606', districtName: 'Gurugram', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0607', districtName: 'Hisar', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0608', districtName: 'Jhajjar', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0609', districtName: 'Jind', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0610', districtName: 'Kaithal', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0611', districtName: 'Karnal', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0612', districtName: 'Kurukshetra', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0613', districtName: 'Mahendragarh', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0614', districtName: 'Nuh', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0615', districtName: 'Palwal', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0616', districtName: 'Panchkula', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0617', districtName: 'Panipat', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0618', districtName: 'Rewari', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0619', districtName: 'Rohtak', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0620', districtName: 'Sirsa', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0621', districtName: 'Sonipat', stateCode: '06', stateName: 'Haryana' },
      { districtCode: '0622', districtName: 'Yamunanagar', stateCode: '06', stateName: 'Haryana' },
      
      // Delhi districts
      { districtCode: '0701', districtName: 'Central Delhi', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0702', districtName: 'East Delhi', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0703', districtName: 'New Delhi', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0704', districtName: 'North Delhi', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0705', districtName: 'North East Delhi', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0706', districtName: 'North West Delhi', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0707', districtName: 'Shahdara', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0708', districtName: 'South Delhi', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0709', districtName: 'South East Delhi', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0710', districtName: 'South West Delhi', stateCode: '07', stateName: 'Delhi' },
      { districtCode: '0711', districtName: 'West Delhi', stateCode: '07', stateName: 'Delhi' },
      
      // Punjab districts
      { districtCode: '0301', districtName: 'Amritsar', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0302', districtName: 'Barnala', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0303', districtName: 'Bathinda', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0304', districtName: 'Faridkot', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0305', districtName: 'Fatehgarh Sahib', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0306', districtName: 'Fazilka', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0307', districtName: 'Ferozepur', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0308', districtName: 'Gurdaspur', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0309', districtName: 'Hoshiarpur', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0310', districtName: 'Jalandhar', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0311', districtName: 'Kapurthala', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0312', districtName: 'Ludhiana', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0313', districtName: 'Mansa', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0314', districtName: 'Moga', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0315', districtName: 'Mohali', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0316', districtName: 'Muktsar', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0317', districtName: 'Pathankot', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0318', districtName: 'Patiala', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0319', districtName: 'Rupnagar', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0320', districtName: 'Sangrur', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0321', districtName: 'Shaheed Bhagat Singh Nagar', stateCode: '03', stateName: 'Punjab' },
      { districtCode: '0322', districtName: 'Tarn Taran', stateCode: '03', stateName: 'Punjab' }
    ];

    sampleDistricts.forEach(district => {
      this.districts.set(district.districtCode, {
        ...district,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Generate sample MGNREGA data
    const currentFY = this.getCurrentFinancialYear();
    sampleDistricts.forEach(district => {
      const sampleData = this.generateSampleMgnregaData(district.districtCode, currentFY);
      this.mgnregaData.set(`${district.districtCode}_${currentFY}`, sampleData);
    });
  }

  getCurrentFinancialYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (currentMonth >= 4) {
      return `${currentYear}-${(currentYear + 1).toString().substr(2)}`;
    } else {
      return `${currentYear - 1}-${currentYear.toString().substr(2)}`;
    }
  }

  generateSampleMgnregaData(districtCode, financialYear) {
    const baseData = {
      districtCode,
      financialYear,
      demandForWork: { 
        households: Math.floor(Math.random() * 5000) + 1000, 
        persons: Math.floor(Math.random() * 8000) + 1500 
      },
      workProvided: { 
        households: Math.floor(Math.random() * 4000) + 800, 
        persons: Math.floor(Math.random() * 6000) + 1200 
      },
      worksCompleted: { 
        total: Math.floor(Math.random() * 100) + 20, 
        ongoing: Math.floor(Math.random() * 50) + 10 
      },
      budget: { 
        approved: Math.floor(Math.random() * 50000000) + 10000000, 
        available: 0, 
        expenditure: 0 
      },
      wagePayments: { 
        total: Math.floor(Math.random() * 20000000) + 5000000, 
        pendingPayments: Math.floor(Math.random() * 2000000) + 100000, 
        averageWageRate: Math.floor(Math.random() * 100) + 150 
      },
      performance: {
        employmentGenerated: Math.floor(Math.random() * 50000) + 10000,
        averageWageDays: Math.floor(Math.random() * 50) + 30,
        completionRate: Math.floor(Math.random() * 40) + 60,
        utilizationRate: Math.floor(Math.random() * 30) + 70,
        transparencyScore: Math.floor(Math.random() * 30) + 70
      },
      assets: {
        individualBeneficiary: Math.floor(Math.random() * 50) + 10,
        publicWorks: Math.floor(Math.random() * 30) + 5,
        commonProperty: Math.floor(Math.random() * 20) + 2
      },
      socialAudit: {
        conductedGramPanchayats: Math.floor(Math.random() * 15) + 5,
        totalGramPanchayats: Math.floor(Math.random() * 20) + 15,
        issuesRaised: Math.floor(Math.random() * 10) + 2,
        issuesResolved: Math.floor(Math.random() * 8) + 1
      },
      dataQuality: {
        lastUpdated: new Date(),
        source: 'in-memory-sample',
        isVerified: false,
        confidence: 75
      }
    };

    // Calculate derived values
    baseData.budget.available = baseData.budget.approved * 0.8;
    baseData.budget.expenditure = baseData.budget.approved * (baseData.performance.utilizationRate / 100);

    return baseData;
  }

  // District methods
  findDistrictsByState(stateCode) {
    const districts = Array.from(this.districts.values())
      .filter(d => d.stateCode === stateCode && d.isActive)
      .sort((a, b) => a.districtName.localeCompare(b.districtName));
    
    return { districts, count: districts.length };
  }

  searchDistricts(query) {
    const searchTerm = query.toLowerCase();
    const districts = Array.from(this.districts.values())
      .filter(d => 
        d.isActive && 
        (d.districtName.toLowerCase().includes(searchTerm) || 
         d.stateName.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => a.districtName.localeCompare(b.districtName))
      .slice(0, 20);
    
    return { districts, count: districts.length };
  }

  findDistrictByCode(districtCode) {
    const district = this.districts.get(districtCode);
    return district ? { district } : null;
  }

  getAllDistricts() {
    return Array.from(this.districts.values())
      .filter(d => d.isActive)
      .sort((a, b) => a.districtName.localeCompare(b.districtName));
  }

  // MGNREGA data methods
  findMgnregaData(districtCode, financialYear) {
    const key = `${districtCode}_${financialYear}`;
    const data = this.mgnregaData.get(key);
    return data ? { data } : null;
  }
}

module.exports = new InMemoryStore();