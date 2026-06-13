import type { Convocatoria } from "@/lib/types/database"

export const convocatoriasMock: Convocatoria[] = [
  {
    id: 1,
    titulo: "Entrega de documentos de matrícula",
    tipo: "documentos",
    fechaInicio: "2026-02-01",
    fechaLimite: "2026-02-28",
    dirigidoA: "ESTUDIANTE",
    estado: "abierta",
  },
  {
    id: 2,
    titulo: "Carga de sílabos periodo 2026-1",
    tipo: "silabos",
    fechaInicio: "2026-02-05",
    fechaLimite: "2026-02-20",
    dirigidoA: "DOCENTE",
    estado: "abierta",
  },
  {
    id: 3,
    titulo: "Entrega de informes de asignatura",
    tipo: "informes",
    fechaInicio: "2026-06-01",
    fechaLimite: "2026-06-30",
    dirigidoA: "DOCENTE",
    estado: "proxima",
  },
  {
    id: 4,
    titulo: "Inscripción de temas de titulación",
    tipo: "titulacion",
    fechaInicio: "2026-01-10",
    fechaLimite: "2026-01-31",
    dirigidoA: "ESTUDIANTE",
    estado: "cerrada",
  },
  {
    id: 5,
    titulo: "Proceso de matriculación ordinaria",
    tipo: "matriculas",
    fechaInicio: "2026-02-01",
    fechaLimite: "2026-02-15",
    dirigidoA: "ESTUDIANTE",
    estado: "abierta",
  },
]
