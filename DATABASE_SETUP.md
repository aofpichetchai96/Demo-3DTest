# Nike OEM 3D Customizer - Database Setup Guide

## 📦 Database Configuration

### Prerequisites
- PostgreSQL 14+ installed and running
- Database user with sufficient privileges

### Environment Variables
Add these to your `.env.local` file:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oem_3d_system
DB_USER=postgres
DB_PASSWORD=P@ssw0rd
```

## 🚀 Quick Setup

### 1. Create Database
Create PostgreSQL database manually:

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE oem_3d_system;
CREATE USER oem_user WITH PASSWORD 'P@ssw0rd';
GRANT ALL PRIVILEGES ON DATABASE oem_3d_system TO oem_user;
```

### 2. Test Connection
```bash
npm run db:setup
```

### 3. Generate and Push Schema
```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Seed Initial Data
```bash
npm run db:seed
```

## 📊 Database Schema

### Tables

#### `users`
- User authentication and profile information
- Roles: `user`, `admin`
- Password hashing with bcrypt

#### `collections`
- Saved shoe designs
- Color configurations (JSON)
- Public/private visibility
- Tags and metadata

#### `quotes`
- Price quotes for custom orders
- Quantity and pricing information
- Status tracking

#### `orders`
- Confirmed orders from quotes
- Shipping and tracking information
- Order status management

## 🔧 Available Scripts

```bash
# Database management
npm run db:setup          # Test database connection
npm run db:generate       # Generate migration files
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio (GUI)
npm run db:seed          # Seed initial data

# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
```

## 🎯 API Endpoints

### Collections
```
GET    /api/collections          # Get user's collections
POST   /api/collections          # Create new collection
GET    /api/collections/[id]     # Get specific collection
PUT    /api/collections/[id]     # Update collection
DELETE /api/collections/[id]     # Delete collection
GET    /api/collections/public   # Get public collections
```

### Authentication
```
POST   /api/auth/signin          # NextAuth login
POST   /api/auth/signout         # NextAuth logout
```

## 📝 Usage Examples

### Creating a Collection
```typescript
import { collectionsApi } from '@/lib/api'

const newCollection = await collectionsApi.create({
  name: 'Summer Vibes',
  colors: {
    primary: '#FF6B35',
    secondary: '#F7931E',
    accent: '#FFD23F'
  },
  size: '42',
  notes: 'Perfect for beach volleyball',
  tags: ['summer', 'sport', 'orange'],
  isPublic: true
})
```

### Fetching Collections
```typescript
import { getSavedDesigns } from '@/lib/collections'

// Async function with database fallback to localStorage
const designs = await getSavedDesigns()
```

## 🔐 Authentication

### Test Accounts
Default seeded accounts for testing:

```
Admin Account:
Email: admin@example.com
Password: password123

User Account:
Email: user@example.com
Password: password123
```

### Database vs localStorage
- **Production**: Uses PostgreSQL database with full user management
- **Development**: Falls back to localStorage if database is unavailable
- **Hybrid**: API calls to database with localStorage backup for offline work

## 🛠️ Troubleshooting

### Connection Issues
1. Ensure PostgreSQL is running: `pg_ctl status`
2. Check database exists: `psql -l`
3. Verify user permissions: `psql -U postgres -d oem_3d_system`

### Migration Issues
1. Reset database: `npm run db:push --force`
2. Check schema conflicts in Drizzle Studio
3. Manual migration: `psql -U postgres -d oem_3d_system -f migration.sql`

### Common Errors
- **Connection refused**: PostgreSQL not running
- **Authentication failed**: Wrong credentials in `.env.local`
- **Database does not exist**: Run manual database creation first
- **Permission denied**: Grant user privileges on database

## 🚀 Production Deployment

### Environment Variables
```bash
# Production database
DB_HOST=your-prod-host
DB_PORT=5432
DB_NAME=oem_3d_prod
DB_USER=prod_user
DB_PASSWORD=secure_password_here

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key-here
```

### Migration Strategy
1. Backup existing data
2. Run migrations on staging
3. Test thoroughly
4. Deploy to production
5. Run production migrations

## 📈 Performance Tips

- **Indexing**: Collections are indexed by userId and createdAt
- **Pagination**: Use LIMIT/OFFSET for large datasets
- **Connection Pooling**: Configured with max 10 connections
- **Caching**: Consider Redis for frequently accessed data

Ready to build some amazing custom shoes! 👟✨
