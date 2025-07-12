'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getModelDisplayInfo } from '@/lib/modelConfigs'
import { ThemeToggleDetailed } from '@/components/theme-toggle'
import type { ModelConfig } from '@/lib/modelConfigs'

interface ModelDisplayInfo {
  id: string
  name: string
  size: string
  description: string
  tags: string[]
  timeout: number
}

export default function ModelConfigsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [configs, setConfigs] = useState<ModelConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [modelInfo, setModelInfo] = useState<ModelDisplayInfo | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      loadConfigs()
    }
  }, [session])

  const loadConfigs = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Loading model configs from API...')
      
      const response = await fetch('/api/model-configs/test')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Error: ${errorData.error || response.statusText}`)
      }
      
      const result = await response.json()
      console.log('📋 API Response:', result)
      
      if (result.success && result.data) {
        setConfigs(result.data)
        console.log(`✅ Loaded ${result.data.length} configurations successfully`)
      } else {
        throw new Error(result.error || 'Unknown API error')
      }
      
      if (result.data.length === 0) {
        console.log('⚠️ No model configurations found - may need to seed database')
      }
    } catch (err) {
      console.error('❌ Error loading configs:', err)
      setError(`Failed to load model configurations: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setConfigs([])
    } finally {
      setLoading(false)
    }
  }

  const loadModelInfo = async (modelName: string) => {
    try {
      const info = await getModelDisplayInfo(modelName)
      setModelInfo(info)
      setSelectedModel(modelName)
      console.log('📋 Model info:', info)
    } catch (err) {
      console.error('❌ Error loading model info:', err)
      setError('Failed to load model information')
    }
  }

  const seedDatabase = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/seed-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Database seeded successfully:', result)
        // Reload configs after seeding
        await loadConfigs()
        alert(`Successfully seeded ${result.models.length} model configurations!`)
      } else {
        throw new Error(result.details || result.error)
      }
    } catch (err) {
      console.error('❌ Error seeding database:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to seed database: ${errorMessage}`)
      alert(`Seeding failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Model Configurations</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
            <span className="ml-4 text-xl">กำลังโหลดการตั้งค่า...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Model Configurations</h1>
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Error</h2>
            <p className="text-destructive-foreground">{error}</p>
            <button 
              onClick={loadConfigs}
              className="mt-4 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Model Configurations</h1>
            <ThemeToggleDetailed />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Loaded from database - {configs.length} models available</p>
            <button
              onClick={seedDatabase}
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-lg transition-colors"
            >
              {loading ? 'Seeding...' : 'Seed Database'}
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Model List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Available Models</h2>
            
            {configs.length === 0 ? (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-2">No Models Found</h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                  No model configurations found in the database. 
                  Try seeding the database with sample data.
                </p>
                <button
                  onClick={seedDatabase}
                  disabled={loading}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? 'Seeding...' : 'Seed Sample Data'}
                </button>
              </div>
            ) : (
              configs.map((config) => (
                <div
                  key={config.id}
                  className={`bg-card border border-border rounded-lg p-6 cursor-pointer transition-all hover:bg-accent ${
                    selectedModel === config.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => loadModelInfo(config.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-primary">{config.displayName}</h3>
                    <span className="text-sm text-muted-foreground">{config.fileSize}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                    <div>
                      <span className="text-muted-foreground">Model ID:</span> {config.id}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Scale:</span> {config.scale.x}x
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{config.description}</p>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-muted rounded p-2">
                      <div className="text-muted-foreground">Position</div>
                      <div>x: {config.position.x}</div>
                      <div>y: {config.position.y}</div>
                      <div>z: {config.position.z}</div>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <div className="text-muted-foreground">Camera FOV</div>
                      <div className="text-primary">{config.camera.fov}°</div>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <div className="text-muted-foreground">Materials</div>
                      <div className="text-green-600 dark:text-green-400">{Object.keys(config.materials).length} types</div>
                    </div>
                  </div>

                  {config.tags && config.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {config.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/20 text-primary text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Detailed View */}
          <div className="bg-card border border-border rounded-lg p-6">
            {selectedModel && modelInfo ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Configuration Details</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-primary mb-2">Basic Info</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-muted-foreground">Name:</span> {modelInfo.name}</div>
                        <div><span className="text-muted-foreground">Size:</span> {modelInfo.size}</div>
                        <div><span className="text-muted-foreground">Timeout:</span> {modelInfo.timeout}s</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {modelInfo.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Description</h3>
                    <p className="text-muted-foreground text-sm">{modelInfo.description}</p>
                  </div>

                  {selectedModel && (
                    <div>
                      <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Configuration Data</h3>
                      <div className="bg-muted border border-border rounded p-4 text-xs overflow-auto max-h-64">
                        <pre className="text-green-700 dark:text-green-300">
                          {JSON.stringify(configs.find(c => c.id === selectedModel), null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <h2 className="text-xl font-semibold mb-2">Select a Model</h2>
                <p>Click on a model from the list to view its detailed configuration</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-primary/10 border border-primary/30 rounded-lg p-4">
          <h3 className="font-semibold text-primary mb-2">💡 Database Integration Status</h3>
          <p className="text-sm text-muted-foreground">
            This page displays model configurations loaded dynamically from the database. 
            Data includes position, rotation, scale, camera settings, lighting, and material mappings.
          </p>
        </div>
      </div>
    </div>
  )
}
