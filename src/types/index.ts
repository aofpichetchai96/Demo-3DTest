export interface ShoeModel {
  id: string
  name: string
  type: 'sneaker' | 'boot' | 'sandal' | 'dress'
  basePrice: number
  description: string
  meshPath?: string
  previewImage: string
}

export interface Colors {
  primary: string
  secondary: string
  accent: string
}

export interface ShoeCustomization {
  id: string
  userId: string
  model: ShoeModel
  size: number
  primaryColor: string
  secondaryColor?: string
  accentColor?: string
  material: string
  quantity: number
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}

export interface Collection {
  id: string
  userId: string
  name: string
  description?: string
  notes?: string | null
  colors: {
    primary: string
    secondary: string
    accent: string
  } | unknown
  size: string
  tags: string[] | unknown
  isPublic: boolean
  views: number
  likes: number
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Quote {
  id: string
  userId: string
  customizations: ShoeCustomization[]
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  validUntil: Date
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  userId: string
  quote: Quote
  paymentStatus: 'pending' | 'paid' | 'overdue'
  paymentMethod?: string
  paidAt?: Date
  dueDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  collections: Collection[]
  quotes: Quote[]
  invoices: Invoice[]
}
