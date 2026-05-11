'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile, Role, Permiso } from '@/lib/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  role: Role | null
  permissions: string[]
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  const fetchUserData = async (userId: string) => {
    // Fetch profile with role
    const { data: profileData } = await supabase
      .from('profiles')
      .select(`
        *,
        rol:roles(*)
      `)
      .eq('id', userId)
      .single()

    if (profileData) {
      setProfile(profileData as Profile)
      setRole(profileData.rol as Role)

      // Fetch permissions for the role
      if (profileData.rol_id) {
        const { data: rolePermisos } = await supabase
          .from('roles_permisos')
          .select(`
            permiso:permisos(nombre)
          `)
          .eq('rol_id', profileData.rol_id)

        const permisoNames = rolePermisos?.map((rp: { permiso: { nombre: string } }) => rp.permiso.nombre) || []
        
        // Also fetch extra permissions for the user
        const { data: extraPermisos } = await supabase
          .from('usuarios_permisos_extra')
          .select(`
            permiso:permisos(nombre)
          `)
          .eq('user_id', userId)

        const extraPermisoNames = extraPermisos?.map((ep: { permiso: { nombre: string } }) => ep.permiso.nombre) || []
        
        setPermissions([...new Set([...permisoNames, ...extraPermisoNames])])
      }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await fetchUserData(user.id)
      }
      
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserData(session.user.id)
      } else {
        setProfile(null)
        setRole(null)
        setPermissions([])
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setRole(null)
    setPermissions([])
  }

  return (
    <AuthContext.Provider value={{ user, profile, role, permissions, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to check if user has a specific permission
export function usePermission(permission: string): boolean {
  const { permissions, role } = useAuth()
  
  // Super admin has all permissions
  if (role?.nombre === 'super_admin') return true
  
  return permissions.includes(permission)
}

// Hook to check if user has any of the specified permissions
export function useAnyPermission(permissionList: string[]): boolean {
  const { permissions, role } = useAuth()
  
  if (role?.nombre === 'super_admin') return true
  
  return permissionList.some(p => permissions.includes(p))
}

// Hook to check if user has all of the specified permissions
export function useAllPermissions(permissionList: string[]): boolean {
  const { permissions, role } = useAuth()
  
  if (role?.nombre === 'super_admin') return true
  
  return permissionList.every(p => permissions.includes(p))
}
