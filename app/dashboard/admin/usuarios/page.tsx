"use client"

import { ResourceCrud, type CrudField, type CrudColumn } from "@/components/crud/resource-crud"
import { UsuarioService } from "@/lib/services"
import type { Usuario } from "@/lib/types/database"
import { StatusBadge } from "@/components/ui/status-badge"
import { carreraOptions, carreraLabel, rolOptions, rolLabel } from "@/lib/crud-options"

const fields: CrudField<Usuario>[] = [
  { name: "nombres", label: "Nombres", required: true },
  { name: "apellidos", label: "Apellidos", required: true },
  { name: "correo", label: "Correo institucional", type: "email", required: true, full: true },
  { name: "cedula", label: "Cédula", required: true },
  { name: "telefono", label: "Teléfono" },
  { name: "rol", label: "Rol", type: "select", options: rolOptions, required: true },
  { name: "carreraId", label: "Carrera", type: "select", options: carreraOptions },
  { name: "estado", label: "Estado", type: "select", options: [{ value: "activo", label: "Activo" }, { value: "inactivo", label: "Inactivo" }] },
]

const columns: CrudColumn<Usuario>[] = [
  { key: "nombre", header: "Nombre", render: (u) => `${u.nombres} ${u.apellidos}`, exportAccessor: (u) => `${u.nombres} ${u.apellidos}` },
  { key: "correo", header: "Correo" },
  { key: "cedula", header: "Cédula" },
  { key: "rol", header: "Rol", render: (u) => rolLabel(u.rol), exportAccessor: (u) => rolLabel(u.rol) },
  { key: "carreraId", header: "Carrera", render: (u) => carreraLabel(u.carreraId), exportAccessor: (u) => carreraLabel(u.carreraId) },
  { key: "estado", header: "Estado", render: (u) => <StatusBadge estado={u.estado} />, exportAccessor: (u) => u.estado },
]

export default function UsuariosPage() {
  return (
    <ResourceCrud<Usuario>
      title="Gestión de Usuarios"
      description="Administra las cuentas y roles del sistema académico"
      service={UsuarioService}
      fields={fields}
      columns={columns}
      searchKeys={["nombres", "apellidos", "correo", "cedula"]}
      exportName="usuarios"
      itemLabel="usuario"
    />
  )
}
