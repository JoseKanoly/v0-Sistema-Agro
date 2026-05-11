"use client"

import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AvancesInvPage() {
  return (
    <AccessGuard roles={["coordinador_investigacion", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { proyectos, hitos, usuarios } = useData()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Avance de hitos"
        description="Resumen del cumplimiento por proyecto"
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
