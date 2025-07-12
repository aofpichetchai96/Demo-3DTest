import { db } from './src/lib/db.js'
import { users } from './src/lib/schema.js'

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Query all users from database
    const allUsers = await db.select().from(users)
    
    console.log('📊 Users in database:')
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Active: ${user.isActive}`)
    })
    
    console.log(`✅ Total users: ${allUsers.length}`)
    console.log('✅ Database connection successful!')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    process.exit(0)
  }
}

testDatabase()
