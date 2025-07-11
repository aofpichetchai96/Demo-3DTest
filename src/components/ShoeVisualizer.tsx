'use client'

import { Suspense } from 'react'
import ShoeModel3D from './ShoeModel3D'

interface ShoeVisualizerProps {
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  size?: string
  onColorChange?: (colors: { primary: string; secondary: string; accent: string }) => void
  collectionName?: string // เพิ่มสำหรับการปรับ zoom เฉพาะ
  // เพิ่ม props สำหรับควบคุมการซูม
  initialZoom?: number    // ระยะเริ่มต้น
  minZoom?: number       // ซูมเข้าสุด
  maxZoom?: number       // ซูมออกสุด
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-gray-500 text-sm">Loading 3D Model...</div>
    </div>
  )
}

export default function ShoeVisualizer({ 
  colors, 
  size, 
  collectionName,
  initialZoom,
  minZoom,
  maxZoom
}: ShoeVisualizerProps) {
  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<LoadingFallback />}>
        <ShoeModel3D
          colors={colors}
          size={size}
          autoRotate={true}
          showControls={true}
          collectionName={collectionName}
          initialZoom={initialZoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
        />
      </Suspense>
    </div>
  )
}
