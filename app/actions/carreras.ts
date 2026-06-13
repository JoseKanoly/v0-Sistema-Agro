"use server"

import { db } from "@/lib/db"
import { carreras } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "./auth"

export async function getCarreras() {
  return db.select().from(carreras).orderBy(desc(carreras.createdAt))
}

export async function createCarrera(data: { nombre: string; codigo: string; coordinadorId?: string }) {
  await getUserId()
  await db.insert(carreras).values(data)
  revalidatePath("/dashboard/admin/carreras")
}

export async function updateCarrera(id: number, data: { nombre?: string; codigo?: string; coordinadorId?: string | null; activa?: boolean }) {
  await getUserId()
  await db.update(carreras).set({ ...data, updatedAt: new Date() }).where(eq(carreras.id, id))
  revalidatePath("/dashboard/admin/carreras")
}

export async function deleteCarrera(id: number) {
  await getUserId()
  await db.delete(carreras).where(eq(carreras.id, id))
  revalidatePath("/dashboard/admin/carreras")
}
