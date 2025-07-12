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

    // Convert database config to ModelConfig format
    const modelConfig = {
      id: config.modelName,
      name: config.modelName,
      displayName: config.displayName || config.modelName,
      filePath: Array.isArray(config.paths) && config.paths.length > 0 ? config.paths[0] : `/models/${config.modelName}.glb`,
      fileSize: config.fileSize || '~Unknown',
      position: config.position,
      rotation: config.rotation,
      scale: config.scale,
      camera: config.camera,
      controls: config.controls,
      lighting: config.lighting,
      materials: config.materials,
      loadingTimeout: 30, // Default timeout
      description: config.description,
      tags: [] // Default empty tags
    }

    return NextResponse.json(modelConfig)
  } catch (error) {
    console.error('Error fetching model configuration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
