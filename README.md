# MGNREGA District Performance Dashboard

A comprehensive web application for analyzing MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) program performance across districts in India. This production-ready dashboard helps citizens understand how their districts are performing in the MGNREGA program through easy-to-understand analytics and visualizations.

![MGNREGA Dashboard](https://img.shields.io/badge/MGNREGA-Dashboard-blue) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18-green) ![MongoDB](https://img.shields.io/badge/MongoDB-6-green) ![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 🎯 Features

### For Citizens
- **District Performance Analysis**: View comprehensive MGNREGA performance metrics for any district
- **Historical Trends**: Analyze performance trends over multiple financial years
- **Comparative Analysis**: Compare performance across multiple districts
- **User-Friendly Interface**: Intuitive design optimized for both desktop and mobile devices
- **Real-time Data**: Access to latest available government data with automatic updates

### For Administrators & Researchers
- **Production-Ready Architecture**: Built with scalability and reliability in mind
- **Multi-layer Caching**: Redis + in-memory + database caching for high availability
- **API Rate Limiting**: Protection against overload and abuse
- **Fallback Mechanisms**: Works even when government APIs are unavailable
- **Comprehensive Logging**: Full audit trail and error tracking
- **Health Monitoring**: Built-in health checks and monitoring endpoints

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Node.js/Express │────│    MongoDB      │
│   (Port 3000)   │    │   API Server     │    │   (Database)    │
└─────────────────┘    │   (Port 5000)    │    └─────────────────┘
                       └─────────────────┘
                                │
                       ┌─────────────────┐    ┌─────────────────┐
                       │      Redis      │    │  External APIs  │
                       │    (Cache)      │    │  (data.gov.in)  │
                       └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **React 18** - Modern React with hooks and context
- **Material-UI 5** - Professional UI components
- **React Query** - Data fetching and caching
- **React Router 6** - Client-side routing
- **Recharts** - Data visualization
- **Leaflet** - Interactive maps

#### Backend
- **Node.js 18** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Document database
- **Redis** - In-memory cache
- **Axios** - HTTP client
- **Winston** - Logging framework
- **Joi** - Data validation
- **Node-cron** - Scheduled tasks

#### DevOps & Production
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing
- **GitHub Actions** - CI/CD (optional)

## 🚀 Quick Start

### 🎯 One-Click Setup (Windows)
```bash
# Double-click this file or run in command prompt:
start-dashboard.bat
```
**✨ This automatically installs all dependencies and starts both server and client!**

### 🛠️ Manual Setup

**Prerequisites:**
- **Node.js 16+** ([Download here](https://nodejs.org/))
- **Optional**: MongoDB + Redis (works with sample data if not available)

**Installation Steps:**
```bash
# 1. Install server dependencies
cd server
npm install

# 2. Install client dependencies  
cd client
npm install

# 3. Start services (in separate terminals)
# Terminal 1:
cd server && npm start

# Terminal 2: 
cd client && npm start
```

**🌐 Access Points:**
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000  
- **Health Check**: http://localhost:5000/api/health

### 🔧 Alternative Quick Scripts
```bash
start-server.bat       # Backend only
start-client.bat       # Frontend only  
node check-status.js   # Verify services are running
```

**📊 Works out-of-the-box!** Uses sample data for 25+ UP districts if databases unavailable.

### Method 1: Docker Deployment (Production)

1. **Clone and deploy**
   ```bash
   git clone <repository-url>
   cd MGNREGA
   ```

2. **Run deployment script**
   
   **Linux/macOS:**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```
   
   **Windows:**
   ```cmd
   scripts\deploy.bat
   ```

3. **Access the application**
   - Dashboard: http://localhost:5000
   - Health Check: http://localhost:5000/health

2. **Configure environment**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your database URLs
   ```

3. **Start databases**
   ```bash
   # Start MongoDB (default port 27017)
   mongod
   
   # Start Redis (default port 6379)
   redis-server
   ```

4. **Start the application**
   ```bash
   # Development mode (starts both client and server)
   npm run dev
   
   # Or start separately:
   npm run server:dev  # Backend on port 5000
   npm run client:dev  # Frontend on port 3000
   ```

## 📊 Data Sources

The dashboard aggregates data from multiple official sources:

- **Primary**: [data.gov.in](https://data.gov.in) MGNREGA APIs
- **Secondary**: MGNREGA Official Portal
- **Fallback**: Cached local data and historical records
- **Sample Data**: For demonstration when live data is unavailable

### Data Flow & Caching Strategy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Government API │    │  Redis Cache    │    │  In-Memory      │
│  (data.gov.in)  │────│  (1 hour TTL)   │────│  Cache          │
└─────────────────┘    └─────────────────┘    │  (Fallback)     │
         │                       │             └─────────────────┘
         │                       │                      │
         ▼                       ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MongoDB Database                            │
│                   (Persistent Storage)                         │
└─────────────────────────────────────────────────────────────────┘
```

**Fallback Hierarchy:**
1. Redis Cache (fastest)
2. In-Memory Cache (backup)
3. Database (persistent)
4. Live API Call (fresh data)
5. Sample Data (demonstration)

## 🔧 Configuration

### Environment Variables

**Server Configuration** (`server/.env`):
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/mgnrega_dashboard
REDIS_URL=redis://localhost:6379

# Client
CLIENT_URL=http://localhost:3000

# API Configuration
API_TIMEOUT=10000
RETRY_ATTEMPTS=3
CACHE_TTL=3600

# Security
JWT_SECRET=your-super-secret-jwt-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Features
ENABLE_SCHEDULER=true
UPDATE_INTERVAL_HOURS=4
```

**Client Configuration** (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENABLE_ANALYTICS=true
```

## 📱 Usage Guide

### For Citizens

1. **Select Your District**
   - Use the search functionality to find your district
   - Browse by state or search by name

2. **View Performance Metrics**
   - Overall performance score (0-100)
   - Employment generation statistics
   - Budget utilization rates
   - Work completion percentages
   - Transparency scores

3. **Analyze Trends**
   - Historical performance over multiple years
   - Monthly and quarterly breakdowns
   - Comparison with state averages

4. **Compare Districts**
   - Add multiple districts for side-by-side comparison
   - Benchmark against top performers
   - Identify best practices

### For Administrators

1. **Monitor System Health**
   - Check `/health` endpoint for system status
   - Monitor logs for errors and performance issues
   - Track API usage and caching effectiveness

2. **Data Management**
   - Automatic data updates every 4 hours
   - Manual refresh capabilities
   - Data quality monitoring and validation

3. **Performance Optimization**
   - Multi-layer caching reduces load on government APIs
   - Background data synchronization
   - Efficient database indexing

## 🛠️ API Documentation

### Core Endpoints

#### Districts
```
GET /api/districts/state/:stateCode     # Get districts by state
GET /api/districts/search/:query        # Search districts
GET /api/districts/:districtCode        # Get district details
GET /api/districts/rankings/:stateCode/:financialYear  # District rankings
```

#### Data
```
GET /api/data/district/:districtCode/:financialYear    # Get district data
POST /api/data/bulk                     # Get bulk district data
GET /api/data/history/:districtCode     # Get historical data
POST /api/data/refresh/:districtCode/:financialYear   # Refresh data
```

#### Analytics
```
GET /api/analytics/trends/:districtCode           # Performance trends
POST /api/analytics/compare                       # Compare districts
GET /api/analytics/state/:stateCode/:financialYear  # State analytics
GET /api/analytics/insights/:districtCode/:financialYear  # AI insights
```

#### System
```
GET /health                             # Health check
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "cached": true,
    "source": "database"
  }
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run server tests
cd server && npm test

# Run client tests
cd client && npm test

# Run with coverage
npm run test:coverage
```

## 📈 Monitoring & Analytics

### Health Checks
- **Application Health**: `/health` endpoint
- **Database Connectivity**: MongoDB connection status
- **Cache Status**: Redis availability
- **External APIs**: Government API accessibility

### Performance Metrics
- **Response Times**: API endpoint performance
- **Cache Hit Rates**: Caching effectiveness
- **Error Rates**: System reliability
- **Data Freshness**: Last update timestamps

### Logging
- **Application Logs**: `server/logs/combined.log`
- **Error Logs**: `server/logs/error.log`
- **Access Logs**: Nginx access logs
- **Performance Logs**: Web vitals and metrics

## 🔒 Security

### Production Security Features
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi schema validation
- **Error Handling**: No sensitive data exposure
- **HTTPS Ready**: SSL/TLS configuration
- **Security Headers**: CORS, CSP, XSS protection
- **Container Security**: Non-root user, minimal attack surface

### Data Privacy
- **No Personal Data**: Only public government data
- **Local Storage**: User preferences only
- **No Tracking**: Privacy-focused design
- **Transparent Sources**: Clear data provenance

## 🚀 Deployment

### Production Deployment

1. **Server Setup**
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install docker.io docker-compose
   
   # CentOS/RHEL
   sudo yum install docker docker-compose
   ```

2. **Application Deployment**
   ```bash
   git clone <repository-url>
   cd MGNREGA
   ./scripts/deploy.sh
   ```

3. **SSL Configuration** (Optional)
   ```bash
   # Generate SSL certificates
   sudo certbot certonly --webroot -w /var/www/html -d your-domain.com
   
   # Update nginx configuration
   # Uncomment SSL section in nginx/nginx.conf
   ```

4. **Domain Setup**
   - Update DNS records to point to your server
   - Configure firewall rules (ports 80, 443)
   - Set up monitoring and backup strategies

### Cloud Deployment

**AWS/Azure/GCP:**
- Use container services (ECS, Container Instances, Cloud Run)
- Set up managed databases (DocumentDB, CosmosDB, Cloud Firestore)
- Configure load balancers and auto-scaling
- Set up monitoring and logging services

## 🤝 Contributing

We welcome contributions from developers, data scientists, and policy researchers!

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the coding standards and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Areas for Contribution
- **Data Visualization**: Enhanced charts and interactive maps
- **Analytics**: Advanced insights and ML-based recommendations
- **Performance**: Optimization and caching improvements
- **Accessibility**: Better support for screen readers and disabilities
- **Localization**: Multi-language support
- **Mobile App**: React Native or Flutter implementation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Government of India** for providing open data through data.gov.in
- **MGNREGA Program** administrators and implementers
- **Open Source Community** for the excellent tools and libraries
- **Citizens of India** who inspire transparent governance

## 📞 Support

For support and questions:
- 📧 **Email**: support@mgnrega-dashboard.org
- 💬 **Issues**: [GitHub Issues](https://github.com/mgnrega-dashboard/issues)
- 📚 **Documentation**: [Wiki](https://github.com/mgnrega-dashboard/wiki)
- 🐛 **Bug Reports**: [Bug Tracker](https://github.com/mgnrega-dashboard/issues/new?template=bug_report.md)

---

**Disclaimer**: This is an independent project created for educational and research purposes. It is not officially affiliated with the Government of India or MGNREGA administration. All data is sourced from publicly available government databases and APIs.

---

<div align="center">
  <strong>Built with ❤️ for transparent governance and citizen empowerment</strong>
</div>