import { NextResponse } from 'next/server'

// POST /api/seed-models - Mock seed endpoint for testing
export async function POST() {
  try {
    console.log('🌱 Mock seeding model configurations...')
    
    // Simulate seeding process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockResult = [
      {
        modelName: 'adidas_shoe',
        displayName: 'Adidas Sports Shoe',
        fileSize: '~2.5MB'
      },
      {
        modelName: 'vans_shoe', 
        displayName: 'Blue Vans Shoe',
        fileSize: '~1.8MB'
      },
      {
        modelName: 'nike_shoe',
        displayName: 'Nike Running Shoe',
        fileSize: '~3.1MB'
      }
    ]
    
    console.log(`✅ Mock seeded ${mockResult.length} model configurations`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${mockResult.length} model configurations`,
      models: mockResult
    })

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      success: false,
      error: 'Failed to seed model configurations',
      details: errorMessage
    }, { status: 500 })
  }
}

// GET /api/seed-models - Check seeding status
export async function GET() {
  return NextResponse.json({
    message: 'Model configurations seeding endpoint',
    usage: 'POST to this endpoint to seed the database with model configurations'
  })
}
