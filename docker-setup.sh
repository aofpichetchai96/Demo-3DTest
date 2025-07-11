#!/bin/bash

# OEM 3D System Docker Setup Script

echo "🚀 Setting up OEM 3D Product Customization System with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p postgres_data
mkdir -p redis_data

# Set permissions
chmod 755 backend/uploads
chmod 755 backend/logs

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Copying environment configuration..."
    cp .env.docker .env
fi

echo "🐳 Building and starting Docker containers..."

# Build and start services
docker-compose up -d --build

echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL to be ready
echo "🔍 Waiting for PostgreSQL..."
until docker-compose exec postgres pg_isready -U postgres -d oem_3d_system; do
    sleep 2
done

# Wait for Redis to be ready
echo "🔍 Waiting for Redis..."
until docker-compose exec redis redis-cli ping; do
    sleep 2
done

# Wait for backend to be ready
echo "🔍 Waiting for Backend API..."
until curl -f http://localhost:3001/api/health 2>/dev/null; do
    sleep 2
done

# Wait for frontend to be ready
echo "🔍 Waiting for Frontend..."
until curl -f http://localhost:3000 2>/dev/null; do
    sleep 2
done

echo "✅ All services are ready!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   API Health Check: http://localhost:3001/api/health"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   View status: docker-compose ps"
echo ""
echo "📊 Database Connection:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: oem_3d_system"
echo "   Username: postgres"
echo "   Password: postgres123"
echo ""
echo "🎉 Setup complete! Your OEM 3D system is now running."
