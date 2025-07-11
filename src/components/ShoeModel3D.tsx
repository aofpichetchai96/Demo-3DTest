'use client'

import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import * as THREE from 'three'

interface ShoeModel3DProps {
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  size?: string
  autoRotate?: boolean
  showControls?: boolean
  collectionName?: string // เพิ่มสำหรับการกำหนด zoom เฉพาะ collection
  // เพิ่ม props สำหรับควบคุมการซูม
  initialZoom?: number    // ระยะเริ่มต้น (default: auto)
  minZoom?: number       // ซูมเข้าสุด (default: auto)
  maxZoom?: number       // ซูมออกสุด (default: auto)
}

// OBJ Model Loader with error handling
function OBJShoeModel({ 
  objPath, 
  mtlPath,
  colors, 
  autoRotate = false,
  modelName = 'nike'
}: { 
  objPath: string
  mtlPath?: string
  colors: { primary: string; secondary: string; accent: string }
  autoRotate?: boolean
  modelName?: string
}) {
  const groupRef = useRef<THREE.Group>(null!)
  
  // Always try to load MTL, fallback to empty object if fails
  const materials = useLoader(MTLLoader, mtlPath || '/models/nike/nike.mtl', undefined, (error) => {
    console.warn(`Could not load MTL file: ${mtlPath}`, error)
    return null
  })
  
  const obj = useLoader(OBJLoader, objPath, (loader) => {
    if (materials) {
      try {
        materials.preload()
        loader.setMaterials(materials)
      } catch (error) {
        console.warn('Could not set materials:', error)
      }
    }
  })

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  useEffect(() => {
    if (obj) {
      // Model configuration - ปรับตำแหน่งให้เหมาะสำหรับการดู
      obj.scale.set(0.1, 0.1, 0.1)
      obj.position.set(0, -0.2, 0)      // ยกขึ้นเล็กน้อยจากเดิม (-0.5)
      obj.rotation.set(0, Math.PI, 0)   // หมุนให้หน้าโมเดลมองเห็น
      
      // Debug: Log material names
      console.log(`=== ${modelName.toUpperCase()} Model Materials ===`)
      
      // Apply custom colors to override materials
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            // Clone material to avoid affecting other instances
            const material = Array.isArray(child.material) 
              ? child.material.map(mat => mat.clone())
              : child.material.clone()
            
            if (Array.isArray(material)) {
              material.forEach((mat, index) => {
                // Debug log
                console.log(`Material ${index}: "${mat.name}", Mesh: "${child.name}"`)
                
                // Apply colors based on Nike model logic
                applyColorToMaterial(mat, child.name, colors)
              })
            } else {
              // Single material
              console.log(`Single Material: "${material.name}", Mesh: "${child.name}"`)
              
              // Apply colors based on Nike model logic
              applyColorToMaterial(material, child.name, colors)
            }
            
            child.material = material
            
            // Force geometry update
            if (child.geometry) {
              child.geometry.computeVertexNormals()
            }
          }
        }
      })
      
      console.log('=== End Materials ===')
      
      // Force a re-render
      obj.userData.needsUpdate = true
    }
  }, [obj, colors, modelName])

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
    </group>
  )
}

// Color application logic for Nike model only
function applyColorToMaterial(
  material: THREE.Material, 
  meshName: string, 
  colors: { primary: string; secondary: string; accent: string }
) {
  // Force material to accept color changes
  if ('transparent' in material) material.transparent = false
  if ('opacity' in material) material.opacity = 1
  
  const materialName = (material.name || '').toLowerCase()
  const meshNameLower = (meshName || '').toLowerCase()
  
  let appliedColor = colors.primary // default
  
  // Nike Model color mapping only
  // Nike-specific color mapping
  if (materialName.includes('sole') || materialName.includes('bottom') || 
      materialName.includes('rubber') || meshNameLower.includes('sole') || 
      materialName.includes('physical11') || materialName.includes('physical12')) {
    appliedColor = colors.secondary
  } else if (materialName.includes('accent') || materialName.includes('detail') || 
            materialName.includes('logo') || materialName.includes('lace') ||
            meshNameLower.includes('accent') || materialName.includes('706a6a')) {
    appliedColor = colors.accent
  }
  
  // Apply the color
  if ('color' in material && material instanceof THREE.MeshStandardMaterial) {
    material.color = new THREE.Color(appliedColor)
    console.log(`  -> ${appliedColor === colors.primary ? 'Primary' : 
                      appliedColor === colors.secondary ? 'Secondary' : 'Accent'} color applied: ${appliedColor}`)
  } else if ('color' in material && material instanceof THREE.MeshBasicMaterial) {
    material.color = new THREE.Color(appliedColor)
    console.log(`  -> ${appliedColor === colors.primary ? 'Primary' : 
                      appliedColor === colors.secondary ? 'Secondary' : 'Accent'} color applied: ${appliedColor}`)
  } else if ('color' in material) {
    // Fallback for other material types that have color property
    (material as THREE.Material & { color: THREE.Color }).color = new THREE.Color(appliedColor)
    console.log(`  -> ${appliedColor === colors.primary ? 'Primary' : 
                      appliedColor === colors.secondary ? 'Secondary' : 'Accent'} color applied: ${appliedColor}`)
  }
  
  // Ensure material updates
  if ('needsUpdate' in material) material.needsUpdate = true
}

// Error Boundary for 3D Model Loading
function ModelErrorBoundary({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) {
  try {
    return <>{children}</>
  } catch (error) {
    console.error('3D Model loading error:', error)
    return <>{fallback}</>
  }
}

// Main 3D Shoe Model Component (Nike only - OBJ + MTL)
function ShoeModel({ colors, autoRotate = false }: {
  colors: { primary: string; secondary: string; accent: string }
  autoRotate?: boolean
}) {
  // Nike model path only
  const modelConfig = {
    type: 'obj',
    objPath: '/models/nike/nike.obj',
    mtlPath: '/models/nike/nike.mtl'
  }

  return (
    <OBJShoeModel
      objPath={modelConfig.objPath}
      mtlPath={modelConfig.mtlPath}
      colors={colors}
      autoRotate={autoRotate}
      modelName="nike"
    />
  )
}

// Loading fallback
function LoadingModel() {
  return (
    <mesh>
      <boxGeometry args={[1.2, 0.4, 1.8]} />
      <meshStandardMaterial color="#e5e7eb" wireframe />
    </mesh>
  )
}

// Function to get zoom settings based on collection name and props
function getZoomSettings(
  collectionName?: string,
  customSettings?: {
    initialZoom?: number
    minZoom?: number
    maxZoom?: number
  }
) {
  // Base settings for each collection
  let baseSettings = {
    minDistance: 3,        // ซูมเข้าสุด (ใกล้พอดู detail)
    maxDistance: 40,       // ซูมออกสุด (ไกลพอเห็นทั้งหมด)
    zoomSpeed: 1.5,        // ความเร็วซูมปกติ
    panSpeed: 1,           // ความเร็วเลื่อนปกติ
    rotateSpeed: 1,        // ความเร็วหมุนปกติ
    initialDistance: 25    // ระยะเริ่มต้น (กำหนดเอง)
  }

  // Override with collection-specific settings
  if (collectionName === 'Sunset Orange') {
    baseSettings = {
      // ...baseSettings,
      minDistance: 3,      // ซูมเข้าสุด (ใกล้พอดู detail)
      maxDistance: 20,     // ซูมออกสุด (ไกลพอเห็นทั้งหมด)
      zoomSpeed: 2.0,      // ซูมเร็วขึ้น
      panSpeed: 1.5,       // เลื่อนเร็วขึ้น
      rotateSpeed: 1.2,    // หมุนเร็วขึ้น
      initialDistance: 20  // ระยะเริ่มต้น (กำหนดเอง)
    }
  }

  // Override with custom props if provided
  if (customSettings) {
    if (customSettings.minZoom !== undefined) {
      baseSettings.minDistance = customSettings.minZoom
    }
    if (customSettings.maxZoom !== undefined) {
      baseSettings.maxDistance = customSettings.maxZoom
    }
    if (customSettings.initialZoom !== undefined) {
      baseSettings.initialDistance = customSettings.initialZoom
    }
  }

  return baseSettings
}

export default function ShoeModel3D({ 
  colors, 
  size, 
  autoRotate = true,
  showControls = true,
  collectionName,
  initialZoom,
  minZoom,
  maxZoom
}: ShoeModel3DProps) {
  const zoomSettings = getZoomSettings(collectionName, {
    initialZoom,
    minZoom,
    maxZoom
  })
  
  // Calculate initial camera position based on initial distance
  const initialCameraPosition: [number, number, number] = [
    zoomSettings.initialDistance * 0.6,  // x: เอียงข้าง
    zoomSettings.initialDistance * 0.4,  // y: สูงขึ้นเล็กน้อย
    zoomSettings.initialDistance * 0.8   // z: ระยะห่างหลัก
  ]
  
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ 
          position: initialCameraPosition, 
          fov: 50,  // เพิ่ม field of view เพื่อเห็นโมเดลทั้งหมด
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.5}
        />
        
        {/* Environment for reflections */}
        <Environment preset="studio" />
        
        {/* 3D Shoe Model */}
        <Suspense fallback={<LoadingModel />}>
          <ModelErrorBoundary fallback={<LoadingModel />}>
            <ShoeModel 
              colors={colors}
              autoRotate={autoRotate}
            />
          </ModelErrorBoundary>
        </Suspense>
        
        {/* Camera Controls */}
        {showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            minDistance={zoomSettings.minDistance}
            maxDistance={zoomSettings.maxDistance}
            minPolarAngle={0}               // อนุญาตให้หมุนได้ทุกมุม
            maxPolarAngle={Math.PI}         // อนุญาตให้หมุนได้ทุกมุม
            minAzimuthAngle={-Infinity}     // หมุนซ้าย-ขวาได้ไม่จำกัด
            maxAzimuthAngle={Infinity}      // หมุนซ้าย-ขวาได้ไม่จำกัด
            enableDamping={true}
            dampingFactor={0.05}
            zoomSpeed={zoomSettings.zoomSpeed}
            panSpeed={zoomSettings.panSpeed}
            rotateSpeed={zoomSettings.rotateSpeed}
            target={[0, 0, 0]}              // จุดที่ camera มองไป (ตรงกลางโมเดล)
            screenSpacePanning={false}      // Pan ในพื้นที่ world space
          />
        )}
      </Canvas>
      
      {/* Info overlay */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        Nike {size && `- Size ${size}`}
      </div>
      
      {/* Loading overlay */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white bg-opacity-75 px-2 py-1 rounded">
        3D Model
      </div>
    </div>
  )
}
