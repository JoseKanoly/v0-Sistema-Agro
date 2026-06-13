"use server"

import { cookies } from "next/headers"
import { usuariosMock } from "@/lib/mock/users"

const COOKIE_KEY = "sisacad.session"

export async function getCurrentPerfil() {
  const cookieStore = await cookies()
  const correo = cookieStore.get(COOKIE_KEY)?.value
  if (!correo) return null
  const user = usuariosMock.find((u) => u.correo.toLowerCase() === correo.toLowerCase())
  if (!user) return null
  return {
    user: { id: String(user.id), name: `${user.nombres} ${user.apellidos}`, email: user.correo },
    perfil: { rol: user.rol.toLowerCase() as string, carreraId: user.carreraId },
  }
}

export async function signInAction(correo: string, _password: string) {
  const e = correo.toLowerCase().trim()
  const user = usuariosMock.find((u) => u.correo.toLowerCase() === e)
  if (!user) return { ok: false as const, error: "No existe un usuario con ese correo." }
  if (user.estado !== "activo") return { ok: false as const, error: "La cuenta está inactiva." }
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_KEY, user.correo, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  })
  return { ok: true as const }
}

export async function signOutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_KEY)
}
