'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
  const { data: session } = useSession()
  const [collections, setCollections] = useState<CollectionWithCreator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const data = await collectionsApi.getAll()
      setCollections(data)
    } catch (err) {
      console.error('Error fetching collections:', err)
      setError('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchCollections()
    }
  }, [session])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      await collectionsApi.delete(id)
      setCollections(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting collection:', err)
      alert('Failed to delete collection')
    }
  }

  const handleEdit = (id: string) => {
    window.open(`/customizer?load=${id}`, '_blank')
  }

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/collections/${id}`
    navigator.clipboard.writeText(url)
    alert('Collection link copied to clipboard!')
  }

  const handleDownload = (id: string) => {
    // Implement download functionality
    alert('Download feature coming soon!')
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view collections</h1>
          <a href="/login" className="text-blue-400 hover:text-blue-300">
            Go to login
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p>Loading collections...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Error</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchCollections}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Collections</h1>
            <p className="text-gray-400">
              {session.user?.role === 'admin' ? 'All collections' : 'Your saved designs'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {session.user?.role === 'admin' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                <Crown className="h-4 w-4" />
                <span className="text-sm">Admin View</span>
              </div>
            )}
            <div className="text-sm text-gray-400">
              {collections.length} collection{collections.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👟</div>
            <h2 className="text-2xl font-bold mb-4">No collections yet</h2>
            <p className="text-gray-400 mb-8">
              Start by creating your first custom shoe design
            </p>
            <a
              href="/customizer"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Create First Design
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg truncate">{collection.name}</h3>
                    {collection.creator && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{collection.creator.name || collection.creator.email}</span>
                      </div>
                    )}
                  </div>
                  
                  {collection.notes && (
                    <p className="text-sm text-gray-400 mb-3">
                      {collection.notes}
                    </p>
                  )}
                </div>

                {/* Color Preview */}
                <div className="p-4">
                  <div className="flex gap-2 mb-4">
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
                    <div className="flex-1" />
                    <span className="text-xs text-gray-400">Size: {collection.size}</span>
                  </div>

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

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{collection.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{collection.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(collection.updatedAt).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>

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
                        onClick={() => handleEdit(collection.id)}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
