import { config } from 'dotenv'
import { db, sql } from './db'
import { users, collections } from './schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// Load environment variables
config({ path: '.env.local' })

async function seed() {
  console.log('🌱 Starting database seeding...')

  try {
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@example.com'))
      .limit(1)

    if (existingAdmin.length === 0) {
      // Create admin user
      const adminPasswordHash = await bcrypt.hash('password123', 12)
      const [adminUser] = await db
        .insert(users)
        .values({
          email: 'admin@example.com',
          name: 'Admin User',
          passwordHash: adminPasswordHash,
          role: 'admin'
        })
        .returning()

      console.log('✅ Admin user created:', adminUser.email)
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    // Check if demo user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, 'user@example.com'))
      .limit(1)

    let demoUser = existingUser[0]
    if (!demoUser) {
      // Create demo user
      const userPasswordHash = await bcrypt.hash('password123', 12)
      const [newUser] = await db
        .insert(users)
        .values({
          email: 'user@example.com',
          name: 'Demo User',
          passwordHash: userPasswordHash,
          role: 'user'
        })
        .returning()

      demoUser = newUser
      console.log('✅ Demo user created:', demoUser.email)
    } else {
      console.log('ℹ️  Demo user already exists')
    }

    // Check if demo collections already exist
    const existingCollections = await db
      .select()
      .from(collections)
      .where(eq(collections.userId, demoUser.id))

    if (existingCollections.length === 0) {
      // Create sample collections for demo user
      const sampleCollections = [
        {
          name: 'Classic Black Design',
          colors: {
            primary: '#000000',
            secondary: '#FFFFFF',
            accent: '#FF0000'
          },
          size: '42',
          notes: 'Classic black and white design with red accents',
          tags: ['classic', 'formal'],
          isPublic: true
        },
        {
          name: 'Ocean Blue Style',
          colors: {
            primary: '#1E90FF',
            secondary: '#000080',
            accent: '#FFFFFF'
          },
          size: '41',
          notes: 'Ocean-inspired color scheme for summer',
          tags: ['summer', 'blue', 'ocean'],
          isPublic: true
        },
        {
          name: 'Forest Adventure',
          colors: {
            primary: '#228B22',
            secondary: '#8B4513',
            accent: '#FFFF00'
          },
          size: '43',
          notes: 'Outdoor adventure inspired design',
          tags: ['outdoor', 'adventure', 'green'],
          isPublic: false
        }
      ]

      for (const collection of sampleCollections) {
        await db
          .insert(collections)
          .values({
            userId: demoUser.id,
            ...collection
          })
      }

      console.log('✅ Sample collections created')
    } else {
      console.log('ℹ️  Sample collections already exist')
    }

    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await sql.end()
  }
}

// Run the seed function
seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
