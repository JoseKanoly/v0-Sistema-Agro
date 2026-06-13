"use client"

import { ResourceCrud, type CrudField, type CrudColumn } from "@/components/crud/resource-crud"
import { CarreraService } from "@/lib/services"
import type { Carrera } from "@/lib/types/database"
import { StatusBadge } from "@/components/ui/status-badge"

const fields: CrudField<Carrera>[] = [
  { name: "nombre", label: "Nombre de la carrera", required: true, full: true },
  { name: "siglas", label: "Siglas", required: true },
  { name: "facultad", label: "Facultad", required: true },
  { name: "coordinador", label: "Coordinador", full: true },
  { name: "estado", label: "Estado", type: "select", options: [{ value: "activo", label: "Activo" }, { value: "inactivo", label: "Inactivo" }] },
]

const columns: CrudColumn<Carrera>[] = [
  { key: "nombre", header: "Carrera" },
  { key: "siglas", header: "Siglas" },
  { key: "facultad", header: "Facultad" },
  { key: "coordinador", header: "Coordinador" },
  { key: "estado", header: "Estado", render: (c) => <StatusBadge estado={c.estado} />, exportAccessor: (c) => c.estado },
]

export default function CarrerasPage() {
  return (
    <ResourceCrud<Carrera>
      title="Gestión de Carreras"
      description="Administra las carreras y facultades de la institución"
      service={CarreraService}
      fields={fields}
      columns={columns}
      searchKeys={["nombre", "siglas", "facultad", "coordinador"]}
      exportName="carreras"
      itemLabel="carrera"
    />
  )
}
