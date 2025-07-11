import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'

// Load environment variables in Node.js context
if (typeof window === 'undefined') {
  config({ path: '.env.local' })
}

if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error('Missing required database environment variables')
}

// Create postgres connection
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`

const sql = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  connect_timeout: 10, // Timeout after 10 seconds
})

export const db = drizzle(sql)
export { sql }
