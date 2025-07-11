// Collections management utility
import { collectionsApi } from './api'
import type { Collection } from './schema'

export interface SavedDesign {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  size: string
  notes?: string
  createdAt: string
  updatedAt: string
  userId?: string
}

const STORAGE_KEY = 'nike_saved_designs'

// Fallback to localStorage for client-side operations
export function getSavedDesignsFromStorage(): SavedDesign[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Get all saved designs from database (or fallback to localStorage)
export async function getSavedDesigns(): Promise<SavedDesign[]> {
  try {
    const collections = await collectionsApi.getAll()
    return collections.map(collectionToSavedDesign)
  } catch (error) {
    console.warn('Failed to fetch from database, using localStorage:', error)
    return getSavedDesignsFromStorage()
  }
}

// Convert Collection to SavedDesign format for compatibility
function collectionToSavedDesign(collection: Collection): SavedDesign {
  return {
    id: collection.id,
    name: collection.name,
    colors: collection.colors as SavedDesign['colors'],
    size: collection.size,
    notes: collection.notes || undefined,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
    userId: collection.userId
  }
}

// Save a new design to database (with localStorage fallback)
// Save a new design to database (with localStorage fallback)
export async function saveDesign(design: Omit<SavedDesign, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedDesign> {
  try {
    const collection = await collectionsApi.create({
      name: design.name,
      colors: design.colors,
      size: design.size,
      notes: design.notes || null,
      tags: null,
      isPublic: false
    })
    return collectionToSavedDesign(collection)
  } catch (error) {
    console.warn('Failed to save to database, using localStorage:', error)
    return saveDesignToStorage(design)
  }
}

// Fallback save to localStorage
function saveDesignToStorage(design: Omit<SavedDesign, 'id' | 'createdAt' | 'updatedAt'>): SavedDesign {
  const designs = getSavedDesignsFromStorage()
  const newDesign: SavedDesign = {
    ...design,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  designs.push(newDesign)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
  return newDesign
}

// Update an existing design
export async function updateDesign(id: string, updates: Partial<SavedDesign>): Promise<SavedDesign | null> {
  try {
    const collection = await collectionsApi.update(id, {
      name: updates.name,
      colors: updates.colors,
      size: updates.size,
      notes: updates.notes || null
    })
    return collectionToSavedDesign(collection)
  } catch (error) {
    console.warn('Failed to update in database, using localStorage:', error)
    return updateDesignInStorage(id, updates)
  }
}

// Fallback update in localStorage
function updateDesignInStorage(id: string, updates: Partial<SavedDesign>): SavedDesign | null {
  const designs = getSavedDesignsFromStorage()
  const index = designs.findIndex(d => d.id === id)
  
  if (index === -1) return null
  
  designs[index] = {
    ...designs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
  return designs[index]
}

// Delete a design
export async function deleteDesign(id: string): Promise<boolean> {
  try {
    await collectionsApi.delete(id)
    return true
  } catch (error) {
    console.warn('Failed to delete from database, using localStorage:', error)
    return deleteDesignFromStorage(id)
  }
}

// Fallback delete from localStorage
function deleteDesignFromStorage(id: string): boolean {
  const designs = getSavedDesignsFromStorage()
  const filtered = designs.filter(d => d.id !== id)
  
  if (filtered.length === designs.length) return false
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

// Get a single design by ID
export async function getDesignById(id: string): Promise<SavedDesign | null> {
  try {
    const collection = await collectionsApi.getById(id)
    return collectionToSavedDesign(collection)
  } catch (error) {
    console.warn('Failed to fetch from database, using localStorage:', error)
    const designs = getSavedDesignsFromStorage()
    return designs.find(d => d.id === id) || null
  }
}

// Generate mock data for first time users  
export async function initializeMockData(): Promise<void> {
  try {
    const existing = await getSavedDesigns()
    if (existing.length > 0) return // Already has data
  } catch {
    // If API fails, check localStorage
    const localData = getSavedDesignsFromStorage()
    if (localData.length > 0) return
  }
  
  const mockDesigns: Omit<SavedDesign, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: "Classic Black Nike",
      colors: {
        primary: "#000000",
        secondary: "#FFFFFF", 
        accent: "#FF0000"
      },
      size: "42",
      notes: "Classic design with red accents",
      userId: "demo"
    },
    {
      name: "Ocean Blue",
      colors: {
        primary: "#1E90FF",
        secondary: "#000080",
        accent: "#FFFFFF"
      },
      size: "41",
      notes: "Ocean inspired color scheme",
      userId: "demo"
    }
  ]
  
  for (const design of mockDesigns) {
    try {
      await saveDesign(design)
    } catch (error) {
      console.warn('Failed to save mock design:', error)
    }
  }
}
