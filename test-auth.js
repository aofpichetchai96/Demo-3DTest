import { db } from './src/lib/db.js'
import { users } from './src/lib/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

async function testAuth() {
  try {
    console.log('🔐 Testing authentication process...')
    
    const testEmail = 'admin@example.com'
    const testPassword = 'password123'
    
    // Simulate the authentication process
    console.log(`🔍 Looking for user: ${testEmail}`)
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail))
      .limit(1)
      
    if (!user) {
      console.log('❌ User not found!')
      return
    }
    
    console.log(`✅ User found: ${user.name} (${user.role})`)
    console.log(`📧 Email: ${user.email}`)
    console.log(`🔒 Password hash exists: ${user.passwordHash ? 'Yes' : 'No'}`)
    console.log(`✅ Account active: ${user.isActive}`)
    
    // Test password verification
    const isValidPassword = await bcrypt.compare(testPassword, user.passwordHash)
    console.log(`🔑 Password verification: ${isValidPassword ? 'PASS' : 'FAIL'}`)
    
    if (isValidPassword) {
      console.log('🎉 Authentication would be SUCCESSFUL!')
      console.log('📋 User data that would be returned:')
      console.log({
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role: user.role
      })
    } else {
      console.log('❌ Authentication would FAIL!')
    }
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error)
  } finally {
    process.exit(0)
  }
}

testAuth()
