"use client"

import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CARRERAS } from "@/lib/mock/carreras"
import { Sprout, Users, GraduationCap } from "lucide-react"

export default function AdminCarrerasPage() {
  return (
    <AccessGuard roles={["super_admin"]}>
      <CarrerasContent />
    </AccessGuard>
  )
}

function CarrerasContent() {
  const { usuarios } = useData()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Carreras"
        description="Las tres carreras de la Facultad de Agronomia"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {CARRERAS.map((c) => {
          const docentes = usuarios.filter((u) => u.rol === "docente" && u.carrera_id === c.id).length
          const estudiantes = usuarios.filter((u) => u.rol === "estudiante" && u.carrera_id === c.id).length

          return (
            <Card key={c.id}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sprout className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{c.nombre}</CardTitle>
                <CardDescription>{c.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Docentes
                  </span>
                  <Badge variant="secondary">{docentes}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    Estudiantes
                  </span>
                  <Badge variant="secondary">{estudiantes}</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
