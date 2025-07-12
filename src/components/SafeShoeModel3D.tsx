'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled to avoid server-side Three.js issues
const Vanilla3DViewer = dynamic(() => import('./Vanilla3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-blue-400">Loading 3D Engine...</div>
        <div className="text-xs text-blue-300 mt-2">Large GLB files (up to 30MB) - Please wait...</div>
      </div>
    </div>
  )
})

interface SafeShoeModel3DProps {
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  autoRotate?: boolean
  showControls?: boolean
  modelName?: string
  className?: string
}

export default function SafeShoeModel3D({ 
  colors, 
  autoRotate = true,
  showControls = true,
  modelName = 'adidas',
  className = ""
}: SafeShoeModel3DProps) {
  const [hasError] = useState(false)
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  
  console.log('🛡️ SafeShoeModel3D rendering with:', { 
    colors, 
    autoRotate, 
    showControls, 
    modelName, 
    className 
  })

  // Set timeout for loading - increased for large GLB files (up to 30MB)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true)
    }, 45000) // 45 seconds timeout for 30MB files
    
    return () => clearTimeout(timer)
  }, [modelName])
  
  if (hasError) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}>
        <div className="text-center">
          <div className="text-red-400 mb-2">3D Model Loading Failed</div>
          <div className="text-sm text-gray-400">Using Vanilla Three.js fallback</div>
          <div className="text-xs text-gray-500 mt-2">Model: {modelName}</div>
        </div>
      </div>
    )
  }
  
  if (loadingTimeout) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-900 to-orange-900 ${className}`}>
        <div className="text-center">
          <div className="text-yellow-400 mb-2">3D Model Loading Timeout</div>
          <div className="text-sm text-yellow-300">Large GLB files (up to 30MB) may take time</div>
          <div className="text-xs text-yellow-200 mt-2">Check your internet connection</div>
          
          <div className="mt-4 w-32 h-32 mx-auto bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">👟</div>
              <div className="text-xs text-gray-400">{modelName} Model</div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload()
              }
            }}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
          >
            Retry Loading
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <Vanilla3DViewer 
      colors={colors}
      autoRotate={autoRotate}
      showControls={showControls}
      modelName={modelName}
      className={className}
    />
  )
}
