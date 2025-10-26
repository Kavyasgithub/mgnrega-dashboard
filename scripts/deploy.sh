#!/bin/bash

# MGNREGA Dashboard Deployment Script
# This script sets up and deploys the MGNREGA Dashboard

set -e  # Exit on any error

echo "🚀 Starting MGNREGA Dashboard Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Environment setup
print_status "Setting up environment..."

# Create environment file from example if it doesn't exist
if [ ! -f "server/.env" ]; then
    print_status "Creating environment file..."
    cp server/.env.example server/.env
    print_warning "Please update server/.env with your configuration before proceeding"
    print_warning "Press any key to continue after updating the environment file..."
    read -n 1 -s
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p server/logs
mkdir -p nginx/ssl
mkdir -p data/mongodb
mkdir -p data/redis

# Set proper permissions
chmod 755 server/logs
chmod 755 data/mongodb
chmod 755 data/redis

# Production deployment
print_status "Building and starting services..."

# Build and start containers
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

# Health check
print_status "Performing health checks..."

# Check if MongoDB is ready
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
    print_success "MongoDB is running"
else
    print_error "MongoDB failed to start"
    exit 1
fi

# Check if Redis is ready
if docker-compose exec -T redis redis-cli ping | grep -q "PONG"; then
    print_success "Redis is running"
else
    print_error "Redis failed to start"
    exit 1
fi

# Check if application is ready
if curl -f http://localhost:5000/health &> /dev/null; then
    print_success "Application is running"
else
    print_error "Application failed to start"
    exit 1
fi

# Display status
print_success "🎉 MGNREGA Dashboard deployed successfully!"
echo ""
echo "📊 Application URL: http://localhost:5000"
echo "📈 Health Check: http://localhost:5000/health"
echo "🗄️  MongoDB: localhost:27017"
echo "🔴 Redis: localhost:6379"
echo ""
echo "📝 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  View status: docker-compose ps"
echo ""

# Show container status
print_status "Container status:"
docker-compose ps

print_success "Deployment completed! 🚀"