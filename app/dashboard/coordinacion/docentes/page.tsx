"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { ExportButtons } from "@/components/export-buttons"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CARRERAS } from "@/lib/mock/carreras"
import type { ExportColumn } from "@/lib/utils/export"
import type { Usuario } from "@/lib/types/database"

export default function CoordDocentesPage() {
  return (
    <AccessGuard roles={["coordinador_carrera"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { usuarios, silabos, informes } = useData()

  if (!user) return null
  const carrera = CARRERAS.find((c) => c.id === user.carrera_id)
  const docentes = usuarios.filter((u) => u.rol === "docente" && u.carrera_id === user.carrera_id)

  const columns: ExportColumn<Usuario>[] = [
    { header: "Nombres", accessor: (r) => r.nombres },
    { header: "Apellidos", accessor: (r) => r.apellidos },
    { header: "Cedula", accessor: (r) => r.cedula },
    { header: "Email", accessor: (r) => r.email },
    {
      header: "Silabos OK",
      accessor: (r) =>
        `${silabos.filter((s) => s.docente_id === r.id && s.estado === "aprobado").length}/${silabos.filter((s) => s.docente_id === r.id).length}`,
    },
    {
      header: "Informes OK",
      accessor: (r) =>
        `${informes.filter((i) => i.docente_id === r.id && i.estado === "aprobado").length}/${informes.filter((i) => i.docente_id === r.id).length}`,
    },
    { header: "Vinculacion", accessor: (r) => (r.tiene_vinculacion ? "Si" : "No") },
    { header: "Investigacion", accessor: (r) => (r.tiene_investigacion ? "Si" : "No") },
    { header: "Activo", accessor: (r) => (r.activo ? "Si" : "No") },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Docentes"
        description={carrera ? `Equipo docente de ${carrera.nombre}` : "Docentes asignados a tu carrera"}
        actions={
          <ExportButtons
            filename={`docentes_${user.carrera_id}`}
            title="Docentes de la carrera"
            subtitle={carrera?.nombre}
            columns={columns}
            rows={docentes}
          />
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Docente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Silabos</TableHead>
                <TableHead>Informes</TableHead>
                <TableHead>Asignaciones</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docentes.map((d) => {
                const misSil = silabos.filter((s) => s.docente_id === d.id)
                const misInf = informes.filter((i) => i.docente_id === d.id)
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">
                      {d.nombres} {d.apellidos}
                    </TableCell>
                    <TableCell className="text-xs">{d.email}</TableCell>
                    <TableCell>
                      <span className="text-emerald-700">{misSil.filter((s) => s.estado === "aprobado").length}</span>
                      <span className="text-muted-foreground"> / {misSil.length}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-emerald-700">{misInf.filter((i) => i.estado === "aprobado").length}</span>
                      <span className="text-muted-foreground"> / {misInf.length}</span>
                    </TableCell>
                    <TableCell className="space-x-1">
                      {d.tiene_vinculacion && <Badge variant="secondary">Vinc.</Badge>}
                      {d.tiene_investigacion && <Badge variant="secondary">Inv.</Badge>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={d.activo ? "default" : "outline"}>{d.activo ? "Activo" : "Inactivo"}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
