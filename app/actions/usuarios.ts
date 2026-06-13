"use server"

import { db } from "@/lib/db"
import { perfiles, user } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "./auth"
import { auth } from "@/lib/auth"

export async function getUsuarios() {
  await getUserId()
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      rol: perfiles.rol,
      carreraId: perfiles.carreraId,
      cedula: perfiles.cedula,
      telefono: perfiles.telefono,
      perfilId: perfiles.id,
    })
    .from(user)
    .leftJoin(perfiles, eq(perfiles.userId, user.id))
    .orderBy(desc(user.createdAt))
  return rows
}

export async function createUsuario(data: {
  name: string
  email: string
  password: string
  rol: string
  carreraId?: number | null
  cedula?: string
  telefono?: string
}) {
  await getUserId()
  const ctx = await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  })
  if (ctx?.user?.id) {
    await db.insert(perfiles).values({
      userId: ctx.user.id,
      rol: data.rol,
      carreraId: data.carreraId ?? null,
      cedula: data.cedula ?? null,
      telefono: data.telefono ?? null,
    })
  }
  revalidatePath("/dashboard/admin/usuarios")
  return ctx
}

export async function updateUsuario(
  userId: string,
  data: { rol?: string; carreraId?: number | null; cedula?: string; telefono?: string; direccion?: string }
) {
  await getUserId()
  const existing = await db.select().from(perfiles).where(eq(perfiles.userId, userId))
  if (existing.length > 0) {
    await db.update(perfiles).set(data).where(eq(perfiles.userId, userId))
  } else {
    await db.insert(perfiles).values({ userId, ...data })
  }
  revalidatePath("/dashboard/admin/usuarios")
}

export async function deleteUsuario(targetUserId: string) {
  await getUserId()
  await db.delete(perfiles).where(eq(perfiles.userId, targetUserId))
  await db.delete(user).where(eq(user.id, targetUserId))
  revalidatePath("/dashboard/admin/usuarios")
}
