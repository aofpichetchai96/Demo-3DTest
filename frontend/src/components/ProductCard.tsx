'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { getDownloadUrl } from '@/utils/api'
import { Heart, Eye, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const thumbnailUrl = product.thumbnail_path 
    ? getDownloadUrl(product.thumbnail_path)
    : '/placeholder-product.jpg'

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    // TODO: Implement actual like functionality
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement quick view modal
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement add to cart functionality
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {!imageError ? (
            <Image
              src={thumbnailUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-sm">ไม่มีรูปภาพ</p>
              </div>
            </div>
          )}
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={handleQuickView}
              className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="ดูด่วน"
            >
              <Eye size={18} className="text-gray-700" />
            </button>
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white hover:bg-gray-100'
              }`}
              title="ถูกใจ"
            >
              <Heart 
                size={18} 
                className={isLiked ? 'text-white fill-current' : 'text-gray-700'} 
              />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        {product.category_name && (
          <div className="absolute top-2 left-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {product.category_name}
            </span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-white bg-opacity-90 text-gray-800 text-sm font-semibold px-2 py-1 rounded-full">
            ฿{product.base_price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Customizable Parts */}
        {product.customizable_parts && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {Object.entries(product.customizable_parts).map(([part, options]) => (
                <span
                  key={part}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {part === 'colors' ? 'สี' : 
                   part === 'materials' ? 'วัสดุ' : 
                   part === 'logos' ? 'โลโก้' : part}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            href={`/products/${product.id}/customize`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            ปรับแต่ง
          </Link>
          <button
            onClick={handleAddToCart}
            className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
            title="เพิ่มไปยังรถเข็น"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}