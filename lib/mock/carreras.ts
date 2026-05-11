import type { Carrera } from "@/lib/types/database"

export const CARRERAS: Carrera[] = [
  {
    id: "agropecuaria",
    nombre: "Ingenieria Agropecuaria",
    descripcion: "Carrera enfocada en produccion agricola y pecuaria sostenible.",
  },
  {
    id: "agronegocios",
    nombre: "Ingenieria en Agronegocios",
    descripcion: "Gestion empresarial y comercial del sector agroalimentario.",
  },
  {
    id: "agroindustria",
    nombre: "Ingenieria en Agroindustria",
    descripcion: "Procesamiento y transformacion industrial de productos agricolas.",
  },
]

export const PERIODO_ACTUAL = "2026-1"
