import type { Collection, NewCollection } from './schema'

const API_BASE = '/api'

// Collection API functions
export const collectionsApi = {
  // Get user's collections
  getAll: async (): Promise<Collection[]> => {
    const response = await fetch(`${API_BASE}/collections`)
    if (!response.ok) {
      throw new Error('Failed to fetch collections')
    }
    return response.json()
  },

  // Get specific collection
  getById: async (id: string): Promise<Collection> => {
    const response = await fetch(`${API_BASE}/collections/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch collection')
    }
    return response.json()
  },

  // Create new collection
  create: async (collection: Omit<NewCollection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Collection> => {
    const response = await fetch(`${API_BASE}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collection),
    })
    if (!response.ok) {
      throw new Error('Failed to create collection')
    }
    return response.json()
  },

  // Update collection
  update: async (id: string, collection: Partial<Omit<NewCollection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Collection> => {
    const response = await fetch(`${API_BASE}/collections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collection),
    })
    if (!response.ok) {
      throw new Error('Failed to update collection')
    }
    return response.json()
  },

  // Delete collection
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/collections/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete collection')
    }
  },

  // Get public collections
  getPublic: async (): Promise<Collection[]> => {
    const response = await fetch(`${API_BASE}/collections/public`)
    if (!response.ok) {
      throw new Error('Failed to fetch public collections')
    }
    return response.json()
  }
}

// Generic API error handler
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// API response wrapper
export const apiResponse = {
  success: <T>(data: T) => ({ success: true, data }),
  error: (message: string) => ({ success: false, error: message })
}
