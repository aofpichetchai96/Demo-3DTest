'use client'

import { useState, useEffect } from 'react'
import { ThreeViewer } from './ThreeViewer'
import { ColorPicker } from './ColorPicker'
import { LogoUploader } from './LogoUploader'
import { SaveCustomization } from './SaveCustomization'
import { useAuth } from '@/contexts/AuthContext'
import { Product } from '@/types'
import { toast } from 'react-hot-toast'

interface ProductCustomizerProps {
  product: Product
  onSave?: (customization: any) => void
  initialCustomization?: any
}

export function ProductCustomizer({ 
  product, 
  onSave, 
  initialCustomization 
}: ProductCustomizerProps) {
  const { user } = useAuth()
  const [customizations, setCustomizations] = useState({
    colors: {},
    logos: {},
    materials: {}
  })
  const [selectedPart, setSelectedPart] = useState<string>('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialCustomization) {
      setCustomizations(initialCustomization.customization_data || {
        colors: {},
        logos: {},
        materials: {}
      })
    }
  }, [initialCustomization])

  const customizableParts = product.customizable_parts || {
    body: { colors: true, materials: true },
    handle: { colors: true },
    logo: { logos: true }
  }

  const handleColorChange = (partName: string, color: string) => {
    setCustomizations(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [partName]: color
      }
    }))
  }

  const handleLogoUpload = (partName: string, logoUrl: string) => {
    setCustomizations(prev => ({
      ...prev,
      logos: {
        ...prev.logos,
        [partName]: logoUrl
      }
    }))
  }

  const handleMaterialChange = (partName: string, material: any) => {
    setCustomizations(prev => ({
      ...prev,
      materials: {
        ...prev.materials,
        [partName]: material
      }
    }))
  }

  const resetCustomizations = () => {
    setCustomizations({
      colors: {},
      logos: {},
      materials: {}
    })
    toast.success('รีเซ็ตการปรับแต่งเรียบร้อย')
  }

  const handleSave = async (name: string, isPublic: boolean) => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อน')
      return
    }

    setIsSaving(true)
    try {
      // Here you would typically capture a screenshot of the 3D model
      // For now, we'll use a placeholder
      const previewImage = '/api/placeholder-preview.jpg'
      
      const customizationData = {
        product_id: product.id,
        customization_data: customizations,
        preview_image_path: previewImage,
        name,
        is_public: isPublic
      }

      if (onSave) {
        await onSave(customizationData)
      }
      
      setShowSaveModal(false)
      toast.success('บันทึกการปรับแต่งเรียบร้อย')
    } catch (error) {
      console.error('Error saving customization:', error)
      toast.error('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 3D Viewer */}
      <div className="order-2 lg:order-1">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="h-96 lg:h-[500px]">
            <ThreeViewer
              modelPath={product.glb_file_path}
              customizations={customizations}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Customization Controls */}
      <div className="order-1 lg:order-2">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">ปรับแต่งสินค้า</h2>
          
          {/* Product Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">
              ราคา: ฿{product.base_price?.toLocaleString()}
            </p>
          </div>

          {/* Customization Sections */}
          <div className="space-y-6">
            {Object.entries(customizableParts).map(([partName, options]) => (
              <div key={partName} className="border rounded-lg p-4">
                <h4 className="font-semibold capitalize mb-3">
                  {partName === 'body' ? 'ตัวสินค้า' : 
                   partName === 'handle' ? 'ด้ามจับ' : 
                   partName === 'logo' ? 'โลโก้' : partName}
                </h4>
                
                {/* Colors */}
                {options.colors && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">สี</label>
                    <ColorPicker
                      selectedColor={customizations.colors[partName] || '#ffffff'}
                      onColorChange={(color) => handleColorChange(partName, color)}
                    />
                  </div>
                )}

                {/* Logos */}
                {options.logos && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">โลโก้</label>
                    <LogoUploader
                      currentLogo={customizations.logos[partName]}
                      onLogoUpload={(url) => handleLogoUpload(partName, url)}
                    />
                  </div>
                )}

                {/* Materials */}
                {options.materials && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">วัสดุ</label>
                    <select
                      value={customizations.materials[partName]?.type || 'standard'}
                      onChange={(e) => handleMaterialChange(partName, { type: e.target.value })}
                      className="form-input"
                    >
                      <option value="standard">มาตรฐาน</option>
                      <option value="metallic">โลหะ</option>
                      <option value="glossy">เงาใส</option>
                      <option value="matte">ด้าน</option>
                      <option value="carbon">คาร์บอน</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={resetCustomizations}
              className="btn-secondary flex-1"
            >
              รีเซ็ต
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="btn-primary flex-1"
              disabled={!user}
            >
              {user ? 'บันทึก' : 'เข้าสู่ระบบเพื่อบันทึก'}
            </button>
          </div>

          {/* Additional Actions */}
          <div className="mt-4 space-y-2">
            <button className="w-full btn-secondary">
              เพิ่มลงในคอลเลกชัน
            </button>
            <button className="w-full btn-primary">
              สร้างใบเสนอราคา
            </button>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <SaveCustomization
          onSave={handleSave}
          onClose={() => setShowSaveModal(false)}
          isLoading={isSaving}
        />
      )}
    </div>
  )
}