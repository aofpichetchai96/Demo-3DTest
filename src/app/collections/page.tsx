'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { collectionsApi } from '@/lib/api'
import { Collection } from '@/types'
import { User, Crown, Eye, Heart, Calendar } from 'lucide-react'

interface ColorScheme {
  primary: string
  secondary: string
  accent: string
}

interface CollectionWithCreator extends Collection {
  creator?: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

export default function CollectionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [collections, setCollections] = useState<CollectionWithCreator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = session?.user?.role === 'admin'

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      loadCollections()
    }
  }, [session])

  const loadCollections = async () => {
    try {
      setLoading(true)
      const data = await collectionsApi.getAll()
      setCollections(data)
    } catch (err) {
      setError('Failed to load collections')
      console.error('Error loading collections:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      await collectionsApi.delete(id)
      setCollections(collections.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting collection:', err)
      alert('Failed to delete collection')
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดคอลเลกชัน...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {isAdmin && <Crown className="text-yellow-400" size={28} />}
            <h1 className="text-3xl font-bold text-white">
              {isAdmin ? 'All Collections' : 'My Collections'}
            </h1>
          </div>
          <p className="text-gray-300">
            {isAdmin 
              ? 'Manage all user collections and designs'
              : 'Your saved shoe designs and customizations'
            }
          </p>
        </div>

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">
              {isAdmin ? 'No collections found' : 'No collections yet'}
            </div>
            <p className="text-gray-500">
              {isAdmin 
                ? 'Users haven\'t created any collections yet'
                : 'Start by creating your first custom shoe design'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/20"
              >
                {/* Creator Info (Admin Only) */}
                {isAdmin && collection.creator && (
                  <div className="mb-4 p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-400" />
                      <span className="text-white font-medium">
                        {collection.creator.name || collection.creator.email}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        collection.creator.role === 'admin' 
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {collection.creator.role}
                      </span>
                    </div>
                  </div>
                )}

                {/* Collection Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {collection.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {collection.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {collection.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="mb-4">
                  <div className="flex gap-2 mb-2">
                    {typeof collection.colors === 'object' && collection.colors && 'primary' in collection.colors && (
                      <>
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/30"
                          style={{ backgroundColor: (collection.colors as ColorScheme).primary }}
                          title="Primary Color"
                        />
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/30"
                          style={{ backgroundColor: (collection.colors as ColorScheme).secondary }}
                          title="Secondary Color"
                        />
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/30"
                          style={{ backgroundColor: (collection.colors as ColorScheme).accent }}
                          title="Accent Color"
                        />
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">Size: {collection.size}</p>
                </div>

                {/* Notes */}
                {collection.notes && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {collection.notes}
                  </p>
                )}

                {/* Tags */}
                {Array.isArray(collection.tags) && collection.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {collection.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {collection.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                        +{collection.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Status & Actions */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    collection.isPublic
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {collection.isPublic ? 'Public' : 'Private'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`/customizer?load=${collection.id}`, '_blank')}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(collection.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
