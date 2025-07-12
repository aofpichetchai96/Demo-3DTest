// Model Configuration Database
// เก็บข้อมูล position, zoom, rotation และ lighting สำหรับแต่ละโมเดล

// Remove import to avoid circular dependency
// import { getCachedModelConfig, getAllDynamicModelConfigs, getDynamicModelPaths } from './modelConfigService'
import type { ModelConfig, ModelDisplayInfo } from '@/types/modelConfig'

// Re-export types
export type { ModelConfig, ModelDisplayInfo }

// Database ของ Model Configurations
export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  adidas: {
    id: 'adidas',
    name: 'scanned_adidas_sports_shoe',
    displayName: 'Adidas Sports Shoe',
    filePath: '/models/scanned_adidas_sports_shoe.glb',
    fileSize: '~19MB',
    position: {
      x: 0,
      y: 0.3,
      z: 0
    },
    rotation: {
      x: 0,
      y: Math.PI * 0.25, // 45 degrees
      z: 0
    },
    scale: {
      x: 6,
      y: 6,
      z: 6
    },
    camera: {
      position: {
        x: 3.5,
        y: 2.1,
        z: 4.9
      },
      target: {
        x: 0,
        y: -0.2,
        z: 0
      },
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
        position: {
          x: 10,
          y: 10,
          z: 5
        },
        castShadow: true
      },
      point: {
        color: '#ffffff',
        intensity: 0.3,
        position: {
          x: 0,
          y: 5,
          z: 0
        }
      }
    },
    materials: {
      sole: {
        colorTarget: 'secondary',
        description: 'รองเท้าส้นและพื้นรองเท้า'
      },
      upper: {
        colorTarget: 'primary',
        description: 'ส่วนบนของรองเท้า'
      },
      stripe: {
        colorTarget: 'accent',
        description: 'ลายและโลโก้'
      },
      lace: {
        colorTarget: 'accent',
        description: 'เชือกผูกรองเท้า'
      }
    },
    loadingTimeout: 45,
    description: 'รองเท้ากีฬา Adidas ที่สแกนด้วยเทคโนโลยี 3D',
    tags: ['sports', 'adidas', 'running', 'athletic']
  },
  
  vans: {
    id: 'vans',
    name: 'unused_blue_vans_shoe',
    displayName: 'Vans Classic Shoe',
    filePath: '/models/unused_blue_vans_shoe.glb',
    fileSize: '~15MB',
    position: {
      x: 0,
      y: 0.2,
      z: 0
    },
    rotation: {
      x: 0,
      y: Math.PI * 0.3, // 54 degrees - slightly different angle
      z: 0
    },
    scale: {
      x: 5,
      y: 5,
      z: 5
    },
    camera: {
      position: {
        x: 3.2,
        y: 1.8,
        z: 4.5
      },
      target: {
        x: 0,
        y: 0,
        z: 0
      },
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
        position: {
          x: 8,
          y: 8,
          z: 4
        },
        castShadow: true
      },
      point: {
        color: '#ffffff',
        intensity: 0.2,
        position: {
          x: -2,
          y: 4,
          z: 2
        }
      }
    },
    materials: {
      sole: {
        colorTarget: 'secondary',
        description: 'ส้นรองเท้าและพื้น'
      },
      canvas: {
        colorTarget: 'primary',
        description: 'ผ้าใบส่วนบน'
      },
      rubber: {
        colorTarget: 'secondary',
        description: 'ยางรอบขอบ'
      },
      eyelets: {
        colorTarget: 'accent',
        description: 'รูเชือกและรายละเอียด'
      }
    },
    loadingTimeout: 35,
    description: 'รองเท้า Vans คลาสสิค สไตล์สเก็ตบอร์ด',
    tags: ['casual', 'vans', 'skateboard', 'classic', 'canvas']
  }
}

// Helper functions - updated to fallback to static config to avoid circular dependency
export async function getModelConfig(modelName: string): Promise<ModelConfig> {
  // Fallback to static config since we removed dynamic loading to avoid circular dependency
  const config = MODEL_CONFIGS[modelName]
  if (!config) {
    throw new Error(`Model configuration not found for: ${modelName}`)
  }
  return config
}

export async function getAllModelConfigs(): Promise<ModelConfig[]> {
  // Return static configs to avoid circular dependency
  return Object.values(MODEL_CONFIGS)
}

export async function getModelPaths(modelName: string): Promise<string[]> {
  // Return static config paths to avoid circular dependency
  const config = MODEL_CONFIGS[modelName]
  if (!config) {
    throw new Error(`Model configuration not found for: ${modelName}`)
  }
  return [
    config.filePath,
    config.filePath // Same path as backup
  ]
}

export async function getModelDisplayInfo(modelName: string) {
  const config = await getModelConfig(modelName)
  return {
    id: config.id,
    name: config.displayName,
    size: config.fileSize,
    description: config.description,
    tags: config.tags,
    timeout: config.loadingTimeout
  }
}

// Dynamic configuration updater
export async function updateModelConfig(modelName: string, updates: Partial<ModelConfig>): Promise<ModelConfig> {
  const config = await getModelConfig(modelName)
  const updatedConfig = { ...config, ...updates }
  // Note: This only updates the static config cache
  // To persist to database, use updateModelConfiguration from modelConfigService
  MODEL_CONFIGS[modelName] = updatedConfig
  return updatedConfig
}

// Preset configurations for different viewing modes
export interface ViewingMode {
  name: string
  camera: ModelConfig['camera']
  controls: ModelConfig['controls']
}

export const VIEWING_MODES: Record<string, ViewingMode> = {
  closeup: {
    name: 'Close-up View',
    camera: {
      position: { x: 2.5, y: 1.5, z: 3.5 },
      target: { x: 0, y: 0, z: 0 },
      fov: 25,
      near: 0.1,
      far: 1000
    },
    controls: {
      minDistance: 2,
      maxDistance: 5,
      autoRotateSpeed: 0.3,
      enableDamping: true,
      dampingFactor: 0.05
    }
  },
  overview: {
    name: 'Overview',
    camera: {
      position: { x: 5, y: 3, z: 7 },
      target: { x: 0, y: 0, z: 0 },
      fov: 45,
      near: 0.1,
      far: 1000
    },
    controls: {
      minDistance: 4,
      maxDistance: 12,
      autoRotateSpeed: 0.7,
      enableDamping: true,
      dampingFactor: 0.08
    }
  },
  side: {
    name: 'Side View',
    camera: {
      position: { x: 6, y: 1, z: 0 },
      target: { x: 0, y: 0, z: 0 },
      fov: 35,
      near: 0.1,
      far: 1000
    },
    controls: {
      minDistance: 3,
      maxDistance: 8,
      autoRotateSpeed: 0,
      enableDamping: true,
      dampingFactor: 0.1
    }
  }
}

export async function applyViewingMode(modelName: string, mode: string): Promise<ModelConfig> {
  const config = await getModelConfig(modelName)
  const viewingMode = VIEWING_MODES[mode]
  
  if (!viewingMode) {
    throw new Error(`Viewing mode not found: ${mode}`)
  }
  
  return {
    ...config,
    camera: viewingMode.camera,
    controls: viewingMode.controls
  }
}
