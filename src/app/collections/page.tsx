'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Share2, 
  Download, 
  Trash2, 
  Edit,
  Plus,
  Search,
  Grid,
  List
} from 'lucide-react'
import ShoeVisualizer from '@/components/ShoeVisualizer'
import MiniShoeVisualizer from '@/components/MiniShoeVisualizer'
import { getSavedDesigns, deleteDesign, initializeMockData, type SavedDesign } from '@/lib/collections'

export default function CollectionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [collections, setCollections] = useState<SavedDesign[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Load saved designs from localStorage
  useEffect(() => {
    async function loadCollections() {
      if (typeof window !== 'undefined') {
        try {
          // Initialize mock data for first time users
          await initializeMockData()
          
          // Load all saved designs
          const savedDesigns = await getSavedDesigns()
          setCollections(savedDesigns)
        } catch (error) {
          console.error('Error loading collections:', error)
          setCollections([])
        }
      }
    }
    
    loadCollections()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  // Filter collections to show only user's collections
  const userCollections = collections.filter(collection => 
    !collection.userId || collection.userId === session?.user?.name
  )

  const filteredCollections = userCollections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (collection.notes && collection.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const handleEdit = (id: string) => {
    router.push(`/customizer?edit=${id}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบการออกแบบนี้?')) {
      try {
        const success = await deleteDesign(id)
        if (success) {
          setCollections(prev => prev.filter(c => c.id !== id))
          alert('ลบการออกแบบเรียบร้อยแล้ว!')
        } else {
          alert('เกิดข้อผิดพลาดในการลบ!')
        }
      } catch (error) {
        console.error('Error deleting design:', error)
        alert('เกิดข้อผิดพลาดในการลบ!')
      }
    }
  }

  const handleShare = (id: string) => {
    const collection = userCollections.find(c => c.id === id)
    if (collection) {
      const shareData = {
        name: collection.name,
        colors: collection.colors,
        size: collection.size,
        notes: collection.notes
      }
      const shareText = `Check out my Nike design: ${collection.name}\nColors: ${collection.colors.primary}, ${collection.colors.secondary}, ${collection.colors.accent}\nSize: ${collection.size}`
      
      if (navigator.share) {
        navigator.share({
          title: `Nike Design - ${collection.name}`,
          text: shareText,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(shareText)
        alert('ข้อมูลการออกแบบถูกคัดลอกไปยังคลิปบอร์ดแล้ว!')
      }
    }
  }

  const handleDownload = (id: string) => {
    const collection = userCollections.find(c => c.id === id)
    if (collection) {
      const dataStr = JSON.stringify(collection, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = `${collection.name.replace(/\s+/g, '_')}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Nike Collections</h1>
          <p className="text-gray-600">
            จัดการการออกแบบรองเท้า Nike ของคุณ ({userCollections.length} การออกแบบ)
          </p>
          <div className="mt-2 text-sm text-gray-500">
            แสดงคอลเล็กชั่นสำหรับ: <span className="font-medium text-gray-700">{session?.user?.name}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาการออกแบบ..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Create New */}
              <button
                onClick={() => router.push('/customizer')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                สร้างใหม่
              </button>
            </div>
          </div>
        </div>

        {/* Collections Grid/List */}
        {filteredCollections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Save className="h-16 w-16 mx-auto mb-4" />
              {userCollections.length === 0 ? (
                <>
                  <p className="text-xl">คุณยังไม่มีการออกแบบใดๆ</p>
                  <p className="text-sm">เริ่มสร้างการออกแบบรองเท้า Nike ของคุณเลย!</p>
                </>
              ) : (
                <>
                  <p className="text-xl">ไม่พบการออกแบบที่ตรงกับการค้นหา</p>
                  <p className="text-sm">ลองเปลี่ยนคำค้นหาหรือสร้างการออกแบบใหม่</p>
                </>
              )}
            </div>
            <button
              onClick={() => router.push('/customizer')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {userCollections.length === 0 ? 'สร้างการออกแบบแรก' : 'สร้างการออกแบบใหม่'}
            </button>
          </div>
        ) : (
          <>
            {/* Performance notice */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                🎯 <strong>Nike 3D Model:</strong> ทุกการออกแบบใช้โมเดล Nike (nike.obj + nike.mtl) 
                พร้อมสีที่คุณปรับแต่ง คลิกและลากเพื่อหมุนดูโมเดล!
              </p>
            </div>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {filteredCollections.map((collection) => (
                <div key={collection.id} className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                  {/* 3D Model Preview */}
                  <div className={`${viewMode === 'list' ? 'w-32 h-32' : 'aspect-square h-64'} bg-gray-100 relative`}>
                    {viewMode === 'list' ? (
                      // Small 3D preview for list view
                      <div className="w-full h-full">
                        <MiniShoeVisualizer
                          colors={collection.colors}
                          collectionName={collection.name}
                        />
                      </div>
                    ) : (
                      // Full 3D preview for grid view
                      <ShoeVisualizer
                        colors={collection.colors}
                        size={collection.size}
                        collectionName={collection.name}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-lg mb-1">{collection.name}</h3>
                    {collection.notes && (
                      <p className="text-gray-600 text-sm mb-2">{collection.notes}</p>
                    )}
                    <div className="text-xs text-gray-500 mb-3">
                      <div>Nike Model - Size {collection.size}</div>
                      <div>อัปเดต: {new Date(collection.updatedAt).toLocaleDateString('th-TH')}</div>
                    </div>

                    {/* Color Preview */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: collection.colors.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: collection.colors.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: collection.colors.accent }}
                        title="Accent"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(collection.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleShare(collection.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100 transition-colors"
                      >
                        <Share2 className="h-3 w-3" />
                        แชร์
                      </button>
                      <button
                        onClick={() => handleDownload(collection.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-600 rounded text-sm hover:bg-purple-100 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        Export
                      </button>
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
