"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CARRERAS } from "@/lib/mock/carreras"

export default function AsignacionesPage() {
  return (
    <AccessGuard roles={["secretaria", "coordinador_carrera", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { usuarios, setUsuarios } = useData()

  if (!user) return null

  let docentes = usuarios.filter((u) => u.rol === "docente" && u.activo)
  if (user.rol === "coordinador_carrera" && user.carrera_id) {
    docentes = docentes.filter((d) => d.carrera_id === user.carrera_id)
  }

  const toggle = (id: string, field: "tiene_vinculacion" | "tiene_investigacion") => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, [field]: !u[field] } : u)))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asignaciones de docentes"
        description="Activa los proyectos de vinculacion e investigacion por docente"
      />

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="grid grid-cols-5 gap-4 px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
              <span className="col-span-2">Docente</span>
              <span>Carrera</span>
              <span className="text-center">Vinculacion</span>
              <span className="text-center">Investigacion</span>
            </div>
            {docentes.map((d) => {
              const carrera = CARRERAS.find((c) => c.id === d.carrera_id)
              return (
                <div key={d.id} className="grid grid-cols-5 items-center gap-4 px-4 py-3">
                  <div className="col-span-2">
                    <p className="font-medium">
                      {d.nombres} {d.apellidos}
                    </p>
                    <p className="text-xs text-muted-foreground">{d.email}</p>
                  </div>
                  <Badge variant="outline" className="w-fit text-xs">
                    {carrera?.nombre}
                  </Badge>
                  <div className="flex justify-center">
                    <Switch
                      checked={!!d.tiene_vinculacion}
                      onCheckedChange={() => toggle(d.id, "tiene_vinculacion")}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={!!d.tiene_investigacion}
                      onCheckedChange={() => toggle(d.id, "tiene_investigacion")}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
