// User types
export interface User {
  id: string
  username: string
  email: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  category_id: string
  category_name?: string
  base_price: number
  glb_file_path: string
  thumbnail_path: string
  customizable_parts: CustomizableParts
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CustomizableParts {
  [partName: string]: {
    colors?: boolean
    materials?: boolean
    logos?: boolean
    textures?: boolean
  }
}

export interface Category {
  id: string
  name: string
  description: string
  product_count: number
  created_at: string
}

// Customization types
export interface ProductCustomization {
  id: string
  product_id: string
  user_id: string
  customization_data: CustomizationData
  preview_image_path: string
  name: string
  product_name?: string
  product_thumbnail?: string
  created_at: string
  updated_at: string
}

export interface CustomizationData {
  colors: { [partName: string]: string }
  logos: { [partName: string]: string }
  materials: { [partName: string]: MaterialConfig }
  textures?: { [partName: string]: string }
}

export interface MaterialConfig {
  type: 'standard' | 'metallic' | 'glossy' | 'matte' | 'carbon'
  roughness?: number
  metalness?: number
  emissive?: string
}

// Collection types
export interface UserCollection {
  id: string
  user_id: string
  name: string
  description: string
  is_public: boolean
  items?: CollectionItem[]
  created_at: string
  updated_at: string
}

export interface CollectionItem {
  id: string
  collection_id: string
  customization_id: string
  position_order: number
  customization?: ProductCustomization
  created_at: string
}

// Order types
export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: Address
  billing_address: Address
  notes: string
  items?: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  customization_id: string
  quantity: number
  unit_price: number
  total_price: number
  customization?: ProductCustomization
  created_at: string
}

// Quote types
export interface Quote {
  id: string
  user_id: string
  quote_number: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  total_amount: number
  valid_until: string
  notes: string
  items?: QuoteItem[]
  created_at: string
  updated_at: string
}

export interface QuoteItem {
  id: string
  quote_id: string
  customization_id: string
  quantity: number
  unit_price: number
  total_price: number
  customization?: ProductCustomization
  created_at: string
}

// Address type
export interface Address {
  name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

// File upload types
export interface FileUpload {
  id: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  uploaded_by: string
  upload_type: 'glb' | 'image' | 'logo'
  created_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface ProductForm {
  name: string
  description: string
  category_id: string
  base_price: number
  glb_file_path: string
  thumbnail_path: string
  customizable_parts: CustomizableParts
}

export interface CustomizationForm {
  name: string
  is_public: boolean
}

// Color palette
export const DEFAULT_COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#000000',
  '#FFFFFF', '#FFD700', '#C0C0C0', '#8B4513'
]

// Material presets
export const MATERIAL_PRESETS: { [key: string]: MaterialConfig } = {
  standard: { type: 'standard', roughness: 0.5, metalness: 0.0 },
  metallic: { type: 'metallic', roughness: 0.1, metalness: 0.9 },
  glossy: { type: 'glossy', roughness: 0.0, metalness: 0.1 },
  matte: { type: 'matte', roughness: 1.0, metalness: 0.0 },
  carbon: { type: 'carbon', roughness: 0.3, metalness: 0.8 }
}