# 🐳 Docker Setup Guide

## Prerequisites

### Windows
1. Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Make sure WSL2 is enabled
3. Ensure virtualization is enabled in BIOS

### Linux/Mac
1. Install Docker Engine
2. Install Docker Compose
3. Make sure your user is in the docker group

## Quick Start

### Option 1: Using Setup Scripts

**Windows:**
```cmd
docker-setup.bat
```

**Linux/Mac:**
```bash
chmod +x docker-setup.sh
./docker-setup.sh
```

### Option 2: Using Make Commands

**Development Environment:**
```bash
make dev
```

**Production Environment:**
```bash
make prod
```

### Option 3: Manual Docker Compose

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

**Production:**
```bash
docker-compose up -d --build
```

## 🎯 Available Environments

### Development Environment
- **File:** `docker-compose.dev.yml`
- **Features:**
  - Live reload for both frontend and backend
  - Volume mounting for source code
  - Development dependencies included
  - Debug-friendly logging

### Production Environment
- **File:** `docker-compose.yml`
- **Features:**
  - Optimized builds
  - Production dependencies only
  - Health checks
  - Security optimizations

## 📋 Services

### PostgreSQL Database
- **Port:** 5432
- **Database:** oem_3d_system
- **Username:** postgres
- **Password:** postgres123
- **Volume:** Persistent data storage

### Redis Cache
- **Port:** 6379
- **Volume:** Persistent cache storage

### Backend API
- **Port:** 3001
- **Health Check:** http://localhost:3001/api/health
- **Features:**
  - Express.js server
  - JWT authentication
  - File upload handling
  - API rate limiting

### Frontend App
- **Port:** 3000
- **URL:** http://localhost:3000
- **Features:**
  - Next.js application
  - 3D model viewer
  - Responsive design
  - Real-time updates

## 🛠 Management Commands

### Using Make (Recommended)
```bash
# Show all available commands
make help

# Development
make dev          # Start development environment
make logs         # View logs
make status       # Check service status
make restart      # Restart services
make down         # Stop services

# Production
make prod         # Start production environment
make build        # Build images
make clean        # Clean up everything

# Database
make db-reset     # Reset database
make backup       # Backup database

# Testing
make test         # Run tests
```

### Using Docker Compose Directly
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose build

# Scale services
docker-compose up -d --scale backend=2

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d oem_3d_system
```

## 🔧 Configuration

### Environment Variables
- **Development:** `.env.docker`
- **Production:** Modify `docker-compose.yml` directly

### Database Configuration
```yaml
POSTGRES_DB: oem_3d_system
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres123
```

### Backend Configuration
```yaml
NODE_ENV: production/development
PORT: 3001
DB_HOST: postgres
JWT_SECRET: your_secret_key
```

### Frontend Configuration
```yaml
NEXT_PUBLIC_API_URL: http://localhost:3001/api
NEXT_PUBLIC_APP_URL: http://localhost:3000
```

## 📊 Monitoring

### Health Checks
- **Backend:** http://localhost:3001/api/health
- **Frontend:** http://localhost:3000
- **Database:** `docker-compose exec postgres pg_isready`
- **Redis:** `docker-compose exec redis redis-cli ping`

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Resource Usage
```bash
# Container stats
docker stats

# Service status
docker-compose ps

# System info
docker system df
```

## 🗄️ Database Management

### Access Database
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d oem_3d_system

# Run SQL commands
docker-compose exec postgres psql -U postgres -d oem_3d_system -c "SELECT * FROM users;"
```

### Backup & Restore
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres oem_3d_system > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres -d oem_3d_system < backup.sql

# Reset database
make db-reset
```

### Database Migrations
```bash
# Run migrations
docker-compose exec backend npm run db:migrate

# Seed data
docker-compose exec backend npm run db:seed
```

## 📁 Volume Management

### Data Persistence
- **PostgreSQL Data:** `postgres_data` volume
- **Redis Data:** `redis_data` volume
- **Upload Files:** `./backend/uploads` bind mount
- **Logs:** `./backend/logs` bind mount

### Volume Commands
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect demo-3dtest_postgres_data

# Remove volumes (⚠️ This will delete data!)
docker volume rm demo-3dtest_postgres_data
```

## 🚀 Deployment

### Local Development
1. Clone repository
2. Run `make dev` or `docker-setup.bat`
3. Access http://localhost:3000

### Production Deployment
1. Update environment variables
2. Configure reverse proxy (Nginx)
3. Set up SSL certificates
4. Run `make prod`
5. Set up monitoring and backups

### CI/CD Integration
```yaml
# Example GitHub Actions
- name: Build and Deploy
  run: |
    docker-compose build
    docker-compose up -d
```

## 🔒 Security

### Production Security
- Change default passwords
- Use strong JWT secrets
- Configure firewall rules
- Enable SSL/TLS
- Regular security updates

### Network Security
- Services communicate through internal network
- Only necessary ports are exposed
- Rate limiting enabled
- CORS configured

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
netstat -tulpn | grep :3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Permission Issues
```bash
# Fix permissions (Linux/Mac)
sudo chown -R $USER:$USER .
chmod +x docker-setup.sh
```

#### Database Connection Issues
```bash
# Check database status
docker-compose exec postgres pg_isready

# Reset database connection
docker-compose restart postgres
```

#### Memory Issues
```bash
# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory

# Clean up unused resources
docker system prune -a
```

### Debugging

#### Container Logs
```bash
# Backend logs
docker-compose logs -f backend

# Database logs
docker-compose logs -f postgres

# All logs with timestamps
docker-compose logs -f -t
```

#### Container Shell Access
```bash
# Backend container
docker-compose exec backend sh

# Database container
docker-compose exec postgres bash

# Redis container
docker-compose exec redis sh
```

#### Network Debugging
```bash
# Test network connectivity
docker-compose exec backend ping postgres
docker-compose exec backend nslookup postgres

# Check port availability
docker-compose exec backend netstat -tulpn
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Node.js Docker Hub](https://hub.docker.com/_/node)

## 💡 Best Practices

1. **Always use specific image tags** instead of `latest`
2. **Use multi-stage builds** for smaller production images
3. **Set proper health checks** for all services
4. **Use secrets management** for sensitive data
5. **Regular backups** of persistent data
6. **Monitor resource usage** and set limits
7. **Keep images updated** for security patches
8. **Use `.dockerignore`** files to reduce build context
