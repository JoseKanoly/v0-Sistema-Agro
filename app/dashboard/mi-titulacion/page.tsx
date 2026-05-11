"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, GraduationCap, UserCheck } from "lucide-react"

export default function MiTitulacionPage() {
  return (
    <AccessGuard roles={["estudiante"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { titulacion, usuarios } = useData()

  if (!user) return null
  const tema = titulacion.find((t) => t.estudiante_id === user.id)

  if (!tema) {
    return (
      <div className="space-y-6">
        <PageHeader title="Mi titulacion" description="Tema asignado para tu trabajo de titulacion" />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Award className="h-10 w-10" />
            <p className="text-sm">Aun no tienes un tema de titulacion asignado.</p>
            <p className="text-xs">Tu coordinador de carrera te asignara uno proximamente.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tutor = usuarios.find((u) => u.id === tema.docente_id)

  return (
    <div className="space-y-6">
      <PageHeader title="Mi titulacion" description="Tema asignado para tu trabajo de titulacion" />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <CardTitle>{tema.tema}</CardTitle>
          </div>
          <CardDescription>{tema.descripcion}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Estado</p>
              <Badge className="mt-1 capitalize">{tema.estado.replace("_", " ")}</Badge>
            </div>
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Asignado el</p>
              <p className="font-medium">{new Date(tema.fecha_asignacion).toLocaleDateString("es-EC")}</p>
            </div>
          </div>

          {tutor && (
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Tutor asignado</p>
              <div className="mt-1 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                <p className="font-medium">
                  {tutor.nombres} {tutor.apellidos}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{tutor.email}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
