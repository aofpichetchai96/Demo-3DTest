'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, Settings, Home, Palette, Database, Shield, Crown, User } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import Image from 'next/image'

export default function Navigation() {
  const { data: session, status } = useSession()

  // Don't show navigation if user is not authenticated
  if (status === 'loading') {
    return null // หรือแสดง loading skeleton ถ้าต้องการ
  }

  if (!session) {
    return null // ไม่แสดง navbar เมื่อไม่ได้ login
  }

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
                <div>
                    <Image 
                        src="/images/logo-nanyang.png" 
                        alt="Nanyang Logo" 
                        width={40} 
                        height={40} 
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                        priority
                    />
                </div>
            </Link>


            <div className="hidden md:flex ml-8 space-x-8">
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                href="/customizer" 
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Palette className="w-4 h-4" />
                <span>Customizer</span>
              </Link>
              
              <Link 
                href="/collections" 
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Collections</span>
              </Link>

              <Link 
                href="/model-configs" 
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Database className="w-4 h-4" />
                <span>Models</span>
              </Link>

              {session?.user?.role === 'admin' && (
                <Link 
                  href="/admin/users" 
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Theme toggle and user menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <div className="flex items-center space-x-3">
               
            <span className="flex items-center space-x-2 text-sm text-muted-foreground">
                {session.user?.role === 'admin' && (
                    <Crown className="text-yellow-400" size={18} />
                )}
                {session.user?.role === 'user' && (
                    <User size={20} />
                )}
                <span>{session.user?.name || session.user?.email}</span>
            </span>
              <button
                onClick={() => signOut()}
                 className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-border">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/dashboard"
            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
          >
            Dashboard
          </Link>
          <Link
            href="/customizer"
            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
          >
            Customizer
          </Link>
          <Link
            href="/collections"
            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
          >
            Collections
          </Link>
          <Link
            href="/model-configs"
            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
          >
            Models
          </Link>
          {session?.user?.role === 'admin' && (
            <Link
              href="/admin/users"
              className="block px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-accent rounded-md"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
