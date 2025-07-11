# OEM รองเท้านันยาง - Custom Rubber Shoe Builder

A modern web application for custom rubber shoe OEM manufacturing built with Next.js, TypeScript, 3D visualization, and PostgreSQL database.

## Features

🥾 **3D Shoe Customization** - Interactive 3D Nike shoe builder with real-time preview
🔐 **Database Authentication** - Secure PostgreSQL-based user authentication
🎨 **Design Studio** - Color customization with real-time 3D preview
💾 **Collections Management** - Save and manage custom shoe designs in database
📊 **API-First Architecture** - RESTful APIs for all data operations
📱 **Responsive Design** - Mobile-friendly interface inspired by Nike
🔄 **Hybrid Data System** - Database-first with localStorage fallback

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router, TypeScript
- **Styling**: Tailwind CSS 4
- **3D Rendering**: Three.js, React Three Fiber, Drei
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Lucide React icons, Class Variance Authority

### Backend
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with bcrypt password hashing
- **API**: Next.js API routes with TypeScript
- **Migration**: Drizzle Kit for schema management
- **Data Layer**: Hybrid database/localStorage system

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   - Copy `.env.local` and configure your database settings
   - Set `NEXTAUTH_SECRET` for authentication

4. Set up database:
   - Create PostgreSQL database named `oem_3d_system`
   - Configure database credentials in `.env.local`

### Database Setup

```bash
# Test database connection
npm run db:setup

# Generate and apply database schema
npm run db:generate
npm run db:push

# Seed initial data
npm run db:seed
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Database Management

```bash
npm run db:studio         # Open Drizzle Studio (GUI)
npm run db:generate       # Generate migration files
npm run db:push          # Push schema to database
npm run db:seed          # Seed test data
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Authentication page
│   ├── dashboard/         # User dashboard with Nike model
│   ├── customizer/        # 3D color customization
│   ├── collections/       # Saved designs management
│   └── api/               # API routes (collections, auth)
├── components/            # Reusable React components
│   ├── ShoeModel3D.tsx    # Core 3D Nike model component
│   ├── ShoeVisualizer.tsx # 3D wrapper component
│   └── Navigation.tsx     # App navigation
├── lib/                   # Utility functions and configs
│   ├── db.ts             # Database connection
│   ├── schema.ts         # Database schema definitions
│   ├── auth.ts           # NextAuth configuration
│   ├── api.ts            # API client functions
│   └── collections.ts    # Data management utilities
├── lib/                   # Utility functions and configs
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## Key Features

### 3D Customization
- Interactive 3D shoe models
- Real-time color and material changes
- Multiple viewing angles
- Texture and pattern options

### Authentication System
- Member-only access
- Secure JWT-based authentication
- User profile management

### Design Management
- Save custom designs
- Collection organization
- Design sharing capabilities

### Billing Integration
- Quote generation
- Invoice creation
- Order management

## Development Notes

- Use TypeScript for all components
- Follow Next.js App Router patterns
- Implement responsive design with Tailwind CSS
- Optimize 3D performance for web
- Follow accessibility best practices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software for OEM rubber shoe manufacturing.
