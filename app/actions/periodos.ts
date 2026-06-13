"use server"

import { db } from "@/lib/db"
import { periodos } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "./auth"

export async function getPeriodos() {
  return db.select().from(periodos).orderBy(desc(periodos.id))
}

export async function createPeriodo(data: { nombre: string; fechaInicio: string; fechaFin: string; activo?: boolean }) {
  await getUserId()
  await db.insert(periodos).values(data)
  revalidatePath("/dashboard/admin/periodos")
}

export async function updatePeriodo(id: number, data: { nombre?: string; fechaInicio?: string; fechaFin?: string; activo?: boolean }) {
  await getUserId()
  await db.update(periodos).set(data).where(eq(periodos.id, id))
  revalidatePath("/dashboard/admin/periodos")
}

export async function deletePeriodo(id: number) {
  await getUserId()
  await db.delete(periodos).where(eq(periodos.id, id))
  revalidatePath("/dashboard/admin/periodos")
}

export async function activarPeriodo(id: number) {
  await getUserId()
  await db.update(periodos).set({ activo: false })
  await db.update(periodos).set({ activo: true }).where(eq(periodos.id, id))
  revalidatePath("/dashboard/admin/periodos")
}
