"use server"

import { db } from "@/lib/db"
import { convocatorias, notificaciones, perfiles, user } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "./auth"

export async function getConvocatorias() {
  return db.select().from(convocatorias).orderBy(desc(convocatorias.id))
}

export async function getConvocatoriasActivas(audiencia: "docentes" | "estudiantes") {
  const today = new Date().toISOString().split("T")[0]
  const all = await db.select().from(convocatorias).where(eq(convocatorias.activa, true))
  return all.filter(
    (c) =>
      (c.audiencia === audiencia || c.audiencia === "ambos") &&
      c.fechaLimite >= today
  )
}

export async function createConvocatoria(data: {
  tipo: string; titulo: string; descripcion?: string
  fechaApertura: string; fechaLimite: string
  audiencia: string; carreraId?: number | null
}) {
  const userId = await getUserId()
  const [conv] = await db
    .insert(convocatorias)
    .values({ ...data, creadaPor: userId, activa: true })
    .returning()

  // Notify target users
  const targetRol = data.audiencia === "estudiantes" ? "estudiante" : data.audiencia === "docentes" ? "docente" : null
  if (targetRol) {
    const targets = await db.select({ userId: perfiles.userId }).from(perfiles).where(eq(perfiles.rol, targetRol))
    if (targets.length > 0) {
      await db.insert(notificaciones).values(
        targets.map((t) => ({
          destinatarioId: t.userId,
          titulo: `Nueva convocatoria: ${data.titulo}`,
          mensaje: data.descripcion ?? `Tienes hasta el ${data.fechaLimite} para cumplir con la entrega.`,
          tipo: "convocatoria",
          link: "/dashboard/notificaciones",
        }))
      )
    }
  }
  revalidatePath("/dashboard/fechas-limite")
  return conv
}

export async function updateConvocatoria(id: number, data: {
  titulo?: string; descripcion?: string; fechaApertura?: string
  fechaLimite?: string; activa?: boolean
}) {
  await getUserId()
  await db.update(convocatorias).set(data).where(eq(convocatorias.id, id))
  revalidatePath("/dashboard/fechas-limite")
}

export async function deleteConvocatoria(id: number) {
  await getUserId()
  await db.delete(convocatorias).where(eq(convocatorias.id, id))
  revalidatePath("/dashboard/fechas-limite")
}
