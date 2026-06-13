import type { Matricula, Falta, Justificacion } from "@/lib/types/database"

const estadosMat: Matricula["estado"][] = ["matriculado", "aprobado", "reprobado", "retirado"]

export const matriculasMock: Matricula[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  estudianteId: (i % 22) + 1,
  materiaId: (i % 35) + 1,
  periodoId: (i % 3) + 1,
  estado: estadosMat[i % 4 === 3 ? 0 : i % 4],
  nota: Number((5 + (i % 6)).toFixed(1)),
}))

const tiposFalta: Falta["tipo"][] = ["injustificada", "justificada", "atraso"]
const obsFalta = [
  "No asistió a la sesión teórica",
  "Llegó 25 minutos tarde",
  "Ausencia por motivos médicos",
  "Falta sin notificación previa",
  "Atraso en práctica de laboratorio",
]

export const faltasMock: Falta[] = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  estudianteId: (i % 22) + 1,
  materiaId: (i % 35) + 1,
  fecha: `2026-0${(i % 5) + 1}-${((i % 27) + 1).toString().padStart(2, "0")}`,
  tipo: tiposFalta[i % 3],
  observacion: obsFalta[i % obsFalta.length],
}))

const estadosJust: Justificacion["estado"][] = ["pendiente", "aprobado", "rechazado"]
const motivos = [
  "Cita médica programada",
  "Calamidad doméstica familiar",
  "Participación en evento académico",
  "Problema de transporte",
  "Enfermedad con certificado médico",
]

export const justificacionesMock: Justificacion[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  estudianteId: (i % 22) + 1,
  faltaId: (i % 22) + 1,
  motivo: motivos[i % motivos.length],
  fecha: `2026-0${(i % 5) + 1}-${((i % 27) + 1).toString().padStart(2, "0")}`,
  estado: estadosJust[i % 3],
}))
