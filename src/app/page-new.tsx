"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 text-sm font-medium text-white border border-white/20 animate-fade-in">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
              ระบบ 3D ใหม่ล่าสุด
            </div>

            {/* Main Heading */}
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
                รองเท้านันยาง
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                  OEM Premium
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                ออกแบบและสั่งผลิตรองเท้านันยางคุณภาพสูง ด้วยเทคโนโลยี 3D ที่ล้ำสมัย
                <br />
                <span className="text-blue-400 font-semibold">เริ่มต้นเพียง 3 นาที</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/login"
                className="group btn-primary px-10 py-5 text-lg font-bold shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-3">
                  <span>เริ่มต้นออกแบบ</span>
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/customizer"
                className="group glass-effect border-2 border-white/30 hover:border-white/50 text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <span className="flex items-center space-x-3">
                  <Play size={20} className="group-hover:scale-110 transition-transform" />
                  <span>ดูตัวอย่าง 3D</span>
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1000+</div>
                <div className="text-gray-400 text-sm">ลูกค้าพอใจ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-gray-400 text-sm">แบบให้เลือก</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400 text-sm">ให้บริการ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 text-sm font-medium text-blue-400 border border-blue-500/30 mb-8">
              <Zap className="h-4 w-4 mr-2" />
              ทำไมต้องเลือกเรา
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              เทคโนโลยีที่ล้ำสมัย
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              เราให้บริการที่ครบครันด้วยเทคโนโลยีขั้นสูงที่จะทำให้การออกแบบของคุณเป็นจริง
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group card hover-lift relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center p-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Palette size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  เครื่องมือ 3D ที่ล้ำสมัย
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  ออกแบบรองเท้าด้วยเครื่องมือ 3D ที่ใช้งานง่าย 
                  ดูผลลัพธ์ได้แบบเรียลไทม์ในทุกมุมมอง
                </p>
                <div className="mt-6 flex items-center justify-center text-blue-400 font-semibold">
                  <MousePointer size={16} className="mr-2" />
                  ลองใช้งานฟรี
                </div>
              </div>
            </div>

            <div className="group card hover-lift relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center p-8">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Layers size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  วัสดุคุณภาพสูง
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  เลือกจากวัสดุคุณภาพสูงหลากหลายประเภท 
                  ทั้งยางธรรมชาติและหนังแท้ระดับพรีเมียม
                </p>
                <div className="mt-6 flex items-center justify-center text-purple-400 font-semibold">
                  <Star size={16} className="mr-2" />
                  รับประกันคุณภาพ
                </div>
              </div>
            </div>

            <div className="group card hover-lift relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center p-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  ระบบจัดการครบครัน
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  จัดการคอลเล็กชั่น ใบเสนอราคา และติดตามสถานะ
                  ได้ในที่เดียวอย่างสะดวก
                </p>
                <div className="mt-6 flex items-center justify-center text-green-400 font-semibold">
                  <Users size={16} className="mr-2" />
                  ใช้งานง่าย
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-black/20 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 text-sm font-medium text-green-400 border border-green-500/30 mb-8">
              <CheckCircle className="h-4 w-4 mr-2" />
              วิธีการใช้งาน
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              เพียง 4 ขั้นตอนง่ายๆ
            </h2>
            <p className="text-gray-400 text-xl">
              ใช้เวลาเพียงไม่กี่นาทีก็ได้รองเท้าในแบบที่คุณต้องการ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <span className="text-white font-black text-2xl">1</span>
                </div>
                <div className="absolute -inset-2 bg-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">เลือกรุ่น</h3>
              <p className="text-gray-400">เลือกรุ่นรองเท้าจากแบบที่หลากหลาย</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <span className="text-white font-black text-2xl">2</span>
                </div>
                <div className="absolute -inset-2 bg-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">ปรับแต่ง</h3>
              <p className="text-gray-400">เลือกสี วัสดุ และขนาดตามใจชอบ</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <span className="text-white font-black text-2xl">3</span>
                </div>
                <div className="absolute -inset-2 bg-green-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">ดูตัวอย่าง</h3>
              <p className="text-gray-400">ดูรองเท้าในมุมมอง 3D แบบเรียลไทม์</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <span className="text-white font-black text-2xl">4</span>
                </div>
                <div className="absolute -inset-2 bg-red-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">สั่งผลิต</h3>
              <p className="text-gray-400">สั่งผลิตและรอรับสินค้าคุณภาพสูง</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              ลูกค้าพูดถึงเรา
            </h2>
            <p className="text-gray-400 text-xl">
              ความพอใจของลูกค้าคือสิ่งที่เราภูมิใจที่สุด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                &ldquo;คุณภาพรองเท้าดีมาก ใส่สบาย และการออกแบบ 3D ก็ใช้งานง่ายมาก เร็วด้วย!&rdquo;
              </p>
              <div className="font-semibold text-white">คุณนิรันดร์ จันทร์เพ็ญ</div>
              <div className="text-gray-400 text-sm">เจ้าของโรงงาน</div>
            </div>

            <div className="card text-center p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                &ldquo;ระบบจัดการครบครัน ติดตามได้ทุกขั้นตอน สะดวกมาก แนะนำเลยครับ&rdquo;
              </p>
              <div className="font-semibold text-white">คุณสมชาย วิเชียรชาญ</div>
              <div className="text-gray-400 text-sm">ผู้ประกอบการ</div>
            </div>

            <div className="card text-center p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                &ldquo;ทีมงานใส่ใจมาก ตอบคำถามได้ดี ผลิตภัณฑ์ออกมาตรงตามที่ต้องการ&rdquo;
              </p>
              <div className="font-semibold text-white">คุณรัตนา สุขเจริญ</div>
              <div className="text-gray-400 text-sm">นักออกแบบ</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="glass-effect rounded-3xl p-12 border border-white/20">
            <h2 className="text-5xl font-bold text-white mb-6">
              พร้อมที่จะเริ่มต้นแล้วหรือยัง?
            </h2>
            <p className="text-gray-300 text-xl mb-10 leading-relaxed">
              เข้าสู่ระบบเพื่อเริ่มออกแบบรองเท้าในแบบที่คุณต้องการ
              <br />
              <span className="text-blue-400 font-semibold">ทดลองใช้ฟรี ไม่เสียค่าใช้จ่าย</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/login"
                className="btn-primary px-12 py-6 text-xl font-bold shadow-glow-lg hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-3">
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight size={24} />
                </span>
              </Link>
              <Link
                href="/customizer"
                className="glass-effect border-2 border-white/30 hover:border-white/50 text-white font-bold px-12 py-6 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center space-x-3">
                  <Eye size={20} />
                  <span>ดูตัวอย่างก่อน</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-white font-black text-3xl mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              รองเท้านันยาง OEM Premium
            </div>
            <p className="text-gray-400 mb-8 text-lg">
              ออกแบบรองเท้าตามความต้องการของคุณด้วยเทคโนโลยี 3D ที่ล้ำสมัย
            </p>
            <div className="flex justify-center space-x-8 mb-8">
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
