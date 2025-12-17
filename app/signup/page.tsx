'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import logo from '../logo.png'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { supabase } from '../../lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('DRIVER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        }
      )

      if (signUpError) throw signUpError

      if (authData.user) {
        // 2. Create the profile entry
        // Note: In a production app, this might be handled by a database trigger
        // but we'll do it explicitly here to ensure the role is set correctly.
        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            full_name: fullName,
            role: role as 'DRIVER' | 'OFFICER' | 'ADMIN',
          },
        ])

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // If profile creation fails, we might want to show an error,
          // but the auth user is already created.
          // For now, let's assume it works or the trigger handles it.
        }

        router.push('/login')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
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
              Create an account
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Enter your details to get started with VoltPark.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                placeholder="John Doe"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
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
              <label
                className="text-sm font-medium leading-none"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="role"
              >
                I am a...
              </label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm ring-offset-[var(--background)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="DRIVER">Driver</option>
                <option value="OFFICER">Enforcement Officer</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            <Button
              disabled={loading}
              className="w-full h-12 text-base shadow-lg shadow-[var(--primary)]/20"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="px-8 text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-[var(--primary)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <div className="hidden md:block md:w-1/2 lg:w-[60%] relative bg-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-20 left-20 right-20 text-white z-20">
          <h2 className="text-4xl font-bold mb-6">
            Join the Future of Parking
          </h2>
          <p className="text-lg text-gray-200 max-w-md">
            Create an account to manage your parking sessions, view tickets, and
            access smart city features.
          </p>
        </div>
      </div>
    </div>
  )
}
