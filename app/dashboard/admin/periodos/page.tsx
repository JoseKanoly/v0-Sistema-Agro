"use client"

import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

const PERIODOS = [
  { codigo: "2025-2", nombre: "Periodo 2025 - Segundo semestre", inicio: "2025-09-01", fin: "2026-02-15", activo: false },
  { codigo: "2026-1", nombre: "Periodo 2026 - Primer semestre", inicio: "2026-03-01", fin: "2026-07-31", activo: true },
  { codigo: "2026-2", nombre: "Periodo 2026 - Segundo semestre", inicio: "2026-09-01", fin: "2027-02-15", activo: false },
]

export default function AdminPeriodosPage() {
  return (
    <AccessGuard roles={["super_admin"]}>
      <PeriodosContent />
    </AccessGuard>
  )
}

function PeriodosContent() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Periodos academicos"
        description="Calendario de periodos lectivos del sistema"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {PERIODOS.map((p) => (
          <Card key={p.codigo} className={p.activo ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>{p.codigo}</CardTitle>
                </div>
                {p.activo && <Badge>Activo</Badge>}
              </div>
              <CardDescription>{p.nombre}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inicio</span>
                <span>{new Date(p.inicio).toLocaleDateString("es-EC")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fin</span>
                <span>{new Date(p.fin).toLocaleDateString("es-EC")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
