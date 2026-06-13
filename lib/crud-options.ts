import { carrerasMock } from "@/lib/mock/carreras"
import { periodosMock } from "@/lib/mock/periodos"
import { materiasMock } from "@/lib/mock/materias"
import { estudiantesMock } from "@/lib/mock/estudiantes"
import { ROLES } from "@/lib/types/database"

export const carreraOptions = [
  { value: 0, label: "Sin carrera" },
  ...carrerasMock.map((c) => ({ value: c.id, label: c.siglas })),
]

export const carreraOptionsReq = carrerasMock.map((c) => ({ value: c.id, label: c.nombre }))

export function carreraLabel(id: number | null): string {
  if (!id) return "—"
  return carrerasMock.find((c) => c.id === id)?.siglas ?? `#${id}`
}

export function carreraNombre(id: number | null): string {
  if (!id) return "—"
  return carrerasMock.find((c) => c.id === id)?.nombre ?? `#${id}`
}

export const rolOptions = ROLES.map((r) => ({ value: r.value, label: r.label }))

export function rolLabel(rol: string): string {
  return ROLES.find((r) => r.value === rol)?.label ?? rol
}

export const periodoOptions = periodosMock.map((p) => ({ value: p.id, label: p.nombre }))

export function periodoLabel(id: number): string {
  return periodosMock.find((p) => p.id === id)?.nombre ?? `#${id}`
}

export const materiaOptions = materiasMock.map((m) => ({ value: m.id, label: `${m.codigo} - ${m.nombre}` }))

export function materiaLabel(id: number): string {
  const m = materiasMock.find((x) => x.id === id)
  return m ? `${m.codigo} - ${m.nombre}` : `#${id}`
}

export const estudianteOptions = estudiantesMock.map((e) => ({ value: e.id, label: `${e.nombres} ${e.apellidos}` }))

export function estudianteLabel(id: number): string {
  const e = estudiantesMock.find((x) => x.id === id)
  return e ? `${e.nombres} ${e.apellidos}` : `#${id}`
}

export const estadoRevisionOptions = [
  { value: "pendiente", label: "Pendiente" },
  { value: "aprobado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
]
