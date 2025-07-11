"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, LogOut, User, Palette } from "lucide-react"
import ShoeModel3D from "@/components/ShoeModel3D"
import { getSavedDesigns, initializeMockData, type SavedDesign } from "@/lib/collections"

// Recent designs from localStorage
const mockRecentDesigns: SavedDesign[] = []

// Featured Nike Model showcase
const featuredNikeModel = {
  colors: {
    primary: "#000000",
    secondary: "#FFFFFF",
    accent: "#FF0000"
  },
  name: "Nike Classic Model",
  description: "รองเท้า Nike คลาสสิกสำหรับการปรับแต่ง"
}

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

  // Auto-rotate color presets for showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedPreset(prev => (prev + 1) % colorPresets.length)
    }, 3000) // Change every 3 seconds
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const handleEditDesign = (id: string) => {
    router.push(`/customizer?edit=${id}`)
  }

  const handleStartCustomizing = () => {
    router.push("/customizer")
  }

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
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Nike OEM Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Nike Model */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">ยินดีต้อนรับ, {session.user?.name}!</h2>
              <p className="text-blue-100 mb-4">ออกแบบรองเท้า Nike ในแบบที่คุณต้องการ</p>
              <p className="text-blue-200 mb-6">เลือกสี ปรับแต่ง และสร้างสรรค์รองเท้าที่เป็นเอกลักษณ์ของคุณ</p>
              
              {/* Color presets preview */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-blue-100">ชุดสีที่แนะนำ:</h4>
                <div className="flex space-x-2 mb-4">
                  {colorPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPreset(index)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        selectedPreset === index 
                          ? 'bg-white/20 border border-white/40' 
                          : 'bg-white/10 hover:bg-white/15'
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
              </div>
              
              <button
                onClick={handleStartCustomizing}
                className="inline-flex items-center space-x-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Palette size={20} />
                <span>เริ่มปรับแต่งสี</span>
              </button>
            </div>
            <div className="h-80 bg-white/10 rounded-lg overflow-hidden">
              <ShoeModel3D
                colors={colorPresets[selectedPreset].colors}
                autoRotate={true}
                showControls={false}
                initialZoom={12}
                minZoom={8}
                maxZoom={20}
              />
              {/* Color preset indicator */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                {colorPresets[selectedPreset].name}
              </div>
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
                        <ShoeModel3D
                          colors={design.colors}
                          autoRotate={true}
                          showControls={false}
                          initialZoom={8}
                          minZoom={6}
                          maxZoom={12}
                        />
                      </div>
                      
                      <h4 className="font-semibold text-white mb-1">{design.name}</h4>
                      <p className="text-gray-400 text-sm mb-2">Nike Model - Size {design.size}</p>
                      
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
            {/* Nike Model Showcase */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Nike Model Preview</h3>
              <div className="aspect-square bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
                <ShoeModel3D
                  colors={colorPresets[selectedPreset].colors}
                  autoRotate={true}
                  showControls={false}
                  initialZoom={8}
                />
                {/* Current color info */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {colorPresets[selectedPreset].name}
                </div>
              </div>
              <h4 className="font-medium text-white mb-1">{featuredNikeModel.name}</h4>
              <p className="text-gray-400 text-sm mb-4">{featuredNikeModel.description}</p>
              
              {/* Quick color selector */}
              <div className="mb-4">
                <p className="text-sm text-gray-300 mb-2">ชุดสีปัจจุบัน:</p>
                <div className="flex items-center space-x-2">
                  {colorPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPreset(index)}
                      className={`p-1 rounded border-2 transition-all ${
                        selectedPreset === index 
                          ? 'border-blue-400' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex space-x-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: preset.colors.secondary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: preset.colors.accent }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleStartCustomizing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Palette size={16} />
                <span>ปรับแต่งโมเดลนี้</span>
              </button>
            </div>

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
      </div>
    </div>
  )
}
