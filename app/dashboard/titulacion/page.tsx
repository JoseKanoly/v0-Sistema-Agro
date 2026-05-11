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
import type { TemaTitulacion } from "@/lib/types/database"

export default function TitulacionPage() {
  return (
    <AccessGuard roles={["docente", "secretaria", "coordinador_carrera", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { titulacion, usuarios } = useData()

  if (!user) return null

  let visibles = titulacion
  if (user.rol === "docente") {
    visibles = titulacion.filter((t) => t.docente_id === user.id)
  } else if (user.rol === "coordinador_carrera" && user.carrera_id) {
    visibles = titulacion.filter((t) => t.carrera_id === user.carrera_id)
  }

  const columns: ExportColumn<TemaTitulacion>[] = [
    { header: "Tema", accessor: (r) => r.tema },
    {
      header: "Estudiante",
      accessor: (r) => {
        const e = usuarios.find((u) => u.id === r.estudiante_id)
        return e ? `${e.nombres} ${e.apellidos}` : ""
      },
    },
    {
      header: "Tutor",
      accessor: (r) => {
        const t = usuarios.find((u) => u.id === r.docente_id)
        return t ? `${t.nombres} ${t.apellidos}` : ""
      },
    },
    { header: "Carrera", accessor: (r) => CARRERAS.find((c) => c.id === r.carrera_id)?.nombre ?? "" },
    { header: "Fecha asignacion", accessor: (r) => r.fecha_asignacion },
    { header: "Estado", accessor: (r) => r.estado.replace("_", " ") },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Temas de titulacion"
        description={
          user.rol === "docente"
            ? "Estudiantes que tutorias"
            : "Temas asignados en la facultad"
        }
        actions={
          <ExportButtons
            filename="titulacion"
            title="Temas de titulacion"
            columns={columns}
            rows={visibles}
          />
        }
      />

      <Card>
        <CardContent className="p-0">
          {visibles.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay temas de titulacion registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tema</TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibles.map((t) => {
                  const est = usuarios.find((u) => u.id === t.estudiante_id)
                  const tutor = usuarios.find((u) => u.id === t.docente_id)
                  const carrera = CARRERAS.find((c) => c.id === t.carrera_id)
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="max-w-[300px] font-medium">{t.tema}</TableCell>
                      <TableCell>{est ? `${est.nombres} ${est.apellidos}` : "-"}</TableCell>
                      <TableCell>{tutor ? `${tutor.nombres} ${tutor.apellidos}` : "-"}</TableCell>
                      <TableCell className="text-xs">{carrera?.nombre}</TableCell>
                      <TableCell>
                        <Badge variant={t.estado === "graduado" ? "default" : "secondary"} className="capitalize">
                          {t.estado.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
