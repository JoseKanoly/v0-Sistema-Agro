"use server"

import { db } from "@/lib/db"
import { laboratorios, equiposLaboratorio, reactivos, practicasLaboratorio, asistenciaPractica } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "./auth"

// ── Laboratorios ──────────────────────────────────────────────────────────────
export async function getLaboratorios() {
  return db.select().from(laboratorios).orderBy(desc(laboratorios.id))
}

export async function createLaboratorio(data: { nombre: string; codigo: string; carreraId: number; capacidad: number; ubicacion?: string }) {
  await getUserId()
  await db.insert(laboratorios).values(data)
  revalidatePath("/dashboard/laboratorios")
}

export async function updateLaboratorio(id: number, data: { nombre?: string; capacidad?: number; ubicacion?: string; activo?: boolean }) {
  await getUserId()
  await db.update(laboratorios).set(data).where(eq(laboratorios.id, id))
  revalidatePath("/dashboard/laboratorios")
}

export async function deleteLaboratorio(id: number) {
  await getUserId()
  await db.delete(laboratorios).where(eq(laboratorios.id, id))
  revalidatePath("/dashboard/laboratorios")
}

// ── Equipos ───────────────────────────────────────────────────────────────────
export async function getEquipos(laboratorioId?: number) {
  const rows = await db.select().from(equiposLaboratorio).orderBy(desc(equiposLaboratorio.id))
  if (laboratorioId) return rows.filter((e) => e.laboratorioId === laboratorioId)
  return rows
}

export async function createEquipo(data: { laboratorioId: number; nombre: string; codigo: string; tipo: string; observacion?: string }) {
  await getUserId()
  await db.insert(equiposLaboratorio).values(data)
  revalidatePath("/dashboard/laboratorios/equipos")
}

export async function updateEquipo(id: number, data: { nombre?: string; tipo?: string; estado?: string; observacion?: string }) {
  await getUserId()
  await db.update(equiposLaboratorio).set(data).where(eq(equiposLaboratorio.id, id))
  revalidatePath("/dashboard/laboratorios/equipos")
}

export async function deleteEquipo(id: number) {
  await getUserId()
  await db.delete(equiposLaboratorio).where(eq(equiposLaboratorio.id, id))
  revalidatePath("/dashboard/laboratorios/equipos")
}

// ── Reactivos ─────────────────────────────────────────────────────────────────
export async function getReactivos(laboratorioId?: number) {
  const rows = await db.select().from(reactivos).orderBy(desc(reactivos.id))
  if (laboratorioId) return rows.filter((r) => r.laboratorioId === laboratorioId)
  return rows
}

export async function createReactivo(data: { laboratorioId: number; nombre: string; codigo: string; cantidad: number; unidad: string; stockMinimo: number }) {
  await getUserId()
  await db.insert(reactivos).values({ ...data, cantidad: String(data.cantidad), stockMinimo: String(data.stockMinimo) })
  revalidatePath("/dashboard/laboratorios/reactivos")
}

export async function updateReactivo(id: number, data: { nombre?: string; cantidad?: number; unidad?: string; stockMinimo?: number; estado?: string }) {
  await getUserId()
  const updateData: Record<string, unknown> = { ...data }
  if (data.cantidad !== undefined) updateData.cantidad = String(data.cantidad)
  if (data.stockMinimo !== undefined) updateData.stockMinimo = String(data.stockMinimo)
  await db.update(reactivos).set(updateData).where(eq(reactivos.id, id))
  revalidatePath("/dashboard/laboratorios/reactivos")
}

export async function deleteReactivo(id: number) {
  await getUserId()
  await db.delete(reactivos).where(eq(reactivos.id, id))
  revalidatePath("/dashboard/laboratorios/reactivos")
}

// ── Practicas ─────────────────────────────────────────────────────────────────
export async function getPracticas() {
  return db.select().from(practicasLaboratorio).orderBy(desc(practicasLaboratorio.fecha))
}

export async function createPractica(data: { laboratorioId: number; materiaId: number; titulo: string; descripcion?: string; fecha: string; horaInicio: string; horaFin: string }) {
  const uid = await getUserId()
  await db.insert(practicasLaboratorio).values({ ...data, docenteId: uid, estado: "programada" })
  revalidatePath("/dashboard/laboratorios/practicas")
}

export async function updatePractica(id: number, data: { titulo?: string; estado?: string; fecha?: string }) {
  await getUserId()
  await db.update(practicasLaboratorio).set(data).where(eq(practicasLaboratorio.id, id))
  revalidatePath("/dashboard/laboratorios/practicas")
}

export async function deletePractica(id: number) {
  await getUserId()
  await db.delete(practicasLaboratorio).where(eq(practicasLaboratorio.id, id))
  revalidatePath("/dashboard/laboratorios/practicas")
}

// ── Asistencia ────────────────────────────────────────────────────────────────
export async function getAsistenciaPractica(practicaId: number) {
  return db.select().from(asistenciaPractica).where(eq(asistenciaPractica.practicaId, practicaId))
}

export async function registrarAsistencia(data: { practicaId: number; estudianteId: string; asistio: boolean; observacion?: string }) {
  await getUserId()
  await db.insert(asistenciaPractica).values(data)
  revalidatePath("/dashboard/laboratorios/practicas")
}
