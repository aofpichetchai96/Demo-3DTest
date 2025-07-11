# OEM 3D System - Docker Management
.PHONY: help build up down logs restart clean status dev prod

# Default target
help:
	@echo "🚀 OEM 3D Product Customization System - Docker Commands"
	@echo ""
	@echo "📋 Available commands:"
	@echo "  make dev        - Start development environment"
	@echo "  make prod       - Start production environment"
	@echo "  make build      - Build all Docker images"
	@echo "  make up         - Start all services (production)"
	@echo "  make down       - Stop all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make restart    - Restart all services"
	@echo "  make clean      - Clean up containers and volumes"
	@echo "  make status     - Show status of all services"
	@echo "  make db-reset   - Reset database"
	@echo "  make backup     - Backup database"
	@echo ""

# Development environment
dev:
	@echo "🔧 Starting development environment..."
	docker-compose -f docker-compose.dev.yml up -d --build
	@echo "✅ Development environment is running!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend: http://localhost:3001"

# Production environment
prod:
	@echo "🚀 Starting production environment..."
	docker-compose up -d --build
	@echo "✅ Production environment is running!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend: http://localhost:3001"

# Build all images
build:
	@echo "🔨 Building Docker images..."
	docker-compose build
	docker-compose -f docker-compose.dev.yml build

# Start services (production)
up:
	@echo "⬆️  Starting services..."
	docker-compose up -d

# Stop all services
down:
	@echo "⬇️  Stopping services..."
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

# View logs
logs:
	@echo "📄 Showing logs..."
	docker-compose logs -f

# Restart services
restart:
	@echo "🔄 Restarting services..."
	docker-compose restart
	docker-compose -f docker-compose.dev.yml restart

# Clean up everything
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker system prune -f
	@echo "✅ Cleanup complete!"

# Show status
status:
	@echo "📊 Service status:"
	docker-compose ps
	@echo ""
	@echo "🔍 Health checks:"
	@curl -f http://localhost:3001/api/health 2>/dev/null && echo "✅ Backend: OK" || echo "❌ Backend: Failed"
	@curl -f http://localhost:3000 2>/dev/null && echo "✅ Frontend: OK" || echo "❌ Frontend: Failed"

# Reset database
db-reset:
	@echo "🗄️  Resetting database..."
	docker-compose stop postgres
	docker volume rm demo-3dtest_postgres_data 2>/dev/null || true
	docker-compose up -d postgres
	@echo "✅ Database reset complete!"

# Backup database
backup:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	docker-compose exec postgres pg_dump -U postgres oem_3d_system > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup created in backups/ directory"

# Install dependencies locally (for development)
install:
	@echo "📦 Installing dependencies..."
	cd backend && npm install
	cd frontend && npm install
	@echo "✅ Dependencies installed!"

# Run tests
test:
	@echo "🧪 Running tests..."
	docker-compose exec backend npm test
	docker-compose exec frontend npm test
	@echo "✅ Tests completed!"
