"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { Usuario } from "@/lib/types/database"
import { usuariosMock, CORREO_DOCENTE_RE, CORREO_ESTUDIANTE_RE } from "@/lib/mock/users"

const STORAGE_KEY = "sisacad.session.correo"

interface AuthContextValue {
  user: Usuario | null
  loading: boolean
  signIn: (correo: string) => Promise<{ ok: true } | { ok: false; error: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function validarCorreo(correo: string) {
  const e = correo.toLowerCase().trim()
  return CORREO_DOCENTE_RE.test(e) || CORREO_ESTUDIANTE_RE.test(e)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Restaurar sesión al montar (100% local, sin backend)
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const found = usuariosMock.find((u) => u.correo.toLowerCase() === saved.toLowerCase())
      if (found) setUser(found)
    }
    setLoading(false)
  }, [])

  const signIn = useCallback<AuthContextValue["signIn"]>(async (correo) => {
    const e = correo.toLowerCase().trim()
    if (!validarCorreo(e)) {
      return {
        ok: false,
        error: "Correo inválido. Use formato nombre.apellido@uleam.edu.ec o eXXXXXXXXXX@live.uleam.edu.ec",
      }
    }
    const found = usuariosMock.find((u) => u.correo.toLowerCase() === e)
    if (!found) return { ok: false, error: "No existe un usuario con ese correo." }
    if (found.estado !== "activo") return { ok: false, error: "La cuenta está inactiva." }
    window.localStorage.setItem(STORAGE_KEY, found.correo)
    setUser(found)
    return { ok: true }
  }, [])

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    router.push("/login")
  }, [router])

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
