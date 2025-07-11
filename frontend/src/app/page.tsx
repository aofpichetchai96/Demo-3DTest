'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProductCard } from '@/components/ProductCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SearchBar } from '@/components/SearchBar'
import { UserCollections } from '@/components/UserCollections'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/utils/api'
import { Product, Category } from '@/types'

export default function HomePage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    loadCategories()
    loadProducts()
  }, [selectedCategory, searchTerm, currentPage])

  const loadCategories = async () => {
    try {
      const response = await api.get('/products/categories/all')
      setCategories(response.data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: ((currentPage - 1) * ITEMS_PER_PAGE).toString(),
      })

      if (selectedCategory) {
        params.append('category_id', selectedCategory)
      }

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await api.get(`/products?${params}`)
      setProducts(response.data.products)
      setTotalPages(Math.ceil(response.data.pagination.total / ITEMS_PER_PAGE))
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            สร้างสรรค์ผลิตภัณฑ์ 3D ของคุณ
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            ปรับแต่งและสร้างคอลเลกชันผลิตภัณฑ์ 3D ได้อย่างง่ายดาย
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} placeholder="ค้นหาสินค้า..." />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Collections (for logged in users) */}
        {user && (
          <div className="mb-8">
            <UserCollections />
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ก่อนหน้า
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ถัดไป
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              ไม่พบสินค้าที่ตรงกับการค้นหา
            </h3>
            <p className="text-gray-500">
              ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
            </p>
          </div>
        )}
      </div>
    </div>
  )
}