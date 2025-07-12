// Shared type definitions for model configurations

export interface ModelConfig {
  id: string
  name: string
  displayName: string
  filePath: string
  fileSize: string
  position: {
    x: number
    y: number
    z: number
  }
  rotation: {
    x: number
    y: number
    z: number
  }
  scale: {
    x: number
    y: number
    z: number
  }
  camera: {
    position: {
      x: number
      y: number
      z: number
    }
    target: {
      x: number
      y: number
      z: number
    }
    fov: number
    near: number
    far: number
  }
  controls: {
    minDistance: number
    maxDistance: number
    autoRotateSpeed: number
    enableDamping: boolean
    dampingFactor: number
  }
  lighting: {
    ambient: {
      color: string
      intensity: number
    }
    directional: {
      color: string
      intensity: number
      position: {
        x: number
        y: number
        z: number
      }
      castShadow: boolean
    }
    point: {
      color: string
      intensity: number
      position: {
        x: number
        y: number
        z: number
      }
    }
  }
  materials: {
    [key: string]: {
      colorTarget: 'primary' | 'secondary' | 'accent'
      description: string
    }
  }
  loadingTimeout: number
  description: string
  tags: string[]
}

export interface ModelDisplayInfo {
  displayName: string
  description: string
  fileSize: string
  modelType: string
  category: string
  tags: string[]
  previewImage?: string
  isAvailable: boolean
}
