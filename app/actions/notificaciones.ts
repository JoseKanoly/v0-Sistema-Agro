"use server"

import { db } from "@/lib/db"
import { notificaciones, perfiles } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "./auth"

export async function getMisNotificaciones() {
  const uid = await getUserId()
  return db.select().from(notificaciones).where(eq(notificaciones.destinatarioId, uid)).orderBy(desc(notificaciones.createdAt))
}

export async function marcarLeida(id: number) {
  const uid = await getUserId()
  await db.update(notificaciones).set({ leida: true }).where(eq(notificaciones.id, id))
  revalidatePath("/dashboard/notificaciones")
}

export async function marcarTodasLeidas() {
  const uid = await getUserId()
  await db.update(notificaciones).set({ leida: true }).where(eq(notificaciones.destinatarioId, uid))
  revalidatePath("/dashboard/notificaciones")
}

export async function enviarNotificacionMasiva(data: { titulo: string; mensaje: string; audiencia: string; tipo?: string }) {
  await getUserId()
  const targetRol = data.audiencia
  const targets = await db.select({ userId: perfiles.userId }).from(perfiles).where(eq(perfiles.rol, targetRol))
  if (targets.length > 0) {
    await db.insert(notificaciones).values(
      targets.map((t) => ({
        destinatarioId: t.userId,
        titulo: data.titulo,
        mensaje: data.mensaje,
        tipo: data.tipo ?? "info",
      }))
    )
  }
  revalidatePath("/dashboard/notificaciones-masivas")
  return targets.length
}
