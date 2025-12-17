'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../core/auth'
import { useToast } from '../core/toast'

import Loading from '../ui/Loading'

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (
        profile &&
        profile.role !== 'DRIVER' &&
        profile.role !== 'ADMIN'
      ) {
        // Redirect to the correct role page
        if (profile.role === 'OFFICER') {
          toast.info('Redirecting to Officer Dashboard')
          router.push('/officer')
        } else {
          router.push('/')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, loading, router])

  if (loading) return <Loading />
  if (
    !user ||
    (profile && profile.role !== 'DRIVER' && profile.role !== 'ADMIN')
  )
    return null

  return <>{children}</>
}
