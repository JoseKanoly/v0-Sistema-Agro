"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { Usuario, UserRole } from "@/lib/types/database"
import { useData } from "@/lib/mock/store"

const STORAGE_KEY = "sispaa.session.userId"

interface AuthContextValue {
  user: Usuario | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>
  signOut: () => void
  registerEstudianteDocente: (
    data: Pick<Usuario, "nombres" | "apellidos" | "email" | "password" | "cedula"> & { carrera_id: Usuario["carrera_id"] },
  ) => Promise<{ ok: true } | { ok: false; error: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STUDENT_DOMAIN = "@live.uleam.edu.ec"
const STAFF_DOMAIN = "@uleam.edu.ec"

function detectRoleFromEmail(email: string): UserRole | null {
  const e = email.toLowerCase().trim()
  if (e.endsWith(STUDENT_DOMAIN)) return "estudiante"
  if (e.endsWith(STAFF_DOMAIN)) return "docente"
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { usuarios, setUsuarios } = useData()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Restaurar sesion al montar
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) setUserId(saved)
    setLoading(false)
  }, [])

  const user = userId ? usuarios.find((u) => u.id === userId) ?? null : null

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async (email, password) => {
      const found = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password,
      )
      if (!found) return { ok: false, error: "Credenciales invalidas." }
      if (!found.activo) return { ok: false, error: "Tu cuenta esta desactivada." }
      window.localStorage.setItem(STORAGE_KEY, found.id)
      setUserId(found.id)
      return { ok: true }
    },
    [usuarios],
  )

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    setUserId(null)
    router.push("/auth/login")
  }, [router])

  const registerEstudianteDocente = useCallback<AuthContextValue["registerEstudianteDocente"]>(
    async (data) => {
      const rol = detectRoleFromEmail(data.email)
      if (!rol) {
        return {
          ok: false,
          error: `Usa un correo institucional: ${STAFF_DOMAIN} (docente) o ${STUDENT_DOMAIN} (estudiante).`,
        }
      }
      const exists = usuarios.some((u) => u.email.toLowerCase() === data.email.toLowerCase())
      if (exists) return { ok: false, error: "Ya existe una cuenta con ese correo." }

      const nuevo: Usuario = {
        id: `u-${rol}-${Date.now()}`,
        cedula: data.cedula,
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        password: data.password,
        rol,
        carrera_id: data.carrera_id,
        activo: true,
        tiene_vinculacion: false,
        tiene_investigacion: false,
      }
      setUsuarios((prev) => [...prev, nuevo])
      window.localStorage.setItem(STORAGE_KEY, nuevo.id)
      setUserId(nuevo.id)
      return { ok: true }
    },
    [usuarios, setUsuarios],
  )

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, registerEstudianteDocente }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
