import { config } from 'dotenv'
import { db } from './db'
import { users, collections } from './schema'
import bcrypt from 'bcryptjs'

// Load environment variables from .env.local
config({ path: '.env.local' })

async function seed() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('password123', 12)
    const [adminUser] = await db.insert(users).values({
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'admin'
    }).returning()

    console.log('✅ Admin user created:', adminUser.email)

    // Create demo user
    const userPassword = await bcrypt.hash('password123', 12)
    const [demoUser] = await db.insert(users).values({
      email: 'user@example.com',
      name: 'Demo User',
      passwordHash: userPassword,
      role: 'user'
    }).returning()

    console.log('✅ Demo user created:', demoUser.email)

    // Create sample collections for demo user
    const sampleCollections = [
      {
        userId: demoUser.id,
        name: 'Classic Black',
        colors: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          accent: '#ffffff'
        },
        size: '42',
        notes: 'Timeless black design with white accents',
        tags: ['classic', 'formal', 'black'],
        isPublic: true
      },
      {
        userId: demoUser.id,
        name: 'Royal Blue',
        colors: {
          primary: '#1e40af',
          secondary: '#1e3a8a',
          accent: '#60a5fa'
        },
        size: '41',
        notes: 'Professional blue with lighter accents',
        tags: ['blue', 'professional', 'sport'],
        isPublic: true
      },
      {
        userId: demoUser.id,
        name: 'Forest Green',
        colors: {
          primary: '#166534',
          secondary: '#15803d',
          accent: '#22c55e'
        },
        size: '43',
        notes: 'Nature-inspired green combination',
        tags: ['green', 'nature', 'outdoor'],
        isPublic: false
      },
      {
        userId: demoUser.id,
        name: 'Sunset Orange',
        colors: {
          primary: '#ea580c',
          secondary: '#dc2626',
          accent: '#fbbf24'
        },
        size: '42',
        notes: 'Vibrant sunset colors for bold style',
        tags: ['orange', 'vibrant', 'sunset'],
        isPublic: true
      }
    ]

    for (const collection of sampleCollections) {
      const [created] = await db.insert(collections).values(collection).returning()
      console.log('✅ Collection created:', created.name)
    }

    // Create some collections for admin user
    const adminCollections = [
      {
        userId: adminUser.id,
        name: 'Purple Dream',
        colors: {
          primary: '#7c3aed',
          secondary: '#6d28d9',
          accent: '#c4b5fd'
        },
        size: '40',
        notes: 'Elegant purple design for special occasions',
        tags: ['purple', 'elegant', 'special'],
        isPublic: true
      },
      {
        userId: adminUser.id,
        name: 'Fire Red',
        colors: {
          primary: '#dc2626',
          secondary: '#b91c1c',
          accent: '#fca5a5'
        },
        size: '44',
        notes: 'Bold red design with striking presence',
        tags: ['red', 'bold', 'striking'],
        isPublic: true
      }
    ]

    for (const collection of adminCollections) {
      const [created] = await db.insert(collections).values(collection).returning()
      console.log('✅ Admin collection created:', created.name)
    }

    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function
seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
