import { config } from 'dotenv'
import { sql } from './db'

// Load environment variables from .env.local
config({ path: '.env.local' })

async function setupDatabase() {
  console.log('🚀 Setting up database...')

  try {
    // Test connection
    await sql`SELECT 1 as test`
    console.log('✅ Database connection successful')

    console.log('ℹ️  Database should already exist based on connection string')
    console.log('🎉 Database setup completed!')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    console.log('📝 Make sure PostgreSQL is running and database exists:')
    console.log(`   Database: ${process.env.DB_NAME}`)
    console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`)
    console.log(`   User: ${process.env.DB_USER}`)
    throw error
  } finally {
    await sql.end()
  }
}

setupDatabase().catch((error) => {
  console.error('Setup failed:', error)
  process.exit(1)
})
