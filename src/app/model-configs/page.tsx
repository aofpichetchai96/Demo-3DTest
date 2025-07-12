'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ThemeToggleDetailed } from '@/components/theme-toggle'

interface ModelConfig {
  id: string
  modelName: string
  displayName: string
  fileSize: string
  description: string
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
    enableDamping: boolean
    dampingFactor: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface EditingConfig {
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
}

export default function ModelConfigsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [configs, setConfigs] = useState<ModelConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [editingConfig, setEditingConfig] = useState<EditingConfig | null>(null)
  const [saving, setSaving] = useState(false)

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.role !== 'admin') {
      router.push("/")
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      loadConfigs()
    }
  }, [session])

  const loadConfigs = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Loading model configs from API...')
      
      const response = await fetch('/api/model-configs')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Error: ${errorData.error || response.statusText}`)
      }
      
      const result = await response.json()
      console.log('📋 API Response:', result)
      
      // API returns array directly, not wrapped in success/data
      if (Array.isArray(result)) {
        setConfigs(result)
        console.log(`✅ Loaded ${result.length} configurations successfully`)
      } else {
        throw new Error('API returned unexpected format')
      }
    } catch (err) {
      console.error('❌ Error loading configs:', err)
      setError(`Failed to load model configurations: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setConfigs([])
    } finally {
      setLoading(false)
    }
  }

  const selectModelForEdit = (config: ModelConfig) => {
    setSelectedModel(config.modelName)
    setEditingConfig({
      position: { ...config.position },
      rotation: { ...config.rotation },
      scale: { ...config.scale },
      camera: {
        position: { ...config.camera.position },
        target: { ...config.camera.target },
        fov: config.camera.fov,
        near: config.camera.near,
        far: config.camera.far
      },
      controls: {
        minDistance: config.controls.minDistance,
        maxDistance: config.controls.maxDistance,
        autoRotateSpeed: config.controls.autoRotateSpeed
      }
    })
  }

  const updateConfigValue = (path: string, value: number) => {
    if (!editingConfig) return
    
    const newConfig = { ...editingConfig }
    
    // Use a switch-case approach for type safety
    switch (path) {
      case 'position.x':
        newConfig.position.x = value
        break
      case 'position.y':
        newConfig.position.y = value
        break
      case 'position.z':
        newConfig.position.z = value
        break
      case 'rotation.x':
        newConfig.rotation.x = value
        break
      case 'rotation.y':
        newConfig.rotation.y = value
        break
      case 'rotation.z':
        newConfig.rotation.z = value
        break
      case 'scale.x':
        newConfig.scale.x = value
        break
      case 'scale.y':
        newConfig.scale.y = value
        break
      case 'scale.z':
        newConfig.scale.z = value
        break
      case 'camera.position.x':
        newConfig.camera.position.x = value
        break
      case 'camera.position.y':
        newConfig.camera.position.y = value
        break
      case 'camera.position.z':
        newConfig.camera.position.z = value
        break
      case 'camera.target.x':
        newConfig.camera.target.x = value
        break
      case 'camera.target.y':
        newConfig.camera.target.y = value
        break
      case 'camera.target.z':
        newConfig.camera.target.z = value
        break
      case 'camera.fov':
        newConfig.camera.fov = value
        break
      case 'camera.near':
        newConfig.camera.near = value
        break
      case 'camera.far':
        newConfig.camera.far = value
        break
      case 'controls.minDistance':
        newConfig.controls.minDistance = value
        break
      case 'controls.maxDistance':
        newConfig.controls.maxDistance = value
        break
      case 'controls.autoRotateSpeed':
        newConfig.controls.autoRotateSpeed = value
        break
    }
    
    setEditingConfig(newConfig)
  }

  const saveConfig = async () => {
    if (!selectedModel || !editingConfig) return
    
    try {
      setSaving(true)
      setError(null)
      
      const response = await fetch(`/api/model-configs?name=${selectedModel}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingConfig)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save configuration')
      }
      
      const updatedConfig = await response.json()
      console.log('✅ Configuration saved:', updatedConfig)
      
      // Update the local state
      setConfigs(prev => prev.map(config => 
        config.modelName === selectedModel 
          ? { ...config, ...updatedConfig, updatedAt: new Date().toISOString() }
          : config
      ))
      
      alert('Configuration saved successfully!')
      
    } catch (err) {
      console.error('❌ Error saving config:', err)
      setError(`Failed to save configuration: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
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
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Error: ${errorData.error || response.statusText}`)
      }
      
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

  if (!session || session.user.role !== 'admin') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Model Configuration Admin</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
            <span className="ml-4 text-xl">กำลังโหลดการตั้งค่า...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold">Model Configuration Admin</h1>
              <p className="text-muted-foreground">Admin-only access to edit model position, camera, and zoom defaults</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={seedDatabase}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {loading ? 'Seeding...' : 'Seed Models'}
              </button>
              <ThemeToggleDetailed />
            </div>
          </div>
          
          {error && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4">
              <p className="text-destructive">{error}</p>
            </div>
          )}
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Model List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Models ({configs.length})</h2>
            
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
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? 'Seeding...' : 'Seed Sample Data'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    className={`bg-card border border-border rounded-lg p-4 cursor-pointer transition-all hover:bg-accent ${
                      selectedModel === config.modelName ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => selectModelForEdit(config)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-primary">{config.displayName}</h3>
                      <span className="text-xs text-muted-foreground">{config.fileSize}</span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      Model: {config.modelName}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-muted rounded p-1 text-center">
                        <div className="text-muted-foreground">Scale</div>
                        <div>{config.scale.x}x</div>
                      </div>
                      <div className="bg-muted rounded p-1 text-center">
                        <div className="text-muted-foreground">FOV</div>
                        <div>{config.camera.fov}°</div>
                      </div>
                      <div className="bg-muted rounded p-1 text-center">
                        <div className="text-muted-foreground">Distance</div>
                        <div>{config.controls.minDistance}-{config.controls.maxDistance}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Configuration Editor */}
          <div className="lg:col-span-2">
            {selectedModel && editingConfig ? (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Edit Configuration: {selectedModel}</h2>
                  <button
                    onClick={saveConfig}
                    disabled={saving}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-lg transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Position & Transform */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Position & Transform</h3>
                    
                    {/* Position */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Position</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['x', 'y', 'z'].map((axis) => (
                          <div key={axis}>
                            <label className="text-xs text-muted-foreground">X: {axis.toUpperCase()}</label>
                            <input
                              type="number"
                              step="0.1"
                              value={editingConfig.position[axis as keyof typeof editingConfig.position]}
                              onChange={(e) => updateConfigValue(`position.${axis}`, parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rotation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Rotation (radians)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['x', 'y', 'z'].map((axis) => (
                          <div key={axis}>
                            <label className="text-xs text-muted-foreground">R: {axis.toUpperCase()}</label>
                            <input
                              type="number"
                              step="0.1"
                              value={editingConfig.rotation[axis as keyof typeof editingConfig.rotation]}
                              onChange={(e) => updateConfigValue(`rotation.${axis}`, parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scale */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Scale</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['x', 'y', 'z'].map((axis) => (
                          <div key={axis}>
                            <label className="text-xs text-muted-foreground">S: {axis.toUpperCase()}</label>
                            <input
                              type="number"
                              step="0.1"
                              value={editingConfig.scale[axis as keyof typeof editingConfig.scale]}
                              onChange={(e) => updateConfigValue(`scale.${axis}`, parseFloat(e.target.value) || 1)}
                              className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Camera & Controls */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Camera & Controls</h3>
                    
                    {/* Camera Position */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Camera Position</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['x', 'y', 'z'].map((axis) => (
                          <div key={axis}>
                            <label className="text-xs text-muted-foreground">Cam: {axis.toUpperCase()}</label>
                            <input
                              type="number"
                              step="0.1"
                              value={editingConfig.camera.position[axis as keyof typeof editingConfig.camera.position]}
                              onChange={(e) => updateConfigValue(`camera.position.${axis}`, parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Camera Target */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Camera Target</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['x', 'y', 'z'].map((axis) => (
                          <div key={axis}>
                            <label className="text-xs text-muted-foreground">Target: {axis.toUpperCase()}</label>
                            <input
                              type="number"
                              step="0.1"
                              value={editingConfig.camera.target[axis as keyof typeof editingConfig.camera.target]}
                              onChange={(e) => updateConfigValue(`camera.target.${axis}`, parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Camera Settings */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Camera Settings</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">FOV</label>
                          <input
                            type="number"
                            step="1"
                            min="10"
                            max="120"
                            value={editingConfig.camera.fov}
                            onChange={(e) => updateConfigValue('camera.fov', parseFloat(e.target.value) || 75)}
                            className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Near</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={editingConfig.camera.near}
                            onChange={(e) => updateConfigValue('camera.near', parseFloat(e.target.value) || 0.1)}
                            className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Far</label>
                          <input
                            type="number"
                            step="10"
                            min="10"
                            value={editingConfig.camera.far}
                            onChange={(e) => updateConfigValue('camera.far', parseFloat(e.target.value) || 1000)}
                            className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Zoom Controls</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Min Distance</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={editingConfig.controls.minDistance}
                            onChange={(e) => updateConfigValue('controls.minDistance', parseFloat(e.target.value) || 1)}
                            className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Max Distance</label>
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            value={editingConfig.controls.maxDistance}
                            onChange={(e) => updateConfigValue('controls.maxDistance', parseFloat(e.target.value) || 10)}
                            className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Auto Rotate Speed</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="2"
                            value={editingConfig.controls.autoRotateSpeed}
                            onChange={(e) => updateConfigValue('controls.autoRotateSpeed', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-1 bg-background border border-border rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Values */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Values Preview</h4>
                  <div className="text-xs font-mono text-muted-foreground overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(editingConfig, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <h2 className="text-xl font-semibold mb-2 text-muted-foreground">Select a Model to Edit</h2>
                <p className="text-muted-foreground">Choose a model from the list to edit its position, camera, and zoom default settings</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">⚠️ Admin Only Access</h3>
          <p className="text-sm text-muted-foreground">
            This page is restricted to administrators only. Changes made here will affect how 3D models are displayed for all users.
            All configuration changes are saved to the database and take effect immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
