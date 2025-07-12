"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Save, Download, ArrowLeft, RotateCcw } from "lucide-react"
import Vanilla3DViewer from "@/components/Vanilla3DViewer"
import { saveDesign, updateDesign, getDesignById, type SavedDesign } from "@/lib/collections"

interface DesignData {
  id?: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  size: string
  notes?: string
}

// Predefined color presets
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

const shoeSizes = ["38", "39", "40", "41", "42", "43", "44", "45", "46"]

export default function CustomizerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")

  const [designData, setDesignData] = useState<DesignData>({
    name: "Nike Custom Design",
    colors: {
      primary: "#000000",
      secondary: "#FFFFFF", 
      accent: "#FF0000"
    },
    size: "42",
    notes: ""
  })

  const [isSaving, setIsSaving] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [selectedModel, setSelectedModel] = useState<'adidas' | 'vans'>('adidas')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  // Load design data if editing
  useEffect(() => {
    async function loadDesignForEdit() {
      if (editId) {
        try {
          const existingDesign = await getDesignById(editId)
          if (existingDesign) {
            setDesignData({
              id: existingDesign.id,
              name: existingDesign.name,
              colors: existingDesign.colors,
              size: existingDesign.size,
              notes: existingDesign.notes || ""
            })
          }
        } catch (error) {
          console.error('Error loading design for edit:', error)
        }
      }
    }
    
    loadDesignForEdit()
  }, [editId])

  const handleColorChange = (colorType: "primary" | "secondary" | "accent", color: string) => {
    setDesignData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: color
      }
    }))
  }

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    setDesignData(prev => ({
      ...prev,
      colors: preset.colors,
      name: preset.name
    }))
  }

  const handleResetColors = () => {
    setDesignData(prev => ({
      ...prev,
      colors: {
        primary: "#000000",
        secondary: "#FFFFFF",
        accent: "#FF0000"
      }
    }))
  }

  const handleSave = async () => {
    if (!session?.user?.name) return
    
    setIsSaving(true)
    try {
      const designToSave = {
        name: designData.name,
        colors: designData.colors,
        size: designData.size,
        notes: designData.notes,
        userId: session.user.name
      }

      try {
        if (designData.id) {
          // Update existing design
          await updateDesign(designData.id, designToSave)
        } else {
          // Save new design
          await saveDesign(designToSave)
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Show success message
        alert(designData.id ? "อัปเดตการออกแบบเรียบร้อย!" : "บันทึกการออกแบบเรียบร้อย!")
        
        // Redirect to collections
        router.push("/collections")
      } catch (error) {
        console.error('Error saving design:', error)
        alert('เกิดข้อผิดพลาดในการบันทึก!')
      }
    } catch (error) {
      console.error("Failed to save design:", error)
      alert("เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่")
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    // In real app, generate PDF or image export
    const designInfo = {
      name: designData.name,
      colors: designData.colors,
      size: designData.size,
      notes: designData.notes
    }
    
    const dataStr = JSON.stringify(designInfo, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${designData.name.replace(/\s+/g, '_')}_design.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>กลับ</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Customizer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleResetColors}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RotateCcw size={16} />
                <span>รีเซ็ต</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isSaving ? "กำลังบันทึก..." : "บันทึก"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Model Viewer */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Nike Model Preview</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">หมุนอัตโนมัติ</span>
                </label>
              </div>
              <p className="text-sm text-gray-600">ลากเมาส์เพื่อหมุนดู, scroll เพื่อซูม</p>
            </div>
            <div className="h-[500px]">
              <Vanilla3DViewer
                colors={designData.colors}
                autoRotate={autoRotate}
                showControls={true}
                modelName={selectedModel}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Design Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">ข้อมูลการออกแบบ</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อการออกแบบ</label>
                  <input
                    type="text"
                    value={designData.name}
                    onChange={(e) => setDesignData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ขนาด</label>
                  <select
                    value={designData.size}
                    onChange={(e) => setDesignData(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {shoeSizes.map(size => (
                      <option key={size} value={size}>ขนาด {size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">หมายเหตุ</label>
                  <textarea
                    value={designData.notes}
                    onChange={(e) => setDesignData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="เพิ่มหมายเหตุเกี่ยวกับการออกแบบ..."
                  />
                </div>
              </div>
            </div>

            {/* Color Presets */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">ชุดสีที่แนะนำ</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(preset)}
                    className="p-3 border rounded-lg hover:border-blue-500 transition-colors group"
                  >
                    <div className="flex space-x-1 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.colors.accent }}
                      />
                    </div>
                    <p className="text-sm font-medium group-hover:text-blue-600">
                      {preset.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Controls */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">ปรับแต่งสี</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">สีหลัก (Primary)</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={designData.colors.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={designData.colors.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="#000000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">ส่วนหลักของรองเท้า</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">สีรอง (Secondary)</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={designData.colors.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={designData.colors.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="#FFFFFF"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">พื้นรองเท้า/ส่วนล่าง</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">สีเด่น (Accent)</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={designData.colors.accent}
                      onChange={(e) => handleColorChange("accent", e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={designData.colors.accent}
                      onChange={(e) => handleColorChange("accent", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="#FF0000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">รายละเอียด/จุดเด่น</p>
                </div>
              </div>
            </div>

            {/* Current Colors Display */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">สีปัจจุบัน</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border border-gray-300 mb-2"
                    style={{ backgroundColor: designData.colors.primary }}
                  />
                  <p className="text-sm font-medium">หลัก</p>
                  <p className="text-xs text-gray-500">{designData.colors.primary}</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border border-gray-300 mb-2"
                    style={{ backgroundColor: designData.colors.secondary }}
                  />
                  <p className="text-sm font-medium">รอง</p>
                  <p className="text-xs text-gray-500">{designData.colors.secondary}</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border border-gray-300 mb-2"
                    style={{ backgroundColor: designData.colors.accent }}
                  />
                  <p className="text-sm font-medium">เด่น</p>
                  <p className="text-xs text-gray-500">{designData.colors.accent}</p>
                </div>
              </div>
            </div>

            {/* Model Selection */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">เลือกรุ่นรองเท้า</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedModel('adidas')}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    selectedModel === 'adidas'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">Adidas Sports</div>
                  <div className="text-sm text-gray-500">รองเท้ากีฬาสแกน 3D</div>
                </button>
                <button
                  onClick={() => setSelectedModel('vans')}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    selectedModel === 'vans'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">Vans Classic</div>
                  <div className="text-sm text-gray-500">รองเท้าแบบคลาสสิค</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
