"use server"

import { db } from "@/lib/db"
import { documentosEstudiante, silabos, informes, reportesVinculacion, justificaciones, notificaciones } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "./auth"

// ── Documentos Estudiante ─────────────────────────────────────────────────────
export async function getMisDocumentos() {
  const uid = await getUserId()
  return db.select().from(documentosEstudiante).where(eq(documentosEstudiante.estudianteId, uid)).orderBy(desc(documentosEstudiante.createdAt))
}

export async function getAllDocumentosEstudiante() {
  await getUserId()
  return db.select().from(documentosEstudiante).orderBy(desc(documentosEstudiante.createdAt))
}

export async function createDocumentoEstudiante(data: { tipo: string; titulo: string; convocatoriaId?: number }) {
  const uid = await getUserId()
  await db.insert(documentosEstudiante).values({
    estudianteId: uid,
    tipo: data.tipo,
    titulo: data.titulo,
    archivonombre: `${data.titulo}.pdf`,
    archivoUrl: `/mock-files/${data.tipo}-${Date.now()}.pdf`,
    convocatoriaId: data.convocatoriaId ?? null,
    estado: "pendiente",
  })
  revalidatePath("/dashboard/mis-documentos")
}

export async function reviewDocumentoEstudiante(id: number, estado: "aprobado" | "rechazado", observacion?: string) {
  const uid = await getUserId()
  const [doc] = await db.select().from(documentosEstudiante).where(eq(documentosEstudiante.id, id))
  await db.update(documentosEstudiante).set({ estado, observacion: observacion ?? null, revisadoPor: uid, revisadoAt: new Date() }).where(eq(documentosEstudiante.id, id))
  if (doc) {
    await db.insert(notificaciones).values({
      destinatarioId: doc.estudianteId,
      titulo: estado === "aprobado" ? "Documento aprobado" : "Documento rechazado",
      mensaje: `Tu documento "${doc.titulo}" fue ${estado}.${observacion ? ` Observacion: ${observacion}` : ""}`,
      tipo: estado === "aprobado" ? "exito" : "alerta",
      link: "/dashboard/mis-documentos",
    })
  }
  revalidatePath("/dashboard/revision/documentos")
}

export async function deleteDocumentoEstudiante(id: number) {
  await getUserId()
  await db.delete(documentosEstudiante).where(eq(documentosEstudiante.id, id))
  revalidatePath("/dashboard/mis-documentos")
}

// ── Silabos ───────────────────────────────────────────────────────────────────
export async function getMisSilabos() {
  const uid = await getUserId()
  return db.select().from(silabos).where(eq(silabos.docenteId, uid)).orderBy(desc(silabos.createdAt))
}

export async function getAllSilabos() {
  await getUserId()
  return db.select().from(silabos).orderBy(desc(silabos.createdAt))
}

export async function createSilabo(data: { materiaId: number; periodoId: number; titulo?: string; convocatoriaId?: number }) {
  const uid = await getUserId()
  await db.insert(silabos).values({
    materiaId: data.materiaId,
    docenteId: uid,
    periodoId: data.periodoId,
    archivonombre: `silabo-${data.materiaId}-${Date.now()}.pdf`,
    archivoUrl: `/mock-files/silabo-${Date.now()}.pdf`,
    convocatoriaId: data.convocatoriaId ?? null,
    estado: "pendiente",
  })
  revalidatePath("/dashboard/silabos")
}

export async function reviewSilabo(id: number, estado: "aprobado" | "rechazado", observacion?: string) {
  const uid = await getUserId()
  const [sil] = await db.select().from(silabos).where(eq(silabos.id, id))
  await db.update(silabos).set({ estado, observacion: observacion ?? null, revisadoPor: uid, revisadoAt: new Date() }).where(eq(silabos.id, id))
  if (sil) {
    await db.insert(notificaciones).values({
      destinatarioId: sil.docenteId,
      titulo: estado === "aprobado" ? "Silabo aprobado" : "Silabo rechazado",
      mensaje: `Tu silabo fue ${estado}.${observacion ? ` Observacion: ${observacion}` : ""}`,
      tipo: estado === "aprobado" ? "exito" : "alerta",
      link: "/dashboard/silabos",
    })
  }
  revalidatePath("/dashboard/revision/silabos")
}

// ── Informes ──────────────────────────────────────────────────────────────────
export async function getMisInformes() {
  const uid = await getUserId()
  return db.select().from(informes).where(eq(informes.docenteId, uid)).orderBy(desc(informes.createdAt))
}

export async function getAllInformes() {
  await getUserId()
  return db.select().from(informes).orderBy(desc(informes.createdAt))
}

export async function createInforme(data: { materiaId: number; periodoId: number; tipo: string; titulo: string; convocatoriaId?: number }) {
  const uid = await getUserId()
  await db.insert(informes).values({
    materiaId: data.materiaId,
    docenteId: uid,
    periodoId: data.periodoId,
    tipo: data.tipo,
    titulo: data.titulo,
    archivonombre: `informe-${Date.now()}.pdf`,
    archivoUrl: `/mock-files/informe-${Date.now()}.pdf`,
    convocatoriaId: data.convocatoriaId ?? null,
    estado: "pendiente",
  })
  revalidatePath("/dashboard/informes")
}

export async function reviewInforme(id: number, estado: "aprobado" | "rechazado", observacion?: string) {
  const uid = await getUserId()
  const [inf] = await db.select().from(informes).where(eq(informes.id, id))
  await db.update(informes).set({ estado, observacion: observacion ?? null, revisadoPor: uid, revisadoAt: new Date() }).where(eq(informes.id, id))
  if (inf) {
    await db.insert(notificaciones).values({
      destinatarioId: inf.docenteId,
      titulo: estado === "aprobado" ? "Informe aprobado" : "Informe rechazado",
      mensaje: `Tu informe "${inf.titulo}" fue ${estado}.${observacion ? ` Observacion: ${observacion}` : ""}`,
      tipo: estado === "aprobado" ? "exito" : "alerta",
      link: "/dashboard/informes",
    })
  }
  revalidatePath("/dashboard/revision/informes")
}

// ── Justificaciones ───────────────────────────────────────────────────────────
export async function getMisJustificaciones() {
  const uid = await getUserId()
  return db.select().from(justificaciones).where(eq(justificaciones.solicitanteId, uid)).orderBy(desc(justificaciones.createdAt))
}

export async function getAllJustificaciones() {
  await getUserId()
  return db.select().from(justificaciones).orderBy(desc(justificaciones.createdAt))
}

export async function createJustificacion(data: { fechaFalta: string; motivo: string; materiaId?: number; tipoSolicitante?: string; convocatoriaId?: number }) {
  const uid = await getUserId()
  await db.insert(justificaciones).values({
    solicitanteId: uid,
    tipoSolicitante: data.tipoSolicitante ?? "estudiante",
    materiaId: data.materiaId ?? null,
    fechaFalta: data.fechaFalta,
    motivo: data.motivo,
    archivonombre: `justificacion-${Date.now()}.pdf`,
    archivoUrl: `/mock-files/just-${Date.now()}.pdf`,
    convocatoriaId: data.convocatoriaId ?? null,
    estado: "pendiente",
  })
  revalidatePath("/dashboard/mis-justificaciones")
}

export async function reviewJustificacion(id: number, estado: "aprobado" | "rechazado", observacion?: string) {
  const uid = await getUserId()
  const [just] = await db.select().from(justificaciones).where(eq(justificaciones.id, id))
  await db.update(justificaciones).set({ estado, observacion: observacion ?? null, revisadoPor: uid, revisadoAt: new Date() }).where(eq(justificaciones.id, id))
  if (just) {
    await db.insert(notificaciones).values({
      destinatarioId: just.solicitanteId,
      titulo: estado === "aprobado" ? "Justificacion aprobada" : "Justificacion rechazada",
      mensaje: `Tu justificacion fue ${estado}.${observacion ? ` Observacion: ${observacion}` : ""}`,
      tipo: estado === "aprobado" ? "exito" : "alerta",
      link: "/dashboard/mis-justificaciones",
    })
  }
  revalidatePath("/dashboard/revision/justificaciones")
}
