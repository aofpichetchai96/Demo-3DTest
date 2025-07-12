import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { seedModelConfigurations } from '@/lib/seed'

export async function POST() {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin access required' 
        },
        { status: 403 }
      )
    }

    console.log('🌱 Admin seeding model configurations...')
    
    // Run the seed function
    const result = await seedModelConfigurations()
    
    console.log('✅ Model configurations seeded successfully:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Model configurations seeded successfully',
      models: result
    })
    
  } catch (error) {
    console.error('❌ Error seeding model configurations:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed model configurations',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
