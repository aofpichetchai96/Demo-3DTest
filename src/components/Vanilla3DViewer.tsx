'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getModelConfig, getModelPaths, VIEWING_MODES } from '@/lib/modelConfigs'
import type { Colors } from '@/types'

interface Vanilla3DViewerProps {
  colors: Colors
  autoRotate?: boolean
  showControls?: boolean
  modelName?: string
  className?: string
}

export default function Vanilla3DViewer({ 
  colors, 
  autoRotate = true,
  showControls = true,
  modelName = 'adidas',
  className = ""
}: Vanilla3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...')
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loadedPath, setLoadedPath] = useState<string>('')
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sceneRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rendererRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelRef = useRef<any>(null)
  const hasInitialized = useRef(false)
  const mounted = useRef(true)
  const animationId = useRef<number | null>(null)

  // Since useEffect doesn't work in this environment, use ref-based initialization
  // Only run on client-side to avoid SSR issues
  if (!hasInitialized.current && typeof window !== 'undefined') {
    console.log('🚀 REF-BASED INITIALIZATION - Starting GLB loading process (CLIENT-SIDE)')
    hasInitialized.current = true
    
    // Use longer timeout and retry mechanism to ensure DOM is ready
    const tryInit = (attempt: number = 1) => {
      setTimeout(() => {
        // Only run on client-side
        if (typeof window === 'undefined' || typeof document === 'undefined') {
          console.log('❌ Server-side detected, skipping Three.js initialization')
          return
        }
        
        console.log(`🕒 TIMEOUT CALLBACK - Attempt ${attempt}, checking canvas...`)
        console.log('📍 canvasRef.current:', !!canvasRef.current)
        console.log('📍 DOM canvas elements:', document.querySelectorAll('canvas').length)
        
        // Try both ref and direct DOM query
        const canvas = canvasRef.current || document.querySelector('canvas')
        console.log('📍 Canvas found via:', canvas ? (canvasRef.current ? 'ref' : 'DOM query') : 'none')
        
        if (canvas) {
          console.log('✅ Canvas ready! Starting Three.js initialization')
          // Update ref if we found via DOM query (using type assertion to bypass readonly)
          if (!canvasRef.current && canvas instanceof HTMLCanvasElement) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (canvasRef as any).current = canvas
          }
          initThreeJS()
        } else if (attempt < 10) {
          console.log(`❌ Canvas not ready on attempt ${attempt}, retrying...`)
          tryInit(attempt + 1)
        } else {
          console.error('❌ Canvas never became ready after 10 attempts')
          setLoadError('Canvas element not ready - DOM mounting issue')
        }
      }, attempt * 100) // Shorter delay, more attempts
    }
    
    tryInit()
  }

  const findWorkingModelPath = async (): Promise<string> => {
    // ใช้ configuration จากฐานข้อมูล
    try {
      const modelPaths = await getModelPaths(modelName)
      console.log(`🔍 Searching for ${modelName} model paths from config...`)
      console.log('Available paths to check:', modelPaths)
      
      for (const path of modelPaths) {
        try {
          console.log(`🔍 Checking path: ${path}`)
          const fullUrl = `${window.location.origin}${path}`
          console.log(`🌐 Full URL: ${fullUrl}`)
          
          const response = await fetch(path, { method: 'HEAD' })
          console.log(`📡 Response for ${path}:`, {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: {
              'content-type': response.headers.get('content-type'),
              'content-length': response.headers.get('content-length')
            }
          })
          
          if (response.ok) {
            console.log('✅ Found working path:', path)
            console.log('🎯 Model will be loaded from:', path)
            return path
          } else {
            console.log(`❌ Failed for ${path}:`, response.status, response.statusText)
          }
        } catch (error) {
          console.log(`🚫 Network error checking ${path}:`, error)
        }
      }
      
      console.log('🚫 No working model path found!')
      console.log('💡 Available paths tried:', modelPaths)
      throw new Error('No working model path found')
    } catch (configError) {
      console.error('❌ Error getting model config:', configError)
      throw new Error(`Model configuration error: ${configError}`)
    }
  }

  const initThreeJS = async () => {
    console.log('🏁 STARTING initThreeJS function')
    console.log('🎯 Current modelName:', modelName)
    
    try {
      // Get dynamic configuration with fallback to static
      let config
      try {
        config = await getModelConfig(modelName)
        console.log('📋 Using dynamic model config:', config)
      } catch (configError) {
        console.warn('⚠️ Failed to get dynamic config, using static fallback:', configError)
        // Fallback to basic static config
        config = {
          id: modelName,
          name: modelName,
          displayName: modelName.charAt(0).toUpperCase() + modelName.slice(1),
          filePath: `/models/${modelName}.glb`,
          fileSize: '~2MB',
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
          loadingTimeout: 45,
          description: `${modelName} 3D model`,
          tags: []
        }
      }
      
      if (!mounted.current) return
      setLoadingStatus(`Searching for ${config.displayName}...`)
      console.log('📋 Loading status set to: Searching for GLB model...')
      
      if (!mounted.current || !canvasRef.current) {
        console.log('❌ Early exit - mounted:', mounted.current, 'canvasRef.current:', !!canvasRef.current)
        return
      }

      // Find working model path
      let workingPath: string
      try {
        console.log('🔍 About to call findWorkingModelPath()')
        workingPath = await findWorkingModelPath()
        console.log('✅ findWorkingModelPath completed with result:', workingPath)
        if (!mounted.current) return
        setLoadingStatus(`Found ${config.displayName} (${config.fileSize})`)
        setLoadedPath(workingPath)
        console.log('Using model path:', workingPath)
      } catch (error) {
        console.error('❌ findWorkingModelPath failed:', error)
        setLoadError(`${config.displayName} file not found`)
        return
      }
      
      // Scene setup
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a1a2e)
      sceneRef.current = scene
      
      // Dynamic Camera setup
      const camera = new THREE.PerspectiveCamera(
        config.camera.fov,
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        config.camera.near,
        config.camera.far
      )
      camera.position.set(
        config.camera.position.x,
        config.camera.position.y,
        config.camera.position.z
      )
      
      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      })
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      rendererRef.current = renderer
      
      // Dynamic Lighting setup
      const ambientLight = new THREE.AmbientLight(
        config.lighting.ambient.color, 
        config.lighting.ambient.intensity
      )
      scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(
        config.lighting.directional.color, 
        config.lighting.directional.intensity
      )
      directionalLight.position.set(
        config.lighting.directional.position.x,
        config.lighting.directional.position.y,
        config.lighting.directional.position.z
      )
      directionalLight.castShadow = config.lighting.directional.castShadow
      scene.add(directionalLight)
      
      const pointLight = new THREE.PointLight(
        config.lighting.point.color, 
        config.lighting.point.intensity
      )
      pointLight.position.set(
        config.lighting.point.position.x,
        config.lighting.point.position.y,
        config.lighting.point.position.z
      )
      scene.add(pointLight)
      
      // Dynamic Controls setup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let controls: any = null
      if (showControls) {
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = config.controls.enableDamping
        controls.dampingFactor = config.controls.dampingFactor
        controls.minDistance = config.controls.minDistance
        controls.maxDistance = config.controls.maxDistance
        controls.target.set(
          config.camera.target.x,
          config.camera.target.y,
          config.camera.target.z
        )
        controls.autoRotate = autoRotate
        controls.autoRotateSpeed = config.controls.autoRotateSpeed
      }
      
      if (!mounted.current) return
      setLoadingStatus(`Loading ${config.displayName}...`)
      
      // Load GLB model
      const loader = new GLTFLoader()
      
      console.log('Starting GLB load:', workingPath)
      if (!mounted.current) return
      setLoadingStatus(`Requesting ${config.displayName} file...`)
      
      loader.load(
        workingPath,
        // onLoad callback
        (gltf) => {
          if (!mounted.current) return
          
          console.log('🎉 GLB loaded successfully:', gltf)
          console.log('Model scene:', gltf.scene)
          console.log('Model animations:', gltf.animations)
          if (!mounted.current) return
          setLoadingStatus(`Processing ${config.displayName}...`)
          setLoadingProgress(100)
          
          const model = gltf.scene
          
          // Debug: Log model structure
          console.log('Model children count:', model.children.length)
          model.traverse((child) => {
            console.log('Child:', child.type, child.name)
            if (child.type === 'Mesh') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const mesh = child as any
              console.log('  - Material:', mesh.material?.name, mesh.material?.type)
            }
          })
          
          // Apply dynamic positioning
          model.scale.set(config.scale.x, config.scale.y, config.scale.z)
          model.position.set(config.position.x, config.position.y, config.position.z)
          model.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z)
          
          // Apply colors to materials using dynamic mapping
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          model.traverse((child: any) => {
            if (child.isMesh) {
              const material = child.material
              if (material) {
                // Clone material to avoid affecting other instances
                const newMaterial = material.clone()
                
                // Apply color based on material/mesh name using config
                const materialName = (material.name || '').toLowerCase()
                const meshName = (child.name || '').toLowerCase()
                
                let targetColor = colors.primary // default
                
                // Use material mapping from config
                for (const [materialKey, materialConfig] of Object.entries(config.materials)) {
                  if (materialName.includes(materialKey.toLowerCase()) || 
                      meshName.includes(materialKey.toLowerCase())) {
                    targetColor = colors[materialConfig.colorTarget]
                    console.log(`🎨 Applying ${materialConfig.colorTarget} color to ${materialKey}:`, targetColor)
                    break
                  }
                }
                
                newMaterial.color = new THREE.Color(targetColor)
                child.material = newMaterial
              }
            }
          })
          
          scene.add(model)
          modelRef.current = model
          
          setIsLoaded(true)
          setLoadingStatus(`${config.displayName} loaded successfully!`)
          
          // Animation loop
          const animate = () => {
            if (!mounted.current) return
            
            animationId.current = requestAnimationFrame(animate)
            
            if (controls) {
              controls.update()
            }
            
            renderer.render(scene, camera)
          }
          
          animate()
        },
        // onProgress callback - optimized for large files
        (progress) => {
          if (!mounted.current) return
          
          const loaded = progress.loaded
          const total = progress.total
          
          if (total > 0) {
            const percent = Math.round((loaded / total) * 100)
            const loadedMB = (loaded / (1024 * 1024)).toFixed(1)
            const totalMB = (total / (1024 * 1024)).toFixed(1)
            
            setLoadingProgress(percent)
            setLoadingStatus(`Loading ${config.displayName}: ${percent}% (${loadedMB}/${totalMB} MB)`)
            console.log(`📦 Loading progress: ${percent}% - ${loadedMB}MB/${totalMB}MB`)
            
            // Additional feedback for large files
            if (total > 20 * 1024 * 1024) { // 20MB in bytes
              console.log(`📋 Large file detected (${config.fileSize}), please wait...`)
            }
          } else {
            setLoadingStatus(`Downloading ${config.displayName}...`)
            console.log('📦 Loading progress: calculating...')
          }
        },
        // onError callback - enhanced for large files
        (error) => {
          if (!mounted.current) return
          console.error('❌ GLB load failed:', error)
          
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          let enhancedMessage = `Failed to load ${config.displayName}: ${errorMessage}`
          
          // Specific error messages for large files
          if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
            enhancedMessage += `\n\nThis may be due to large file size (${config.fileSize}). Please check your internet connection and try again.`
          }
          
          setLoadError(enhancedMessage)
          setLoadingProgress(0)
        }
      )
      
      // Handle window resize
      const handleResize = () => {
        if (!mounted.current || !canvasRef.current || !camera || !renderer) return
        
        camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight)
      }
      
      window.addEventListener('resize', handleResize)
      
    } catch (error) {
      console.error('❌ Three.js initialization failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setLoadError(`Initialization failed: ${errorMessage}`)
    }
  }

  // Color change handler with dynamic config
  const handleColorChange = useCallback(async (newColors: Colors) => {
    if (!modelRef.current || !sceneRef.current) return
    
    let config
    try {
      config = await getModelConfig(modelName)
    } catch (error) {
      console.warn('⚠️ Failed to get config for color change, using default mapping:', error)
      config = { materials: {} } // Basic fallback
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelRef.current.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Clone material to avoid affecting other instances
        const newMaterial = child.material.clone()
        
        // Apply color based on material/mesh name using dynamic mapping
        const materialName = (child.material.name || '').toLowerCase()
        const meshName = (child.name || '').toLowerCase()
        
        let targetColor = newColors.primary // default
        
        // Use material mapping from config
        for (const [materialKey, materialConfig] of Object.entries(config.materials)) {
          if (materialName.includes(materialKey.toLowerCase()) || 
              meshName.includes(materialKey.toLowerCase())) {
            targetColor = newColors[materialConfig.colorTarget]
            console.log(`🎨 Updating ${materialKey} to ${materialConfig.colorTarget}:`, targetColor)
            break
          }
        }
        
        newMaterial.color = new THREE.Color(targetColor)
        child.material = newMaterial
      }
    })
  }, [modelName])

  // Apply viewing mode (camera position preset)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const applyViewingMode = useCallback((mode: keyof typeof VIEWING_MODES, camera?: THREE.PerspectiveCamera) => {
    if (!camera || !sceneRef.current) return
    
    const viewMode = VIEWING_MODES[mode]
    
    // Update camera position
    camera.position.set(
      viewMode.camera.position.x,
      viewMode.camera.position.y,
      viewMode.camera.position.z
    )
    
    // Update camera target
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = viewMode.camera.fov
      camera.updateProjectionMatrix()
    }
    
    console.log(`📷 Applied ${String(mode)} viewing mode`)
  }, [])

  // Note: applyViewingMode available for future use (camera mode switching)

  // React to color changes
  useEffect(() => {
    if (isLoaded) {
      handleColorChange(colors)
    }
  }, [colors, isLoaded, handleColorChange])

  // Handle model change - reset and reload when modelName changes
  const currentModelName = useRef(modelName)
  if (currentModelName.current !== modelName) {
    console.log(`🔄 Model changed from ${currentModelName.current} to ${modelName}, reinitializing...`)
    currentModelName.current = modelName
    hasInitialized.current = false
    setIsLoaded(false)
    setLoadError(null)
    setLoadingStatus('Model changed, reinitializing...')
    setLoadedPath('')
    
    // Cleanup existing scene
    if (rendererRef.current) {
      try {
        rendererRef.current.dispose()
        console.log('✅ Renderer disposed for model change')
      } catch (e) {
        console.warn('⚠️ Error disposing renderer:', e)
      }
    }
    
    // Re-trigger initialization after cleanup
    if (canvasRef.current) {
      console.log('🔄 Re-triggering initialization for new model')
      setTimeout(() => {
        if (mounted.current && canvasRef.current) {
          initThreeJS()
        }
      }, 100)
    }
  }

  return (
    <div className={`relative w-full h-full min-h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden ${className}`}>
      {/* Canvas for 3D rendering */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">3D Shoe Customizer</h2>
            
            <div className="space-y-4">
              {/* Loading spinner */}
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-blue-400">{loadingStatus}</span>
                <span className="text-blue-600 text-sm">{loadedPath}</span>
              </div>
              
              {/* Progress bar for large files */}
              {loadingProgress > 0 && (
                <div className="w-64 mx-auto">
                  <div className="bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-blue-300 text-xs text-center">
                    {loadingProgress}% loaded
                  </div>
                </div>
              )}
              
              <div className="text-white/60 text-sm">
                Loading advanced 3D model (up to 30MB)...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/90 backdrop-blur-sm">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Loading Error</h2>
            <div className="text-red-300 text-sm mb-4">{loadError}</div>
            <button 
              onClick={() => {
                setLoadError(null)
                setIsLoaded(false)
                hasInitialized.current = false
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      )}
      
      {/* Color indicators */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <div 
          className="w-6 h-6 rounded-full border-2 border-white/50 shadow-lg" 
          style={{ backgroundColor: colors.primary }}
          title="Primary Color"
        />
        <div 
          className="w-6 h-6 rounded-full border-2 border-white/50 shadow-lg" 
          style={{ backgroundColor: colors.secondary }}
          title="Secondary Color"
        />
        <div 
          className="w-6 h-6 rounded-full border-2 border-white/50 shadow-lg" 
          style={{ backgroundColor: colors.accent }}
          title="Accent Color"
        />
      </div>
      
      {/* Controls info */}
      {showControls && (
        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white/70 text-xs px-3 py-2 rounded-lg border border-white/10">
          <div>🎮 OrbitControls</div>
          <div>🔄 Auto Rotate</div>
          <div>🎨 Live Colors</div>
        </div>
      )}
    </div>
  )
}
