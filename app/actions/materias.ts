"use server"

import { db } from "@/lib/db"
import { materias } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "./auth"

export async function getMaterias(carreraId?: number) {
  const rows = await db.select().from(materias).orderBy(desc(materias.id))
  if (carreraId) return rows.filter((m) => m.carreraId === carreraId)
  return rows
}

export async function createMateria(data: {
  nombre: string; codigo: string; creditos: number
  carreraId: number; periodoId?: number; docenteId?: string
}) {
  await getUserId()
  await db.insert(materias).values(data)
  revalidatePath("/dashboard/admin/materias")
}

export async function updateMateria(id: number, data: {
  nombre?: string; codigo?: string; creditos?: number
  carreraId?: number; periodoId?: number | null; docenteId?: string | null; activa?: boolean
}) {
  await getUserId()
  await db.update(materias).set(data).where(eq(materias.id, id))
  revalidatePath("/dashboard/admin/materias")
}

export async function deleteMateria(id: number) {
  await getUserId()
  await db.delete(materias).where(eq(materias.id, id))
  revalidatePath("/dashboard/admin/materias")
}
