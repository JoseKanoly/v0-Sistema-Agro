"use client"

import { ResourceCrud, type CrudField, type CrudColumn } from "@/components/crud/resource-crud"
import { DocumentoRevisionService } from "@/lib/services"
import type { DocumentoRevision } from "@/lib/types/database"
import { StatusBadge } from "@/components/ui/status-badge"
import { carreraOptionsReq, carreraLabel, estadoRevisionOptions } from "@/lib/crud-options"

const fields: CrudField<DocumentoRevision>[] = [
  { name: "estudiante", label: "Estudiante", required: true },
  { name: "cedula", label: "Cédula", required: true },
  { name: "carreraId", label: "Carrera", type: "select", options: carreraOptionsReq, required: true },
  { name: "tipo", label: "Tipo de documento", required: true },
  { name: "nombre", label: "Nombre del documento", required: true, full: true },
  { name: "fecha", label: "Fecha de entrega", type: "date" },
  { name: "estado", label: "Estado", type: "select", options: estadoRevisionOptions },
]

const columns: CrudColumn<DocumentoRevision>[] = [
  { key: "estudiante", header: "Estudiante" },
  { key: "cedula", header: "Cédula" },
  { key: "carreraId", header: "Carrera", render: (d) => carreraLabel(d.carreraId), exportAccessor: (d) => carreraLabel(d.carreraId) },
  { key: "tipo", header: "Tipo" },
  { key: "fecha", header: "Fecha" },
  { key: "estado", header: "Estado", render: (d) => <StatusBadge estado={d.estado} />, exportAccessor: (d) => d.estado },
]

export default function RevisionDocumentosPage() {
  return (
    <ResourceCrud<DocumentoRevision>
      title="Revisión de Documentos"
      description="Valida y gestiona los documentos entregados por los estudiantes"
      service={DocumentoRevisionService}
      fields={fields}
      columns={columns}
      searchKeys={["estudiante", "cedula", "tipo"]}
      exportName="documentos_revision"
      itemLabel="documento"
    />
  )
}
