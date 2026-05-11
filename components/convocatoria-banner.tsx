"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { Card, CardContent } from "@/components/ui/card"
import { FechaLimiteBadge } from "@/components/status-badge"
import { Megaphone } from "lucide-react"
import type { TipoConvocatoria } from "@/lib/types/database"

interface ConvocatoriaBannerProps {
  tipos: TipoConvocatoria[]
}

const HOY = new Date().toISOString().slice(0, 10)

export function ConvocatoriaBanner({ tipos }: ConvocatoriaBannerProps) {
  const { user } = useAuth()
  const { fechasLimite } = useData()

  if (!user) return null

  // Filtro: convocatorias activas, del tipo solicitado, abiertas (apertura <= hoy)
  // y dirigidas al rol del usuario (audiencia + carrera si aplica).
  const relevantes = fechasLimite.filter((f) => {
    if (!f.activa) return false
    if (!tipos.includes(f.tipo)) return false
    if (f.fecha_apertura > HOY) return false

    // Audiencia
    const esEstudiante = user.rol === "estudiante"
    const esDocente = user.rol === "docente"
    const audOK =
      f.audiencia === "ambos" ||
      (f.audiencia === "estudiantes" && esEstudiante) ||
      (f.audiencia === "docentes" && esDocente)
    if (!audOK) return false

    // Carrera (si la convocatoria es para una carrera, debe coincidir)
    if (f.carrera_id && user.carrera_id !== f.carrera_id) return false

    return true
  })

  if (relevantes.length === 0) return null

  return (
    <div className="space-y-2">
      {relevantes.map((c) => (
        <Card
          key={c.id}
          className="border-l-4 border-l-primary bg-primary/5"
        >
          <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{c.titulo}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.descripcion}</p>
                <p className="mt-1 text-xs">
                  Disponible desde el {new Date(c.fecha_apertura).toLocaleDateString("es-EC")} - vence el{" "}
                  <span className="font-medium">{new Date(c.fecha_limite).toLocaleDateString("es-EC")}</span>
                </p>
              </div>
            </div>
            <FechaLimiteBadge fechaLimite={c.fecha_limite} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
