import type { PeriodoAcademico } from "@/lib/types/database"

export const periodosMock: PeriodoAcademico[] = [
  { id: 1, nombre: "2026 - Primer Periodo", fechaInicio: "2026-04-01", fechaFin: "2026-08-31", estado: "activo" },
  { id: 2, nombre: "2025 - Segundo Periodo", fechaInicio: "2025-10-01", fechaFin: "2026-02-28", estado: "finalizado" },
  { id: 3, nombre: "2025 - Primer Periodo", fechaInicio: "2025-04-01", fechaFin: "2025-08-31", estado: "finalizado" },
  { id: 4, nombre: "2024 - Segundo Periodo", fechaInicio: "2024-10-01", fechaFin: "2025-02-28", estado: "finalizado" },
  { id: 5, nombre: "2024 - Primer Periodo", fechaInicio: "2024-04-01", fechaFin: "2024-08-31", estado: "finalizado" },
  { id: 6, nombre: "2026 - Segundo Periodo", fechaInicio: "2026-10-01", fechaFin: "2027-02-28", estado: "planificado" },
]
