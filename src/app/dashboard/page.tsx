"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, LogOut, User, Palette, Crown } from "lucide-react"
import SafeShoeModel3D from "@/components/SafeShoeModel3D"
import { getSavedDesigns, initializeMockData, type SavedDesign } from "@/lib/collections"
// import { collectionsApi } from '@/lib/api'

// Recent designs from localStorage
const mockRecentDesigns: SavedDesign[] = []

// Color presets for dashboard showcase
const colorPresets = [
  {
    name: "Classic Black",
    colors: { primary: "#000000", secondary: "#FFFFFF", accent: "#FF0000" }
  },
  {
    name: "Royal Blue", 
    colors: { primary: "#4169E1", secondary: "#FFFFFF", accent: "#FFD700" }
  },
  {
    name: "Forest Green",
    colors: { primary: "#228B22", secondary: "#000000", accent: "#FFFFFF" }
  },
  {
    name: "Sunset Orange",
    colors: { primary: "#FF8C00", secondary: "#8B4513", accent: "#FFFFFF" }
  },
  {
    name: "Purple Dream",
    colors: { primary: "#9370DB", secondary: "#E6E6FA", accent: "#FFD700" }
  },
  {
    name: "Fire Red",
    colors: { primary: "#DC143C", secondary: "#000000", accent: "#FFFFFF" }
  }
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentDesigns, setRecentDesigns] = useState<SavedDesign[]>(mockRecentDesigns)
  const [selectedPreset, setSelectedPreset] = useState(0) // For color preset showcase
  const [selectedModel, setSelectedModel] = useState<'adidas' | 'vans'>('adidas') // For model selection
  
  // Debug logging
  console.log('🏠 Dashboard render:', {
    selectedModel,
    selectedPreset,
    currentColors: colorPresets[selectedPreset]?.colors,
    sessionStatus: status
  })
  // const [stats, setStats] = useState({
  //   totalCollections: 0,
  //   publicCollections: 0,
  //   totalViews: 0,
  //   totalLikes: 0
  // })
  // const [loading, setLoading] = useState(true)

  const isAdmin = session?.user?.role === 'admin'

  // Load recent designs from database or localStorage
  useEffect(() => {
    async function loadRecentDesigns() {
      if (typeof window !== 'undefined') {
        try {
          await initializeMockData()
          const savedDesigns = await getSavedDesigns()
          const userDesigns = savedDesigns.filter(design => 
            !design.userId || design.userId === session?.user?.name
          )
          // Get 3 most recent designs
          const recent = userDesigns
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 3)
          setRecentDesigns(recent)
        } catch (error) {
          console.error('Error loading recent designs:', error)
          setRecentDesigns([])
        }
      }
    }
    
    loadRecentDesigns()
  }, [session?.user?.name])

  // Auto-rotate color presets for showcase - DISABLED to prevent constant 3D reloading
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSelectedPreset(prev => (prev + 1) % colorPresets.length)
  //   }, 3000) // Change every 3 seconds
  //   
  //   return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const handleEditDesign = (id: string) => {
    router.push(`/customizer?edit=${id}`)
  }

  const handleStartCustomizing = () => {
    router.push("/customizer")
  }

  const loadStats = async () => {
    try {
      // const collections = await collectionsApi.getAll()
      // const stats = {
      //   totalCollections: collections.length,
      //   publicCollections: collections.filter(c => c.isPublic).length,
      //   totalViews: collections.reduce((sum, c) => sum + (c.views || 0), 0),
      //   totalLikes: collections.reduce((sum, c) => sum + (c.likes || 0), 0)
      // }
      // setStats(stats) - temporarily disabled
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      // setLoading(false) - temporarily disabled
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">OEM Model Dashboard</h1>
            </div>
            {/* <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <User size={20} />
                <span>{session.user?.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>ออกจากระบบ</span>
              </button>
            </div> */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with 3D Model */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">ยินดีต้อนรับ, {session.user?.name}!</h2>
              <p className="text-blue-100 mb-4">
                ออกแบบรองเท้านันยาง {selectedModel === 'adidas' ? 'Adidas Sports' : 'Vans Classic'} ในแบบที่คุณต้องการ
              </p>
              <p className="text-blue-200 mb-6">เลือกสี ปรับแต่ง และสร้างสรรค์รองเท้าที่เป็นเอกลักษณ์ของคุณ</p>
              
              {/* Model Selection */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-blue-100">เลือกรุ่นรองเท้า:</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedModel('adidas')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedModel === 'adidas'
                        ? 'bg-white/20 border border-white/40 scale-105 shadow-lg'
                        : 'bg-white/10 hover:bg-white/15 hover:scale-102'
                    }`}
                  >
                    <span className="text-sm">🏃‍♂️ Adidas Sports</span>
                  </button>
                  <button
                    onClick={() => setSelectedModel('vans')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedModel === 'vans'
                        ? 'bg-white/20 border border-white/40 scale-105 shadow-lg'
                        : 'bg-white/10 hover:bg-white/15 hover:scale-102'
                    }`}
                  >
                    <span className="text-sm">🛹 Vans Classic</span>
                  </button>
                </div>
              </div>
              
              {/* Color presets preview - Manual selection */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-blue-100">ชุดสีที่แนะนำ (คลิกเพื่อเปลี่ยน):</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {colorPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPreset(index)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                        selectedPreset === index 
                          ? 'bg-white/20 border border-white/40 scale-105 shadow-lg' 
                          : 'bg-white/10 hover:bg-white/15 hover:scale-102'
                      }`}
                    >
                      <div className="flex space-x-1 mb-1">
                        <div
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: preset.colors.secondary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: preset.colors.accent }}
                        />
                      </div>
                      <span className="text-xs text-center">{preset.name}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-blue-200">💡 คลิกชุดสีข้างต้นเพื่อดูการเปลี่ยนแปลงแบบ Real-time</p>
              </div>
              
              <button
                onClick={handleStartCustomizing}
                className="inline-flex items-center space-x-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-all hover:scale-105"
              >
                <Palette size={20} />
                <span>เริ่มปรับแต่งสี</span>
              </button>
            </div>
            
            {/* ขยายโมเดล 3D ให้ใหญ่ขึ้น */}
            <div className="relative">
              <div className="h-96 lg:h-[500px] bg-white/10 rounded-xl overflow-hidden backdrop-blur-sm border border-white/20 shadow-2xl">
                {/* Debug info */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
                  Model: {selectedModel} | Preset: {selectedPreset}
                </div>
                
                {/* Force re-render only when model changes, not preset */}
                <SafeShoeModel3D
                  key={`dashboard-hero-${selectedModel}`}
                  colors={colorPresets[selectedPreset].colors}
                  autoRotate={true}
                  showControls={false}
                  modelName={selectedModel}
                />
                
                {/* Color preset indicator ที่สวยงามขึ้น */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div
                        className="w-3 h-3 rounded-full border border-white/50"
                        style={{ backgroundColor: colorPresets[selectedPreset].colors.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-white/50"
                        style={{ backgroundColor: colorPresets[selectedPreset].colors.secondary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-white/50"
                        style={{ backgroundColor: colorPresets[selectedPreset].colors.accent }}
                      />
                    </div>
                    <span>{colorPresets[selectedPreset].name}</span>
                  </div>
                </div>
                
                {/* Model info */}
                <div className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span>
                      {selectedModel === 'adidas' ? 'Nanyang Adidas' : 'Nanyang Vans'}
                    </span>
                  </span>
                </div>
                
                {/* Loading indicator */}
                <div className="absolute bottom-4 right-4 text-xs text-white/70 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                  GLB Model
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Designs */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">การออกแบบล่าสุด</h3>
                <Link
                  href="/collections"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ดูทั้งหมด →
                </Link>
              </div>
              
              {recentDesigns.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Palette className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-xl">ยังไม่มีการออกแบบ</p>
                    <p className="text-sm">เริ่มต้นสร้างการออกแบบแรกของคุณ</p>
                  </div>
                  <button
                    onClick={handleStartCustomizing}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    เริ่มออกแบบ
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {recentDesigns.map((design) => (
                    <div
                      key={design.id}
                      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors group"
                    >
                      <div className="aspect-square bg-gray-700 rounded-lg mb-3">
                        <SafeShoeModel3D
                          key={`dashboard-recent-${design.id}-${selectedModel}`}
                          colors={design.colors}
                          autoRotate={true}
                          showControls={false}
                          modelName={selectedModel}
                        />
                      </div>
                      
                      <h4 className="font-semibold text-white mb-1">{design.name}</h4>
                      <p className="text-gray-400 text-sm mb-2">
                        {selectedModel === 'adidas' ? 'Adidas Sports' : 'Vans Classic'} - Size {design.size}
                      </p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: design.colors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: design.colors.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: design.colors.accent }}
                          title="Accent"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(design.updatedAt).toLocaleDateString('th-TH')}
                        </span>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditDesign(design.id)}
                            className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Model Selection */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">เลือกรุ่นรองเท้า</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setSelectedModel('adidas')}
                  className={`p-4 border rounded-lg text-left transition-all relative overflow-hidden ${
                    selectedModel === 'adidas'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/25'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Adidas Sports</div>
                      <div className="text-sm opacity-75">รองเท้ากีฬาสแกน 3D</div>
                      <div className="text-xs mt-1 opacity-60">ไฟล์ GLB | ~19MB</div>
                    </div>
                    {selectedModel === 'adidas' && (
                      <div className="text-blue-400">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setSelectedModel('vans')}
                  className={`p-4 border rounded-lg text-left transition-all relative overflow-hidden ${
                    selectedModel === 'vans'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/25'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Vans Classic</div>
                      <div className="text-sm opacity-75">รองเท้าแบบคลาสสิค</div>
                      <div className="text-xs mt-1 opacity-60">ไฟล์ GLB | ~15MB</div>
                    </div>
                    {selectedModel === 'vans' && (
                      <div className="text-blue-400">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
              
              {/* Model Info */}
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-300">
                  <div className="font-medium mb-1">
                    {selectedModel === 'adidas' ? 'Adidas Sports Shoe' : 'Vans Classic Shoe'}
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>• พื้นผิว: สามารถปรับสีได้</div>
                    <div>• โมเดล: {selectedModel === 'adidas' ? 'สแกน 3D จริง' : 'โมเดลคลาสสิค'}</div>
                    <div>• รองรับ: สีหลัก, สีรอง, สีเด่น</div>
                    <div>• ขนาดไฟล์: รองรับไฟล์ขนาดใหญ่ (ถึง 30MB)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Showcase */}
       

            {/* Quick Actions */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">เมนูด่วน</h3>
              
              <div className="space-y-3">
                <Link
                  href="/collections"
                  className="block w-full bg-gray-800 hover:bg-gray-750 text-white p-3 rounded-lg transition-colors text-center"
                >
                  จัดการคอลเล็กชั่น
                </Link>
                
                <button
                  onClick={handleStartCustomizing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus size={16} />
                  <span>ออกแบบใหม่</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Content */}
        {isAdmin && (
          <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="text-yellow-400" size={24} />
              <h2 className="text-xl font-bold text-yellow-400">Admin Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div>
                <h4 className="font-semibold mb-2">User Management</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• View all user collections</li>
                  <li>• Manage user permissions</li>
                  <li>• Monitor system activity</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Content Moderation</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Review public collections</li>
                  <li>• Manage featured designs</li>
                  <li>• System analytics</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
