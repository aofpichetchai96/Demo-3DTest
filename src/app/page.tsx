"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Palette, Layers, Zap } from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              รองเท้านันยาง
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}OEM
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              ออกแบบและสั่งผลิตรองเท้านันยางตามความต้องการของคุณ 
              พร้อมเครื่องมือ 3D และระบบจัดการที่ครบครัน
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
              >
                <span>เริ่มต้นใช้งาน</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/customizer"
                className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                ดูตัวอย่างการออกแบบ
              </Link>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              ทำไมต้องเลือกเรา?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              เราให้บริการที่ครบครันตั้งแต่การออกแบบไปจนถึงการผลิต
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center backdrop-blur-sm">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                เครื่องมือ 3D ที่ล้ำสมัย
              </h3>
              <p className="text-gray-400">
                ออกแบบรองเท้าด้วยเครื่องมือ 3D ที่ใช้งานง่าย 
                ดูผลลัพธ์ได้แบบเรียลไทม์
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center backdrop-blur-sm">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Layers size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                วัสดุคุณภาพสูง
              </h3>
              <p className="text-gray-400">
                เลือกจากวัสดุคุณภาพสูงหลากหลายประเภท 
                ทั้งยางธรรมชาติและหนังแท้
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center backdrop-blur-sm">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                ระบบจัดการครบครัน
              </h3>
              <p className="text-gray-400">
                จัดการคอลเล็กชั่น ใบเสนอราคา และใบแจ้งหนี้ 
                ได้ในที่เดียว
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              วิธีการใช้งาน
            </h2>
            <p className="text-gray-400 text-lg">
              เพียง 4 ขั้นตอนง่ายๆ ก็ได้รองเท้าในแบบที่คุณต้องการ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-white font-semibold mb-2">เลือกรุ่น</h3>
              <p className="text-gray-400 text-sm">เลือกรุ่นรองเท้าที่ต้องการ</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-white font-semibold mb-2">ปรับแต่ง</h3>
              <p className="text-gray-400 text-sm">เลือกสี วัสดุ และขนาด</p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-white font-semibold mb-2">ดูตัวอย่าง</h3>
              <p className="text-gray-400 text-sm">ดูรองเท้าในมุมมอง 3D</p>
            </div>

            <div className="text-center">
              <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                4
              </div>
              <h3 className="text-white font-semibold mb-2">สั่งผลิต</h3>
              <p className="text-gray-400 text-sm">สั่งผลิตและรอรับสินค้า</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            พร้อมที่จะเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            เข้าสู่ระบบเพื่อเริ่มออกแบบรองเท้าในแบบที่คุณต้องการ
          </p>
          <Link
            href="/login"
            className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 inline-flex items-center space-x-2 transform hover:scale-105"
          >
            <span>เข้าสู่ระบบ</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white font-bold text-2xl mb-4">รองเท้านันยาง OEM</div>
          <p className="text-gray-400 mb-4">
            ออกแบบรองเท้าตามความต้องการของคุณ
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 รองเท้านันยาง OEM. สงวนลิขสิทธิ์.
          </p>
        </div>
      </footer>
    </div>
  )
}
