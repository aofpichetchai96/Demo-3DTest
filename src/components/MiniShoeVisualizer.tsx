'use client'

import { Suspense } from 'react'
import ShoeModel3D from './ShoeModel3D'

interface MiniShoeVisualizerProps {
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  collectionName?: string // เพิ่มสำหรับการปรับ zoom เฉพาะ
  // เพิ่ม props สำหรับควบคุมการซูม (สำหรับ mini view ใช้ค่าเริ่มต้นที่เหมาะสม)
  initialZoom?: number
}

// Loading fallback for mini viewer
function MiniLoadingFallback() {
  return (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-gray-400 text-xs">Loading...</div>
    </div>
  )
}

export default function MiniShoeVisualizer({ 
  colors, 
  collectionName,
  initialZoom = 8  // Mini view ใช้ zoom ที่เหมาะสำหรับ preview
}: MiniShoeVisualizerProps) {
  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<MiniLoadingFallback />}>
        <ShoeModel3D
          colors={colors}
          autoRotate={false}
          showControls={false}
          collectionName={collectionName}
          initialZoom={initialZoom}
          minZoom={6}    // จำกัดซูมในหน้า mini
          maxZoom={15}   // จำกัดซูมในหน้า mini
        />
      </Suspense>
    </div>
  )
}
