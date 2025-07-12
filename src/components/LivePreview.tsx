'use client'

import React from 'react'
import SafeShoeModel3D from './SafeShoeModel3D'

interface LivePreviewProps {
  modelName?: string
  config?: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scale: { x: number; y: number; z: number }
    camera: {
      position: { x: number; y: number; z: number }
      target: { x: number; y: number; z: number }
      fov: number
      near: number
      far: number
    }
    controls: {
      minDistance: number
      maxDistance: number
      autoRotateSpeed: number
    }
  } | null
}

export default function LivePreview({ modelName, config }: LivePreviewProps) {
  if (!modelName || !config) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-[500px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-4">👟</div>
          <p>Select a model to see live preview</p>
        </div>
      </div>
    )
  }

  // Default colors for preview
  const previewColors = {
    primary: '#3b82f6',
    secondary: '#1e40af', 
    accent: '#60a5fa'
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">{modelName}</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* 3D Model Preview */}
      <div className="h-[300px] rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        <SafeShoeModel3D
          modelName={modelName}
          colors={previewColors}
          autoRotate={config.controls.autoRotateSpeed > 0}
          showControls={true}
          className="w-full h-full"
        />
      </div>

      {/* Configuration Values */}
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-muted/50 rounded p-2">
            <div className="font-medium text-muted-foreground mb-1">Position</div>
            <div className="font-mono space-y-0.5">
              <div>X: {config.position.x.toFixed(1)}</div>
              <div>Y: {config.position.y.toFixed(1)}</div>
              <div>Z: {config.position.z.toFixed(1)}</div>
            </div>
          </div>

          <div className="bg-muted/50 rounded p-2">
            <div className="font-medium text-muted-foreground mb-1">Scale</div>
            <div className="font-mono space-y-0.5">
              <div>X: {config.scale.x.toFixed(1)}</div>
              <div>Y: {config.scale.y.toFixed(1)}</div>
              <div>Z: {config.scale.z.toFixed(1)}</div>
            </div>
          </div>

          <div className="bg-muted/50 rounded p-2">
            <div className="font-medium text-muted-foreground mb-1">Camera</div>
            <div className="font-mono space-y-0.5">
              <div>FOV: {config.camera.fov}°</div>
              <div>Near: {config.camera.near}</div>
              <div>Far: {config.camera.far}</div>
            </div>
          </div>

          <div className="bg-muted/50 rounded p-2">
            <div className="font-medium text-muted-foreground mb-1">Controls</div>
            <div className="font-mono space-y-0.5">
              <div>Min: {config.controls.minDistance}</div>
              <div>Max: {config.controls.maxDistance}</div>
              <div>Auto: {config.controls.autoRotateSpeed}</div>
            </div>
          </div>
        </div>

        {/* Live Status */}
        <div className="flex items-center justify-center space-x-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded p-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live 3D model preview</span>
        </div>
      </div>
    </div>
  )
}
