"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { ExportButtons } from "@/components/export-buttons"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ClipboardCheck } from "lucide-react"
import type { ExportColumn } from "@/lib/utils/export"
import type { Asistencia } from "@/lib/types/database"

export default function MisAsistenciasPage() {
  return (
    <AccessGuard roles={["estudiante"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { asistencias, justificaciones } = useData()

  if (!user) return null
  const faltas = asistencias.filter((a) => a.estudiante_id === user.id && !a.asistio)
  const misJust = justificaciones.filter((j) => j.solicitante_id === user.id)

  const findJust = (materia: string, fecha: string) =>
    misJust.find((j) => j.materia === materia && j.fecha_inicio <= fecha && j.fecha_fin >= fecha)

  const estadoTxt = (f: Asistencia) => {
    const j = findJust(f.materia, f.fecha)
    if (!j) return "Sin justificar"
    if (j.estado === "aprobado") return "Justificada"
    if (j.estado === "pendiente") return "En revision"
    return "Rechazada"
  }

  const columns: ExportColumn<Asistencia>[] = [
    { header: "Fecha", accessor: (r) => r.fecha },
    { header: "Materia", accessor: (r) => r.materia },
    { header: "Horas", accessor: (r) => r.horas_clase },
    { header: "Estado", accessor: (r) => estadoTxt(r) },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis asistencias"
        description="Registro de tus faltas y horas justificadas"
        actions={
          <div className="flex gap-2">
            <ExportButtons
              filename={`asistencias_${user.cedula}`}
              title="Registro de asistencias"
              subtitle={`${user.nombres} ${user.apellidos}`}
              columns={columns}
              rows={faltas}
            />
            <Button asChild>
              <Link href="/dashboard/mis-justificaciones">Justificar una falta</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Total de faltas" value={faltas.length} />
        <Stat
          label="Horas no justificadas"
          value={faltas
            .filter((f) => !findJust(f.materia, f.fecha) || findJust(f.materia, f.fecha)?.estado !== "aprobado")
            .reduce((acc, f) => acc + f.horas_clase, 0)}
        />
        <Stat
          label="Horas justificadas"
          value={faltas
            .filter((f) => findJust(f.materia, f.fecha)?.estado === "aprobado")
            .reduce((acc, f) => acc + f.horas_clase, 0)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {faltas.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <ClipboardCheck className="h-8 w-8" />
              <p className="text-sm">No tienes faltas registradas. Excelente trabajo!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Materia</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faltas.map((f) => {
                  const j = findJust(f.materia, f.fecha)
                  return (
                    <TableRow key={f.id}>
                      <TableCell>{new Date(f.fecha).toLocaleDateString("es-EC")}</TableCell>
                      <TableCell className="font-medium">{f.materia}</TableCell>
                      <TableCell>{f.horas_clase}h</TableCell>
                      <TableCell>
                        {!j ? (
                          <Badge variant="destructive">Sin justificar</Badge>
                        ) : j.estado === "aprobado" ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">Justificada</Badge>
                        ) : j.estado === "pendiente" ? (
                          <Badge variant="secondary">En revision</Badge>
                        ) : (
                          <Badge variant="destructive">Rechazada</Badge>
                        )}
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
