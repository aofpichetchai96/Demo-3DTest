"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRight, 
  Palette, 
  Layers, 
  Zap, 
  Play,
  Star,
  Users,
  CheckCircle,
  Sparkles,
  MousePointer,
  Eye
} from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="loading-spinner mb-6"></div>
          <p className="text-xl font-medium">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02 + 100}px`,
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float"
          style={{
            right: `${mousePosition.x * -0.01}px`,
            bottom: `${mousePosition.y * -0.01 + 200}px`,
            animationDelay: '2s'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 transform translate-y-96"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 text-sm font-medium text-white border border-white/20 animate-fade-in">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                ระบบ 3D ใหม่ล่าสุด
              </div>

              {/* Main Heading */}
              <div className="space-y-4 animate-slide-up">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                  รองเท้านันยาง
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                    OEM Premium
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  ออกแบบและสั่งผลิตรองเท้านันยางคุณภาพสูง ด้วยเทคโนโลยี 3D ที่ล้ำสมัย
                  <br />
                  <span className="text-blue-400 font-semibold">เริ่มต้นเพียง 3 นาที</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <Link
                  href="/login"
                  className="group btn-primary px-8 py-4 text-lg font-bold shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center space-x-3">
                    <span>เริ่มต้นออกแบบ</span>
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/customizer"
                  className="group glass-effect border-2 border-white/30 hover:border-white/50 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <span className="flex items-center space-x-3">
                    <Play size={20} className="group-hover:scale-110 transition-transform" />
                    <span>ดูตัวอย่าง 3D</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="relative">
                <Image 
                  src="/images/homepage42.jpg"
                  alt="รองเท้านันยาง OEM Premium - ตัวอย่างผลิตภัณฑ์"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                
                {/* Floating badge */}
                <div className="absolute top-4 right-4 glass-effect rounded-full px-4 py-2 text-white text-sm font-medium border border-white/20">
                  <span className="text-green-400">●</span> NANYANG
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div> */}
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 text-sm font-medium text-blue-400 border border-blue-500/30 mb-8">
              <Zap className="h-4 w-4 mr-2" />
              ทำไมต้องเลือกเรา
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              เทคโนโลยีที่ล้ำสมัย
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              เราให้บริการที่ครบครันด้วยเทคโนโลยีขั้นสูงที่จะทำให้การออกแบบของคุณเป็นจริง
            </p>
          </div>

          {/* Product Showcase */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <Image 
                      src="/images/nanyang-1.jpg"
                      alt="รองเท้านันยาง OEM - ตัวอย่างผลิตภัณฑ์ 1"
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-semibold">รองเท้าในตำนาน</div>
                      <div className="text-xs text-gray-200">วัสดุพรีเมียม</div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <Image 
                      src="/images/homepage6.jpg"
                      alt="รองเท้านันยาง OEM - ตัวอย่างผลิตภัณฑ์ 2"
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300 brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-semibold">Changdao Basic</div>
                      <div className="text-xs text-gray-200">สไตล์อยู่เหนือกาลเวลา</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="glass-effect rounded-2xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    ผลงานที่น่าประทับใจ
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    ตัวอย่างรองเท้านันยางคุณภาพสูงที่ผลิตด้วยเทคโนโลยีล้ำสมัย 
                    และความใส่ใจในทุกรายละเอียด
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-green-400">
                      <CheckCircle size={16} className="mr-2" />
                      <span>ผ่านการรับรอง</span>
                    </div>
                    <div className="flex items-center text-blue-400">
                      <Star size={16} className="mr-2" />
                      <span>คุณภาพระดับสากล</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group card hover-lift relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center p-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Palette size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  เครื่องมือ 3D ที่ล้ำสมัย
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  ออกแบบรองเท้าด้วยเครื่องมือ 3D ที่ใช้งานง่าย 
                  ดูผลลัพธ์ได้แบบเรียลไทม์ในทุกมุมมอง
                </p>
                <div className="mt-4 flex items-center justify-center text-blue-400 font-semibold">
                  <MousePointer size={16} className="mr-2" />
                  ใช้งานเลย
                </div>
              </div>
            </div>

            <div className="group card hover-lift relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center p-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Layers size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  วัสดุคุณภาพสูง
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  เลือกจากวัสดุคุณภาพสูงหลากหลายประเภท 
                  ทั้งยางธรรมชาติและหนังแท้ระดับพรีเมียม
                </p>
                <div className="mt-4 flex items-center justify-center text-purple-400 font-semibold">
                  <Star size={16} className="mr-2" />
                  รับประกันคุณภาพ
                </div>
              </div>
            </div>

            <div className="group card hover-lift relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center p-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  ระบบจัดการครบครัน
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  จัดการคอลเล็กชั่น ใบเสนอราคา 
                  ได้ในที่เดียวอย่างสะดวก
                </p>
                <div className="mt-4 flex items-center justify-center text-green-400 font-semibold">
                  <Users size={16} className="mr-2" />
                  ใช้งานง่าย
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center glass-effect rounded-full px-8 py-4 text-sm font-medium text-green-400 border border-green-500/30 mb-10 shadow-lg backdrop-blur-md">
              <CheckCircle className="h-5 w-5 mr-3 animate-pulse" />
              วิธีการใช้งาน
            </div>
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              เพียง <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">4 ขั้นตอน</span>ง่ายๆ
            </h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              ใช้เวลาเพียงไม่กี่นาทีก็ได้รองเท้าในแบบที่คุณต้องการ
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center group relative">
              <div className="relative mb-8">
                {/* Glowing background circle */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Main icon container */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-blue-400/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                  <span className="text-white font-black text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300">1</span>
                  
                  {/* Floating particles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.3s' }}></div>
                </div>
                
                {/* Connection line to next step */}
                <div className="hidden lg:block absolute top-12 left-24 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 opacity-30"></div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-blue-300 transition-colors duration-300">เลือกรุ่น</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  เลือกรุ่นรองเท้าจากแบบที่หลากหลาย
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-purple-400/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                  <span className="text-white font-black text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300">2</span>
                  
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.3s' }}></div>
                </div>
                
                <div className="hidden lg:block absolute top-12 left-24 w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-green-500/50 opacity-30"></div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-purple-300 transition-colors duration-300">ปรับแต่ง</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  เลือกสี วัสดุ และขนาดตามใจชอบ
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-green-400/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                  <span className="text-white font-black text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300">3</span>
                  
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.3s' }}></div>
                </div>
                
                <div className="hidden lg:block absolute top-12 left-24 w-full h-0.5 bg-gradient-to-r from-green-500/50 to-red-500/50 opacity-30"></div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-green-300 transition-colors duration-300">ดูตัวอย่าง</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  ดูรองเท้าในมุมมอง 3D แบบเรียลไทม์
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="text-center group relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-600/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-red-400/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                  <span className="text-white font-black text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300">4</span>
                  
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.3s' }}></div>
                  
                  {/* Success sparkles */}
                  <div className="absolute top-0 right-0 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-red-300 transition-colors duration-300">สั่งผลิต</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  สั่งผลิตและรอรับสินค้าคุณภาพสูง
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/10">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              <span className="text-white font-semibold text-lg">เริ่มต้นได้ทันที ไม่ต้องรอ!</span>
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
     

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="glass-effect rounded-3xl p-8 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4">
              พร้อมที่จะเริ่มต้นแล้วหรือยัง?
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              เข้าสู่ระบบเพื่อเริ่มออกแบบรองเท้าในแบบที่คุณต้องการ
              <br />
              <span className="text-blue-400 font-semibold">ทดลองใช้ฟรี ไม่เสียค่าใช้จ่าย</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="btn-primary px-10 py-5 text-lg font-bold shadow-glow-lg hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-3">
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight size={20} />
                </span>
              </Link>
              <Link
                href="/customizer"
                className="glass-effect border-2 border-white/30 hover:border-white/50 text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center space-x-3">
                  <Eye size={18} />
                  <span>ดูตัวอย่างก่อน</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-white font-black text-2xl mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              รองเท้านันยาง OEM Premium
            </div>
            <p className="text-gray-400 mb-6 text-base">
              ออกแบบรองเท้าตามความต้องการของคุณด้วยเทคโนโลยี 3D ที่ล้ำสมัย
            </p>
            <div className="flex justify-center space-x-8 mb-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">เกี่ยวกับเรา</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">บริการ</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">ติดต่อ</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">ช่วยเหลือ</a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 รองเท้านันยาง OEM Premium. สงวนลิขสิทธิ์ทุกประการ.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
