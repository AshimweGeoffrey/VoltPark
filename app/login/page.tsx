'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import logo from '../logo.png'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../core/auth'

export default function LoginPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      const role = profile?.role || 'DRIVER'
      if (role === 'ADMIN') {
        router.push('/admin')
      } else if (role === 'OFFICER') {
        router.push('/officer')
      } else {
        router.push('/driver')
      }
    }
  }, [user, profile, authLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // No manual redirect here. The useEffect above will handle it
      // once the global auth state updates.
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--background)]">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-32 py-12 relative z-10 bg-[var(--background)]">
        <div className="w-full max-w-md mx-auto space-y-8">
          <Link
            href="/"
            className="inline-block mb-8 hover:opacity-80 transition-opacity"
          >
            <Image
              src={logo}
              alt="VoltPark logo"
              width={160}
              height={42}
              className="h-10 w-auto"
            />
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Welcome back
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              disabled={loading}
              className="w-full h-12 text-base shadow-lg shadow-[var(--primary)]/20"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--background)] px-2 text-[var(--muted-foreground)]">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-12 border-[var(--border)] hover:bg-[var(--secondary)]"
              type="button"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="h-12 border-[var(--border)] hover:bg-[var(--secondary)]"
              type="button"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-[var(--muted-foreground)]">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-[var(--primary)]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <div className="hidden md:block md:w-1/2 lg:w-[60%] relative bg-[var(--foreground)]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?q=80&w=2572&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent"></div>
        <div className="absolute bottom-20 left-20 right-20 text-white z-20">
          <h2 className="text-4xl font-bold mb-6">
            Smart Parking for Modern Cities
          </h2>
          <p className="text-lg text-gray-300 max-w-md">
            Experience seamless parking management with real-time availability,
            automated payments, and smart enforcement.
          </p>
        </div>
      </div>
    </div>
  )
}
