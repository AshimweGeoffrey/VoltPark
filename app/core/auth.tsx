'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { Profile } from './types'

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timed out')
        setLoading(false)
      }
    }, 4000)

    // Check active session
    const initSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        if (mounted) setLoading(false)
      }
    }

    // Only run initSession if we don't have a session yet
    if (!session) {
      initSession()
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      // If we are already loading, let the initSession handle it to avoid race conditions
      // unless it's a SIGNED_OUT event
      if (loading && event !== 'SIGNED_OUT') return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Only fetch profile if we don't have it or if the user ID changed
        // This prevents infinite loops if fetchProfile triggers an update
        if (!profile || profile.id !== session.user.id) {
          await fetchProfile(session.user)
        }
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userObj: User) => {
    const userId = userObj.id
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found, attempt to create one
          console.log(
            'Profile not found for user',
            userId,
            '- creating default profile'
          )
          // Try to get name from metadata
          const metaName =
            userObj.user_metadata?.full_name ||
            userObj.user_metadata?.name ||
            userObj.email?.split('@')[0] ||
            'New User'

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: metaName,
              role: 'DRIVER',
              balance: 0,
              updated_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creating default profile:', createError)
          } else if (newProfile) {
            const mappedProfile: Profile = {
              id: newProfile.id,
              fullName: newProfile.full_name,
              role: newProfile.role,
              balance: newProfile.balance,
              phoneNumber: newProfile.phone_number,
              createdAt: newProfile.created_at,
              updatedAt: newProfile.updated_at,
            }
            setProfile(mappedProfile)
            // Return early since we've handled the profile setting
            setLoading(false)
            return
          }
        } else {
          console.error(
            'Error fetching profile:',
            JSON.stringify(error, null, 2)
          )
        }
      }

      if (data) {
        // Self-healing: If name is "New User" but we have metadata, update it
        const metaName =
          userObj.user_metadata?.full_name || userObj.user_metadata?.name

        if (
          data.full_name === 'New User' &&
          metaName &&
          metaName !== 'New User'
        ) {
          console.log('Updating "New User" to metadata name:', metaName)
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: metaName,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId)

          if (!updateError) {
            data.full_name = metaName
          }
        }

        // Map snake_case DB fields to camelCase TypeScript interface
        const mappedProfile: Profile = {
          id: data.id,
          fullName: data.full_name,
          role: data.role,
          balance: data.balance,
          phoneNumber: data.phone_number,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
        setProfile(mappedProfile)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
