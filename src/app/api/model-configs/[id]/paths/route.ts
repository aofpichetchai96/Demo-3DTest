import { NextRequest, NextResponse } from 'next/server'
import { getModelConfiguration } from '@/lib/modelConfigService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const config = await getModelConfiguration(id)
    
    if (!config) {
      return NextResponse.json(
        { error: 'Model configuration not found' },
        { status: 404 }
      )
    }

    // Return paths from database or default paths
    const paths = Array.isArray(config.paths) && config.paths.length > 0 
      ? config.paths 
      : [
          `/models/${config.modelName}.glb`,
          `/models/${config.modelName}/${config.modelName}.glb`
        ]

    return NextResponse.json(paths)
  } catch (error) {
    console.error('Error fetching model paths:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
