import { config } from 'dotenv'
import { db, sql } from './db'
import { users, collections, modelConfigurations } from './schema'
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

// New function to seed model configurations
export async function seedModelConfigurations() {
  console.log('🌱 Seeding model configurations...')
  
  const modelSeeds = [
    {
      modelName: 'adidas',
      displayName: 'Adidas Sports Shoe',
      fileSize: '~2.5MB',
      description: 'High-performance sports shoe with modern design',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      camera: {
        position: { x: 0, y: 5, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        fov: 75,
        near: 0.1,
        far: 1000
      },
      controls: {
        minDistance: 2,
        maxDistance: 50,
        autoRotateSpeed: 0,
        enableDamping: true,
        dampingFactor: 0.05
      },
      lighting: {
        ambient: { color: '#404040', intensity: 0.4 },
        directional: { 
          color: '#ffffff', 
          intensity: 0.6, 
          position: { x: 1, y: 1, z: 1 },
          castShadow: true 
        },
        point: { 
          color: '#ffffff', 
          intensity: 0.5, 
          position: { x: 10, y: 10, z: 10 } 
        }
      },
      materials: {},
      paths: ['/models/scanned_adidas_sports_shoe.glb']
    },
    {
      modelName: 'vans',
      displayName: 'Blue Vans Shoe',
      fileSize: '~3.1MB',
      description: 'Classic casual shoe with blue canvas design',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      camera: {
        position: { x: 0, y: 5, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        fov: 75,
        near: 0.1,
        far: 1000
      },
      controls: {
        minDistance: 2,
        maxDistance: 50,
        autoRotateSpeed: 0,
        enableDamping: true,
        dampingFactor: 0.05
      },
      lighting: {
        ambient: { color: '#404040', intensity: 0.4 },
        directional: { 
          color: '#ffffff', 
          intensity: 0.6, 
          position: { x: 1, y: 1, z: 1 },
          castShadow: true 
        },
        point: { 
          color: '#ffffff', 
          intensity: 0.5, 
          position: { x: 10, y: 10, z: 10 } 
        }
      },
      materials: {},
      paths: ['/models/unused_blue_vans_shoe.glb']
    },
    {
      modelName: 'nike',
      displayName: 'Nike Classic',
      fileSize: '~4.2MB',
      description: 'Classic Nike sneaker with OBJ format',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      camera: {
        position: { x: 0, y: 5, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        fov: 75,
        near: 0.1,
        far: 1000
      },
      controls: {
        minDistance: 2,
        maxDistance: 50,
        autoRotateSpeed: 0,
        enableDamping: true,
        dampingFactor: 0.05
      },
      lighting: {
        ambient: { color: '#404040', intensity: 0.4 },
        directional: { 
          color: '#ffffff', 
          intensity: 0.6, 
          position: { x: 1, y: 1, z: 1 },
          castShadow: true 
        },
        point: { 
          color: '#ffffff', 
          intensity: 0.5, 
          position: { x: 10, y: 10, z: 10 } 
        }
      },
      materials: {},
      paths: ['/models/nike/nike.obj']
    }
  ]

  const results = []
  
  for (const modelSeed of modelSeeds) {
    try {
      // Check if model already exists
      const existing = await db
        .select()
        .from(modelConfigurations)
        .where(eq(modelConfigurations.modelName, modelSeed.modelName))
        .limit(1)

      if (existing.length === 0) {
        const [newConfig] = await db
          .insert(modelConfigurations)
          .values(modelSeed)
          .returning()
        
        console.log(`✅ Created model config: ${modelSeed.displayName}`)
        results.push(newConfig)
      } else {
        console.log(`ℹ️  Model config already exists: ${modelSeed.displayName}`)
        results.push(existing[0])
      }
    } catch (error) {
      console.error(`❌ Error creating model config for ${modelSeed.modelName}:`, error)
    }
  }

  return results
}

// Run the seed function
seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
