"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { ReviewActions } from "@/components/review-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TIPOS_FALTA, type EstadoRevision } from "@/lib/types/database"

export default function RevisionJustificacionesPage() {
  return (
    <AccessGuard roles={["secretaria", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { justificaciones, setJustificaciones, usuarios, agregarNotificacion } = useData()
  const [tab, setTab] = useState<EstadoRevision>("pendiente")

  if (!user) return null
  const filtrados = justificaciones.filter((j) => j.estado === tab)

  const aprobar = (id: string) => {
    const j = justificaciones.find((x) => x.id === id)
    if (!j) return
    setJustificaciones((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, estado: "aprobado", observaciones: null, revisado_por: user.id, fecha_revision: new Date().toISOString().slice(0, 10) }
          : x,
      ),
    )
    agregarNotificacion({
      destinatario_id: j.solicitante_id,
      titulo: "Justificacion aprobada",
      mensaje: `Tu justificacion para ${j.materia} fue aprobada.`,
      tipo: "exito",
    })
  }

  const rechazar = (id: string, motivo: string) => {
    const j = justificaciones.find((x) => x.id === id)
    if (!j) return
    setJustificaciones((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, estado: "rechazado", observaciones: motivo, revisado_por: user.id, fecha_revision: new Date().toISOString().slice(0, 10) }
          : x,
      ),
    )
    agregarNotificacion({
      destinatario_id: j.solicitante_id,
      titulo: "Justificacion rechazada",
      mensaje: motivo,
      tipo: "error",
    })
  }

  const counts = {
    pendiente: justificaciones.filter((j) => j.estado === "pendiente").length,
    aprobado: justificaciones.filter((j) => j.estado === "aprobado").length,
    rechazado: justificaciones.filter((j) => j.estado === "rechazado").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Revision de justificaciones" description="Estudiantes y docentes" />

      <Tabs value={tab} onValueChange={(v) => setTab(v as EstadoRevision)}>
        <TabsList>
          <TabsTrigger value="pendiente">
            En revision <Badge variant="secondary" className="ml-2">{counts.pendiente}</Badge>
          </TabsTrigger>
          <TabsTrigger value="aprobado">
            Aprobadas <Badge variant="secondary" className="ml-2">{counts.aprobado}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rechazado">
            Rechazadas <Badge variant="secondary" className="ml-2">{counts.rechazado}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-2">
          {filtrados.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Sin justificaciones en este estado.
              </CardContent>
            </Card>
          ) : (
            filtrados.map((j) => {
              const u = usuarios.find((x) => x.id === j.solicitante_id)
              return (
                <Card key={j.id}>
                  <CardContent className="space-y-3 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{u?.nombres} {u?.apellidos}</p>
                          <Badge variant="outline" className="capitalize">{j.rol_solicitante}</Badge>
                          <Badge variant="secondary">{TIPOS_FALTA.find((t) => t.id === j.tipo)?.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {j.materia} - {j.fecha_inicio === j.fecha_fin ? j.fecha_inicio : `${j.fecha_inicio} a ${j.fecha_fin}`} - {j.horas_justificadas}h
                        </p>
                      </div>
                      <StatusBadge estado={j.estado} />
                    </div>
                    <p className="text-sm">{j.motivo}</p>
                    {j.archivo_adjunto && (
                      <p className="text-xs text-muted-foreground">Adjunto: {j.archivo_adjunto}</p>
                    )}
                    {j.estado === "pendiente" && (
                      <ReviewActions onApprove={() => aprobar(j.id)} onReject={(m) => rechazar(j.id, m)} />
                    )}
                    {j.observaciones && (
                      <p className="text-xs text-red-700">Motivo del rechazo: {j.observaciones}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
