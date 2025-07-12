import { NextResponse } from 'next/server'

// Simple test API that returns mock data
export async function GET() {
  try {
    console.log('API: Getting test configurations...')
    
    const mockConfigs = [
      {
        id: '1',
        modelName: 'adidas_shoe',
        displayName: 'Adidas Sports Shoe',
        fileSize: '~2.5MB',
        description: 'Scanned Adidas sports shoe with detailed texture',
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
        paths: ['/models/scanned_adidas_sports_shoe.glb'],
        isActive: true,
        viewingPresets: []
      },
      {
        id: '2',
        modelName: 'vans_shoe',
        displayName: 'Blue Vans Shoe',
        fileSize: '~1.8MB',
        description: 'Unused blue Vans shoe model',
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
        paths: ['/models/unused_blue_vans_shoe.glb'],
        isActive: true,
        viewingPresets: []
      }
    ]
    
    return NextResponse.json({ 
      success: true, 
      data: mockConfigs,
      count: mockConfigs.length,
      message: 'Mock data loaded successfully'
    })
    
  } catch (error) {
    console.error('API Error:', error)
    
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
