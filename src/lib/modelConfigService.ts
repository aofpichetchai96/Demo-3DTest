import { db } from './db'
import { modelConfigurations, viewingPresets, type ModelConfiguration, type NewModelConfiguration, type ViewingPreset, type NewViewingPreset } from './schema'
import { eq, and } from 'drizzle-orm'
import type { ModelConfig } from '@/types/modelConfig'

// Cache for configurations
const configCache = new Map<string, { data: ModelConfiguration[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Model Configuration CRUD Operations

export async function createModelConfiguration(data: NewModelConfiguration): Promise<ModelConfiguration> {
  const [result] = await db.insert(modelConfigurations).values(data).returning()
  return result
}

export async function getModelConfiguration(modelName: string): Promise<ModelConfiguration | null> {
  const [result] = await db
    .select()
    .from(modelConfigurations)
    .where(and(
      eq(modelConfigurations.modelName, modelName),
      eq(modelConfigurations.isActive, true)
    ))
    .limit(1)
  
  return result || null
}

export async function getAllModelConfigurations(): Promise<ModelConfiguration[]> {
  return await db
    .select()
    .from(modelConfigurations)
    .where(eq(modelConfigurations.isActive, true))
    .orderBy(modelConfigurations.displayName)
}

export async function updateModelConfiguration(
  modelName: string, 
  updates: Partial<NewModelConfiguration>
): Promise<ModelConfiguration | null> {
  const [result] = await db
    .update(modelConfigurations)
    .set({
      ...updates,
      updatedAt: new Date()
    })
    .where(eq(modelConfigurations.modelName, modelName))
    .returning()
  
  return result || null
}

export async function deleteModelConfiguration(modelName: string): Promise<boolean> {
  const result = await db
    .update(modelConfigurations)
    .set({ 
      isActive: false, 
      updatedAt: new Date() 
    })
    .where(eq(modelConfigurations.modelName, modelName))
    .returning()
  
  return result.length > 0
}

// Viewing Presets CRUD Operations

export async function createViewingPreset(data: NewViewingPreset): Promise<ViewingPreset> {
  const [result] = await db.insert(viewingPresets).values(data).returning()
  return result
}

export async function getViewingPresets(modelConfigId: string): Promise<ViewingPreset[]> {
  return await db
    .select()
    .from(viewingPresets)
    .where(and(
      eq(viewingPresets.modelConfigId, modelConfigId),
      eq(viewingPresets.isActive, true)
    ))
    .orderBy(viewingPresets.presetName)
}

export async function getViewingPreset(
  modelConfigId: string, 
  presetName: string
): Promise<ViewingPreset | null> {
  const [result] = await db
    .select()
    .from(viewingPresets)
    .where(and(
      eq(viewingPresets.modelConfigId, modelConfigId),
      eq(viewingPresets.presetName, presetName),
      eq(viewingPresets.isActive, true)
    ))
    .limit(1)
  
  return result || null
}

export async function updateViewingPreset(
  id: string,
  updates: Partial<NewViewingPreset>
): Promise<ViewingPreset | null> {
  const [result] = await db
    .update(viewingPresets)
    .set({
      ...updates,
      updatedAt: new Date()
    })
    .where(eq(viewingPresets.id, id))
    .returning()
  
  return result || null
}

export async function deleteViewingPreset(id: string): Promise<boolean> {
  const result = await db
    .update(viewingPresets)
    .set({ 
      isActive: false, 
      updatedAt: new Date() 
    })
    .where(eq(viewingPresets.id, id))
    .returning()
  
  return result.length > 0
}

// Helper Functions

export async function getModelWithPresets(modelName: string) {
  const modelConfig = await getModelConfiguration(modelName)
  if (!modelConfig) return null
  
  const presets = await getViewingPresets(modelConfig.id)
  
  return {
    ...modelConfig,
    viewingPresets: presets
  }
}

export async function seedModelConfigurations() {
  console.log('🌱 Seeding model configurations...')

  try {
    // Adidas Model Configuration
    const adidasConfig = await createModelConfiguration({
      modelName: 'adidas',
      displayName: 'Adidas Sports Shoe',
      fileSize: '23.4 MB',
      description: 'High-quality 3D scanned Adidas sports shoe model with detailed textures',
      position: { x: 0, y: 0.2, z: 0 },
      rotation: { x: 0, y: Math.PI * 0.2, z: 0 },
      scale: { x: 6, y: 6, z: 6 },
      camera: {
        position: { x: 3.2, y: 2.0, z: 4.8 },
        target: { x: 0, y: -0.1, z: 0 },
        fov: 35,
        near: 0.1,
        far: 1000
      },
      controls: {
        minDistance: 3.5,
        maxDistance: 8,
        autoRotateSpeed: 0.5,
        enableDamping: true,
        dampingFactor: 0.05
      },
      lighting: {
        ambient: {
          color: '#ffffff',
          intensity: 0.6
        },
        directional: {
          color: '#ffffff',
          intensity: 1,
          position: { x: 10, y: 10, z: 5 },
          castShadow: true
        },
        point: {
          color: '#ffffff',
          intensity: 0.3,
          position: { x: 0, y: 5, z: 0 }
        }
      },
      materials: {
        sole: {
          colorTarget: 'secondary',
          description: 'ส้นรองเท้าและพื้น'
        },
        canvas: {
          colorTarget: 'primary',
          description: 'ผ้าใบหลัก'
        },
        stripe: {
          colorTarget: 'accent',
          description: 'แถบและโลโก้'
        }
      },
      paths: [
        '/models/scanned_adidas_sports_shoe.glb',
        '/models/scanned_adidas_sports_shoe/scanned_adidas_sports_shoe.glb'
      ],
      isActive: true
    })

    // Vans Model Configuration
    const vansConfig = await createModelConfiguration({
      modelName: 'vans',
      displayName: 'Blue Vans Shoe',
      fileSize: '18.7 MB',
      description: 'Classic Vans-style shoe model with traditional skateboard shoe design',
      position: { x: 0, y: 0.3, z: 0 },
      rotation: { x: 0, y: Math.PI * 0.25, z: 0 },
      scale: { x: 5.5, y: 5.5, z: 5.5 },
      camera: {
        position: { x: 2.8, y: 1.8, z: 4.5 },
        target: { x: 0, y: 0, z: 0 },
        fov: 40,
        near: 0.1,
        far: 1000
      },
      controls: {
        minDistance: 3,
        maxDistance: 7.5,
        autoRotateSpeed: 0.4,
        enableDamping: true,
        dampingFactor: 0.08
      },
      lighting: {
        ambient: {
          color: '#ffffff',
          intensity: 0.7
        },
        directional: {
          color: '#ffffff',
          intensity: 0.9,
          position: { x: 8, y: 8, z: 4 },
          castShadow: true
        },
        point: {
          color: '#ffffff',
          intensity: 0.2,
          position: { x: -2, y: 4, z: 2 }
        }
      },
      materials: {
        sole: {
          colorTarget: 'secondary',
          description: 'ส้นรองเท้าและพื้น'
        },
        canvas: {
          colorTarget: 'primary',
          description: 'ผ้าใบหลัก'
        },
        lace: {
          colorTarget: 'accent',
          description: 'เชือกผูกรองเท้า'
        }
      },
      paths: [
        '/models/unused_blue_vans_shoe.glb',
        '/models/unused_blue_vans_shoe/unused_blue_vans_shoe.glb'
      ],
      isActive: true
    })

    // สร้าง Viewing Presets สำหรับ Adidas
    await createViewingPreset({
      modelConfigId: adidasConfig.id,
      presetName: 'closeup',
      displayName: 'Close-up View',
      camera: {
        position: { x: 2.5, y: 1.5, z: 3.5 },
        target: { x: 0, y: 0, z: 0 },
        fov: 25
      },
      controls: {
        minDistance: 2,
        maxDistance: 5,
        autoRotateSpeed: 0.3
      },
      isActive: true
    })

    await createViewingPreset({
      modelConfigId: adidasConfig.id,
      presetName: 'overview',
      displayName: 'Overview',
      camera: {
        position: { x: 5, y: 3, z: 7 },
        target: { x: 0, y: 0, z: 0 },
        fov: 45
      },
      controls: {
        minDistance: 4,
        maxDistance: 10,
        autoRotateSpeed: 0.5
      },
      isActive: true
    })

    // สร้าง Viewing Presets สำหรับ Vans
    await createViewingPreset({
      modelConfigId: vansConfig.id,
      presetName: 'closeup',
      displayName: 'Close-up View',
      camera: {
        position: { x: 2.2, y: 1.3, z: 3.2 },
        target: { x: 0, y: 0, z: 0 },
        fov: 30
      },
      controls: {
        minDistance: 2,
        maxDistance: 4.5,
        autoRotateSpeed: 0.25
      },
      isActive: true
    })

    await createViewingPreset({
      modelConfigId: vansConfig.id,
      presetName: 'side',
      displayName: 'Side View',
      camera: {
        position: { x: 6, y: 2, z: 0 },
        target: { x: 0, y: 0, z: 0 },
        fov: 35
      },
      controls: {
        minDistance: 3.5,
        maxDistance: 8,
        autoRotateSpeed: 0.2
      },
      isActive: true
    })

    console.log('✅ Model configurations seeded successfully!')
    return await getAllModelConfigurations()

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// Database to ModelConfig conversion functions
export function dbConfigToModelConfig(dbConfig: ModelConfiguration): ModelConfig {
  // Safely convert JSONB data to proper types
  const position = (dbConfig.position && typeof dbConfig.position === 'object' && 'x' in dbConfig.position) 
    ? dbConfig.position as { x: number; y: number; z: number }
    : { x: 0, y: 0, z: 0 }

  const rotation = (dbConfig.rotation && typeof dbConfig.rotation === 'object' && 'x' in dbConfig.rotation)
    ? dbConfig.rotation as { x: number; y: number; z: number }
    : { x: 0, y: 0, z: 0 }

  const scale = (dbConfig.scale && typeof dbConfig.scale === 'object' && 'x' in dbConfig.scale)
    ? dbConfig.scale as { x: number; y: number; z: number }
    : { x: 1, y: 1, z: 1 }

  const camera = (dbConfig.camera && typeof dbConfig.camera === 'object' && 'position' in dbConfig.camera)
    ? dbConfig.camera as ModelConfig['camera']
    : {
        position: { x: 0, y: 5, z: 10 },
        target: { x: 0, y: 0, z: 0 },
        fov: 75,
        near: 0.1,
        far: 1000
      }

  const controls = (dbConfig.controls && typeof dbConfig.controls === 'object')
    ? dbConfig.controls as ModelConfig['controls']
    : {
        minDistance: 2,
        maxDistance: 50,
        autoRotateSpeed: 0,
        enableDamping: true,
        dampingFactor: 0.05
      }

  const lighting = (dbConfig.lighting && typeof dbConfig.lighting === 'object' && 'ambient' in dbConfig.lighting)
    ? dbConfig.lighting as ModelConfig['lighting']
    : {
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
      }

  const materials = (dbConfig.materials && typeof dbConfig.materials === 'object')
    ? dbConfig.materials as ModelConfig['materials']
    : {}

  return {
    id: dbConfig.modelName,
    name: dbConfig.modelName,
    displayName: dbConfig.displayName,
    filePath: Array.isArray(dbConfig.paths) ? dbConfig.paths[0] : '/models/default.glb',
    fileSize: dbConfig.fileSize || '~0MB',
    position,
    rotation,
    scale,
    camera,
    controls,
    lighting,
    materials,
    loadingTimeout: 45,
    description: dbConfig.description || '',
    tags: []
  }
}

// Get model config from database with fallback to static config
export async function getDynamicModelConfig(modelName: string): Promise<ModelConfig | null> {
  try {
    const dbConfig = await getModelConfiguration(modelName)
    if (dbConfig) {
      return dbConfigToModelConfig(dbConfig)
    }
    return null
  } catch (error) {
    console.error('Error fetching model config from database:', error)
    return null
  }
}

// Get all model configs from database
export async function getAllDynamicModelConfigs(): Promise<ModelConfig[]> {
  try {
    const dbConfigs = await getAllModelConfigurations()
    return dbConfigs.map(dbConfigToModelConfig)
  } catch (error) {
    console.error('Error fetching all model configs from database:', error)
    return []
  }
}

// Get model paths from database
export async function getDynamicModelPaths(modelName: string): Promise<string[]> {
  try {
    const dbConfig = await getModelConfiguration(modelName)
    if (dbConfig && Array.isArray(dbConfig.paths)) {
      return dbConfig.paths
    }
    return []
  } catch (error) {
    console.error('Error fetching model paths from database:', error)
    return []
  }
}

export async function getCachedModelConfig(modelName: string): Promise<ModelConfig | null> {
  const now = Date.now()
  
  // Check if cache is still valid
  const cacheKey = 'all_configs'
  if (configCache.has(cacheKey)) {
    const cached = configCache.get(cacheKey)!
    if (now - cached.timestamp < CACHE_DURATION) {
      const config = cached.data.find(c => c.modelName === modelName)
      if (config) {
        return dbConfigToModelConfig(config)
      }
    }
  }
  
  // Fetch from database
  const config = await getDynamicModelConfig(modelName)
  return config
}
