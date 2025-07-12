import { NextResponse } from 'next/server'
import { getAllDynamicModelConfigs } from '@/lib/modelConfigService'

export async function GET() {
  try {
    console.log('API: Getting all model configurations...')
    
    const configs = await getAllDynamicModelConfigs()
    console.log(`API: Found ${configs.length} configurations`)
    
    return NextResponse.json({ 
      success: true, 
      data: configs,
      count: configs.length 
    })
    
  } catch (error) {
    console.error('API Error getting model configs:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch model configurations',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
