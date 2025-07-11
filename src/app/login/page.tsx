"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">OEM</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            รองเท้านันยาง OEM
          </h1>
          <p className="text-gray-400">
            เข้าสู่ระบบเพื่อเริ่มออกแบบรองเท้าของคุณ
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                อีเมล
              </label>
              <input
                {...register("email")}
                type="email"
                className={cn(
                  "w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                  errors.email && "border-red-500 focus:ring-red-500"
                )}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                    errors.password && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>

            {/* Error Message */}
            {errors.root && (
              <div className="text-center text-red-400 text-sm">
                {errors.root.message}
              </div>
            )}
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-black/20 rounded-lg border border-white/10">
            <h3 className="text-sm font-medium text-white mb-2">บัญชีทดสอบ:</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p>• Admin: admin@example.com / password123</p>
              <p>• User: user@example.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
