'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/utils/api'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

interface User {
  id: string
  username: string
  email: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = Cookies.get('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Auth check failed:', error)
      Cookies.remove('auth_token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user: userData } = response.data

      // Store token
      Cookies.set('auth_token', token, { expires: 7 }) // 7 days
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
      toast.success('เข้าสู่ระบบสำเร็จ')
    } catch (error: any) {
      console.error('Login failed:', error)
      const message = error.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ'
      toast.error(message)
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { username, email, password })
      const { token, user: userData } = response.data

      // Store token
      Cookies.set('auth_token', token, { expires: 7 })
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
      toast.success('สมัครสมาชิกสำเร็จ')
    } catch (error: any) {
      console.error('Registration failed:', error)
      const message = error.response?.data?.error || 'สมัครสมาชิกไม่สำเร็จ'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('auth_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    toast.success('ออกจากระบบแล้ว')
  }

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}