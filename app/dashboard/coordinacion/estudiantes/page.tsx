"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CARRERAS } from "@/lib/mock/carreras"

export default function CoordEstudiantesPage() {
  return (
    <AccessGuard roles={["coordinador_carrera"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { usuarios, documentos, asistencias, titulacion } = useData()

  if (!user) return null
  const carrera = CARRERAS.find((c) => c.id === user.carrera_id)
  const estudiantes = usuarios.filter((u) => u.rol === "estudiante" && u.carrera_id === user.carrera_id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Estudiantes"
        description={carrera ? `Estudiantes matriculados en ${carrera.nombre}` : "Estudiantes de tu carrera"}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Documentos OK</TableHead>
                <TableHead>Faltas</TableHead>
                <TableHead>Titulacion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estudiantes.map((e) => {
                const docs = documentos.filter((d) => d.estudiante_id === e.id)
                const ok = docs.filter((d) => d.estado === "aprobado").length
                const faltas = asistencias.filter((a) => a.estudiante_id === e.id && !a.asistio).length
                const tit = titulacion.find((t) => t.estudiante_id === e.id)
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">
                      {e.nombres} {e.apellidos}
                    </TableCell>
                    <TableCell className="text-xs">{e.email}</TableCell>
                    <TableCell>
                      <span className="text-emerald-700">{ok}</span>
                      <span className="text-muted-foreground"> / {docs.length || 5}</span>
                    </TableCell>
                    <TableCell>
                      {faltas > 0 ? (
                        <Badge variant="destructive">{faltas}</Badge>
                      ) : (
                        <Badge variant="outline">0</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {tit ? (
                        <Badge variant="secondary" className="capitalize">{tit.estado.replace("_", " ")}</Badge>
                      ) : (
                        <Badge variant="outline">Sin tema</Badge>
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
