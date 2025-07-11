import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

// Upload file function
export const uploadFile = async (file: File, uploadType: string = 'image') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_type', uploadType)

  try {
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

// Generate download URL
export const getDownloadUrl = (filePath: string) => {
  if (!filePath) return ''
  if (filePath.startsWith('http')) return filePath
  return `${API_BASE_URL.replace('/api', '')}/uploads/${filePath}`
}

export default api