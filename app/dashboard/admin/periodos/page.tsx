"use client"

import { ResourceCrud, type CrudField, type CrudColumn } from "@/components/crud/resource-crud"
import { PeriodoService } from "@/lib/services"
import type { PeriodoAcademico } from "@/lib/types/database"

const estadoOptions = [
  { value: "planificado", label: "Planificado" },
  { value: "activo", label: "Activo" },
  { value: "finalizado", label: "Finalizado" },
]

const estadoLabel: Record<string, string> = {
  planificado: "Planificado",
  activo: "Activo",
  finalizado: "Finalizado",
}

const estadoStyle: Record<string, string> = {
  planificado: "bg-amber-100 text-amber-700",
  activo: "bg-green-100 text-green-700",
  finalizado: "bg-slate-100 text-slate-600",
}

const fields: CrudField<PeriodoAcademico>[] = [
  { name: "nombre", label: "Nombre del periodo", required: true, full: true, placeholder: "Ej. 2026-1" },
  { name: "fechaInicio", label: "Fecha de inicio", type: "date", required: true },
  { name: "fechaFin", label: "Fecha de fin", type: "date", required: true },
  { name: "estado", label: "Estado", type: "select", options: estadoOptions },
]

const columns: CrudColumn<PeriodoAcademico>[] = [
  { key: "nombre", header: "Periodo" },
  { key: "fechaInicio", header: "Inicio" },
  { key: "fechaFin", header: "Fin" },
  {
    key: "estado",
    header: "Estado",
    render: (p) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${estadoStyle[p.estado]}`}>
        {estadoLabel[p.estado]}
      </span>
    ),
    exportAccessor: (p) => estadoLabel[p.estado],
  },
]

export default function PeriodosPage() {
  return (
    <ResourceCrud<PeriodoAcademico>
      title="Periodos Académicos"
      description="Administra los periodos lectivos de la institución"
      service={PeriodoService}
      fields={fields}
      columns={columns}
      searchKeys={["nombre"]}
      exportName="periodos"
      itemLabel="periodo"
    />
  )
}
