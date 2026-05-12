"use client"

import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { ExportButtons } from "@/components/export-buttons"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { ExportColumn } from "@/lib/utils/export"
import type { ProyectoInvestigacion } from "@/lib/types/database"

export default function AvancesInvPage() {
  return (
    <AccessGuard roles={["coordinador_investigacion", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { proyectos, hitos, usuarios } = useData()

  const columns: ExportColumn<ProyectoInvestigacion>[] = [
    { header: "Proyecto", accessor: (r) => r.titulo },
    {
      header: "Investigador",
      accessor: (r) => {
        const d = usuarios.find((u) => u.id === r.docente_id)
        return d ? `${d.nombres} ${d.apellidos}` : ""
      },
    },
    {
      header: "Hitos completados",
      accessor: (r) => hitos.filter((h) => h.proyecto_id === r.id && h.completado).length,
    },
    { header: "Total hitos", accessor: (r) => r.total_hitos },
    {
      header: "Avance %",
      accessor: (r) => {
        const ok = hitos.filter((h) => h.proyecto_id === r.id && h.completado).length
        return Math.round((ok / r.total_hitos) * 100)
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Avance de hitos"
        description="Resumen del cumplimiento por proyecto"
        actions={
          <ExportButtons
            filename="avances_investigacion"
            title="Avance de hitos de investigacion"
            columns={columns}
            rows={proyectos}
          />
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Investigador</TableHead>
                <TableHead>Hitos</TableHead>
                <TableHead className="w-[200px]">Progreso</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proyectos.map((p) => {
                const hitosP = hitos.filter((h) => h.proyecto_id === p.id)
                const completados = hitosP.filter((h) => h.completado).length
                const progreso = (completados / p.total_hitos) * 100
                const docente = usuarios.find((u) => u.id === p.docente_id)

                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.titulo}</TableCell>
                    <TableCell>{docente ? `${docente.nombres} ${docente.apellidos}` : "-"}</TableCell>
                    <TableCell>
                      {completados} / {p.total_hitos}
                    </TableCell>
                    <TableCell>
                      <Progress value={progreso} />
                    </TableCell>
                    <TableCell>
                      {progreso === 100 ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">Completado</Badge>
                      ) : progreso >= 50 ? (
                        <Badge variant="secondary">En curso</Badge>
                      ) : (
                        <Badge variant="outline">Iniciando</Badge>
                      )}
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
