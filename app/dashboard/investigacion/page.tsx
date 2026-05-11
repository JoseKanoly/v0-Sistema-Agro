"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Microscope, FileText } from "lucide-react"
import { CARRERAS } from "@/lib/mock/carreras"
import { Progress } from "@/components/ui/progress"

export default function InvestigacionPage() {
  return (
    <AccessGuard roles={["docente", "coordinador_investigacion", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { proyectos, hitos, usuarios } = useData()

  if (!user) return null

  // Docente sin proyecto
  if (user.rol === "docente" && !user.tiene_investigacion) {
    return (
      <div className="space-y-6">
        <PageHeader title="Investigacion" description="Tus proyectos de investigacion" />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Microscope className="h-10 w-10" />
            <p className="text-sm">No tienes proyectos de investigacion asignados.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const visibles = user.rol === "docente" ? proyectos.filter((p) => p.docente_id === user.id) : proyectos

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.rol === "docente" ? "Mis proyectos de investigacion" : "Proyectos de investigacion"}
        description="Avance de hitos por proyecto"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {visibles.map((p) => {
          const hitosP = hitos.filter((h) => h.proyecto_id === p.id).sort((a, b) => a.numero - b.numero)
          const completados = hitosP.filter((h) => h.completado).length
          const docente = usuarios.find((u) => u.id === p.docente_id)
          const carrera = CARRERAS.find((c) => c.id === p.carrera_id)
          const progreso = (completados / p.total_hitos) * 100

          return (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Microscope className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{p.titulo}</CardTitle>
                    <CardDescription>
                      {docente?.nombres} {docente?.apellidos} - {carrera?.nombre}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Hitos: {completados} / {p.total_hitos}
                    </span>
                    <span className="font-medium">{Math.round(progreso)}%</span>
                  </div>
                  <Progress value={progreso} />
                </div>
                <div className="space-y-1.5">
                  {hitosP.map((h) => (
                    <div key={h.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                      <span className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        {h.titulo}
                      </span>
                      <Badge variant={h.completado ? "default" : "outline"}>
                        {h.completado ? "Entregado" : "Pendiente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
