"use client"

import { ResourceCrud, type CrudField, type CrudColumn } from "@/components/crud/resource-crud"
import { MateriaService } from "@/lib/services"
import type { Materia } from "@/lib/types/database"
import { carreraOptionsReq, carreraLabel } from "@/lib/crud-options"

const fields: CrudField<Materia>[] = [
  { name: "nombre", label: "Nombre de la materia", required: true, full: true },
  { name: "codigo", label: "Código", required: true },
  { name: "carreraId", label: "Carrera", type: "select", options: carreraOptionsReq, required: true },
  { name: "creditos", label: "Créditos", type: "number", defaultValue: 3 },
  { name: "nivel", label: "Nivel", type: "number", defaultValue: 1 },
  { name: "docente", label: "Docente", full: true },
  { name: "activa", label: "Estado", type: "select", options: [{ value: true, label: "Activa" }, { value: false, label: "Inactiva" }] },
]

const columns: CrudColumn<Materia>[] = [
  { key: "codigo", header: "Código" },
  { key: "nombre", header: "Materia" },
  { key: "carreraId", header: "Carrera", render: (m) => carreraLabel(m.carreraId), exportAccessor: (m) => carreraLabel(m.carreraId) },
  { key: "creditos", header: "Créditos" },
  { key: "nivel", header: "Nivel" },
  { key: "docente", header: "Docente" },
  {
    key: "activa",
    header: "Estado",
    render: (m) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${m.activa ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
        {m.activa ? "Activa" : "Inactiva"}
      </span>
    ),
    exportAccessor: (m) => (m.activa ? "Activa" : "Inactiva"),
  },
]

export default function MateriasPage() {
  return (
    <ResourceCrud<Materia>
      title="Gestión de Materias"
      description="Administra las asignaturas del plan de estudios"
      service={MateriaService}
      fields={fields}
      columns={columns}
      searchKeys={["nombre", "codigo", "docente"]}
      exportName="materias"
      itemLabel="materia"
    />
  )
}
