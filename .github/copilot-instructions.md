# MGNREGA District Performance Dashboard

This workspace contains a full-stack web application for analyzing MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) program performance across districts in India.

## Project Structure
- `/server` - Node.js/Express backend with API endpoints, data caching, and database integration
- `/client` - React frontend application with data visualization and analytics
- `/docs` - Documentation and API specifications
- `/scripts` - Deployment and utility scripts

## Development Guidelines
- Use Node.js 16+ and npm 8+
- Follow React best practices and hooks patterns
- Implement proper error handling and data validation
- Use environment variables for configuration
- Include comprehensive testing for both frontend and backend
- Follow responsive design principles for mobile compatibility

## Data Sources
- Primary: data.gov.in MGNREGA APIs
- Fallback: Cached local data and secondary sources
- Historical data stored in local database for trend analysis

## Production Considerations
- Implement rate limiting and caching strategies
- Use Redis for session management and data caching
- Include health checks and monitoring endpoints
- Deploy with Docker containers
- Use CDN for static assets
- Implement proper logging and error tracking