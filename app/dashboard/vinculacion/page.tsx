"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, FechaLimiteBadge } from "@/components/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, Handshake } from "lucide-react"
import { useRef } from "react"

export default function VinculacionPage() {
  return (
    <AccessGuard roles={["docente"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { vinculacion, setVinculacion, agregarNotificacion } = useData()
  const inputRef = useRef<HTMLInputElement>(null)
  const replaceRef = useRef<string | null>(null)

  if (!user) return null

  if (!user.tiene_vinculacion) {
    return (
      <div className="space-y-6">
        <PageHeader title="Vinculacion" description="Modulo de reportes de vinculacion con la comunidad" />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Handshake className="h-10 w-10" />
            <p className="text-sm">No tienes un proyecto de vinculacion asignado.</p>
            <p className="text-xs">Si crees que es un error, contacta a secretaria.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const mios = vinculacion.filter((v) => v.docente_id === user.id)

  const onPick = (id: string) => {
    replaceRef.current = id
    inputRef.current?.click()
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const id = replaceRef.current
    if (!file || !id) return
    setVinculacion((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              archivo: file.name,
              fecha_subida: new Date().toISOString().slice(0, 10),
              estado: "pendiente",
              observaciones: null,
            }
          : v,
      ),
    )
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Reporte de vinculacion enviado",
      mensaje: "Tu reporte fue enviado a revision.",
      tipo: "info",
    })
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vinculacion con la sociedad"
        description="Sube tus reportes mensuales y el reporte final del proyecto"
      />

      <input ref={inputRef} type="file" accept=".pdf" onChange={onFile} className="hidden" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Asignacion activa</CardTitle>
          <CardDescription>Reportes mensuales requeridos durante el proyecto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {mios.map((v) => (
            <div
              key={v.id}
              className="flex flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">{v.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {v.archivo} - <Badge variant="outline">{v.tipo === "final" ? "Final" : "Mensual"}</Badge>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <FechaLimiteBadge fechaLimite={v.fecha_limite} />
                <StatusBadge estado={v.estado} />
                <Button size="sm" variant="outline" onClick={() => onPick(v.id)}>
                  <Upload className="mr-2 h-3.5 w-3.5" /> Reemplazar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
