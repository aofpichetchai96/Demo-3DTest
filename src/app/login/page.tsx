"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      console.log("🔑 Login attempt:", data)
      
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      })

      console.log("📊 Login result:", result)

      if (result?.error) {
        console.log("❌ Login error:", result.error)
        setError("root", {
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
        })
      } else {
        console.log("✅ Login successful, redirecting...")
        const session = await getSession()
        if (session) {
          router.push("/dashboard")
        }
      }
    } catch (error) {
      console.log("💥 Login exception:", error)
      setError("root", {
        message: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse top-20 left-20"></div>
        <div className="absolute w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse bottom-20 right-20 animation-delay-2s"></div>
        <div className="absolute w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animation-delay-4s"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6 group">
            <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl w-24 h-24 mx-auto flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/20">
              <Image 
                src="/images/logo-nanyang.png" 
                alt="Nanyang Logo" 
                width={80} 
                height={80} 
                className="object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </Link>
          <h1 className="text-4xl font-black text-white mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            รองเท้านันยาง OEM
          </h1>
          {/* <p className="text-gray-300 text-lg font-medium">
            เข้าสู่ระบบเพื่อเริ่มออกแบบรองเท้าของคุณ
          </p> */}
          <div className="w-40 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Login Form */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">ยินดีต้อนรับ</h2>
            <p className="text-gray-300">กรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-white/90">
                อีเมล
              </label>
              <div className="relative group">
                <input
                  {...register("email")}
                  type="email"
                  className={cn(
                    "w-full px-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm group-hover:bg-white/15",
                    errors.email && "border-red-400 focus:ring-red-400"
                  )}
                  placeholder="your@email.com"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-white/90">
                รหัสผ่าน
              </label>
              <div className="relative group">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "w-full px-4 py-4 pr-14 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm group-hover:bg-white/15",
                    errors.password && "border-red-400 focus:ring-red-400"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
                isLoading && "opacity-70 cursor-not-allowed hover:scale-100"
              )}
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>กำลังเข้าสู่ระบบ...</span>
                </div>
              ) : (
                <>
                  <LogIn size={22} />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>

            {/* Error Message */}
            {errors.root && (
              <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
                <p className="text-red-400 text-sm flex items-center justify-center space-x-2">
                  <span>❌</span>
                  <span>{errors.root.message}</span>
                </p>
              </div>
            )}
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-6 bg-gradient-to-r from-black/20 to-black/10 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-bold text-white">บัญชีทดสอบ</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-300">👤 Admin</p>
                    <p className="text-xs text-gray-300">admin@example.com</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">รหัสผ่าน:</p>
                    <p className="text-sm font-mono text-white">password123</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-300">👥 User</p>
                    <p className="text-xs text-gray-300">user@example.com</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">รหัสผ่าน:</p>
                    <p className="text-sm font-mono text-white">password123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
