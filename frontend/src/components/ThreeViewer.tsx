'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

interface ThreeViewerProps {
  modelPath: string
  customizations?: {
    colors?: { [key: string]: string }
    logos?: { [key: string]: string }
    materials?: { [key: string]: any }
  }
  onModelLoad?: (model: any) => void
  className?: string
}

function Model({ 
  modelPath, 
  customizations, 
  onModelLoad 
}: { 
  modelPath: string
  customizations?: any
  onModelLoad?: (model: any) => void 
}) {
  const { scene, animations } = useGLTF(modelPath)
  const modelRef = useRef<THREE.Group>(null)
  const [mixer] = useState(() => new THREE.AnimationMixer(scene))

  useEffect(() => {
    if (onModelLoad) {
      onModelLoad(scene)
    }
  }, [scene, onModelLoad])

  // Apply customizations
  useEffect(() => {
    if (customizations && scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mesh = child as THREE.Mesh
          
          // Apply color customizations
          if (customizations.colors) {
            Object.entries(customizations.colors).forEach(([partName, color]) => {
              if (mesh.name.toLowerCase().includes(partName.toLowerCase())) {
                if (mesh.material instanceof THREE.MeshStandardMaterial) {
                  mesh.material.color.setHex(color.replace('#', '0x'))
                }
              }
            })
          }

          // Apply material customizations
          if (customizations.materials) {
            Object.entries(customizations.materials).forEach(([partName, material]) => {
              if (mesh.name.toLowerCase().includes(partName.toLowerCase())) {
                if (mesh.material instanceof THREE.MeshStandardMaterial) {
                  Object.assign(mesh.material, material)
                }
              }
            })
          }
        }
      })
    }
  }, [customizations, scene])

  // Handle animations
  useEffect(() => {
    if (animations.length > 0) {
      animations.forEach((clip) => {
        const action = mixer.clipAction(clip)
        action.play()
      })
    }
  }, [animations, mixer])

  useFrame((state, delta) => {
    mixer.update(delta)
    
    // Auto-rotate model slightly
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="loading-spinner"></div>
    </div>
  )
}

export function ThreeViewer({ 
  modelPath, 
  customizations, 
  onModelLoad,
  className = ""
}: ThreeViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const controlsRef = useRef<any>(null)

  const handleModelLoad = (model: any) => {
    setIsLoading(false)
    if (onModelLoad) {
      onModelLoad(model)
    }
  }

  const handleError = (error: any) => {
    console.error('Error loading 3D model:', error)
    setError('Failed to load 3D model')
    setIsLoading(false)
  }

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  return (
    <div className={`viewer-container ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <LoadingFallback />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          <Model
            modelPath={modelPath}
            customizations={customizations}
            onModelLoad={handleModelLoad}
          />
          
          <ContactShadows
            opacity={0.4}
            scale={10}
            blur={1}
            far={10}
            resolution={256}
            color="#000000"
          />
          
          <Environment preset="city" />
          
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* Control buttons */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          onClick={resetCamera}
          className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md transition-all"
          title="Reset Camera"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}