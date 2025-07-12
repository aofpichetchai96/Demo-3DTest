'use client'

import { useState } from 'react'
import Vanilla3DViewer from '@/components/Vanilla3DViewer'

const colorPresets = [
  {
    name: "Black",
    colors: { primary: "#000000", secondary: "#FFFFFF", accent: "#FF0000" }
  },
  {
    name: "Blue", 
    colors: { primary: "#0000FF", secondary: "#FFFFFF", accent: "#FFD700" }
  },
  {
    name: "Red",
    colors: { primary: "#FF0000", secondary: "#000000", accent: "#FFFFFF" }
  }
]

export default function TestColorPage() {
  const [selectedPreset, setSelectedPreset] = useState(0)

  console.log('🧪 Test page render:', selectedPreset, colorPresets[selectedPreset])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Color Changes</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Selection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Color Presets</h2>
            <div className="space-y-3">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log('🎨 Clicked preset:', index, preset)
                    setSelectedPreset(index)
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedPreset === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{preset.name}</span>
                    <div className="flex space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset.colors.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset.colors.accent }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3D Viewer */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">3D Model</h2>
            <div className="h-[400px]">
              <Vanilla3DViewer
                colors={colorPresets[selectedPreset].colors}
                autoRotate={true}
                showControls={true}
                modelName="scanned_adidas_sports_shoe"
              />
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <pre className="text-sm">
            {JSON.stringify({
              selectedPreset,
              colors: colorPresets[selectedPreset].colors
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
