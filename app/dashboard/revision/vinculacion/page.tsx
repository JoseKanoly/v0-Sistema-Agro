"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, FechaLimiteBadge } from "@/components/status-badge"
import { ReviewActions } from "@/components/review-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { EstadoRevision } from "@/lib/types/database"

export default function RevisionVinculacionPage() {
  return (
    <AccessGuard roles={["secretaria", "coordinador_carrera", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { vinculacion, setVinculacion, usuarios, agregarNotificacion } = useData()
  const [tab, setTab] = useState<EstadoRevision>("pendiente")

  if (!user) return null

  let visibles = vinculacion
  if (user.rol === "coordinador_carrera" && user.carrera_id) {
    visibles = vinculacion.filter((v) => {
      const doc = usuarios.find((u) => u.id === v.docente_id)
      return doc?.carrera_id === user.carrera_id
    })
  }
  const filtrados = visibles.filter((v) => v.estado === tab)

  const aprobar = (id: string) => {
    const v = vinculacion.find((x) => x.id === id)
    if (!v) return
    setVinculacion((prev) => prev.map((x) => (x.id === id ? { ...x, estado: "aprobado", observaciones: null } : x)))
    agregarNotificacion({
      destinatario_id: v.docente_id,
      titulo: "Reporte de vinculacion aprobado",
      mensaje: v.titulo,
      tipo: "exito",
    })
  }

  const rechazar = (id: string, motivo: string) => {
    const v = vinculacion.find((x) => x.id === id)
    if (!v) return
    setVinculacion((prev) => prev.map((x) => (x.id === id ? { ...x, estado: "rechazado", observaciones: motivo } : x)))
    agregarNotificacion({
      destinatario_id: v.docente_id,
      titulo: "Reporte de vinculacion rechazado",
      mensaje: motivo,
      tipo: "error",
    })
  }

  const counts = {
    pendiente: visibles.filter((v) => v.estado === "pendiente").length,
    aprobado: visibles.filter((v) => v.estado === "aprobado").length,
    rechazado: visibles.filter((v) => v.estado === "rechazado").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Revision de vinculacion" description="Reportes mensuales y finales" />

      <Tabs value={tab} onValueChange={(v) => setTab(v as EstadoRevision)}>
        <TabsList>
          <TabsTrigger value="pendiente">
            En revision <Badge variant="secondary" className="ml-2">{counts.pendiente}</Badge>
          </TabsTrigger>
          <TabsTrigger value="aprobado">Aprobados <Badge variant="secondary" className="ml-2">{counts.aprobado}</Badge></TabsTrigger>
          <TabsTrigger value="rechazado">Rechazados <Badge variant="secondary" className="ml-2">{counts.rechazado}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-2">
          {filtrados.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Sin reportes en este estado.
              </CardContent>
            </Card>
          ) : (
            filtrados.map((v) => {
              const doc = usuarios.find((u) => u.id === v.docente_id)
              return (
                <Card key={v.id}>
                  <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{v.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc?.nombres} {doc?.apellidos} - <Badge variant="outline">{v.tipo === "final" ? "Final" : `Mensual ${v.mes ?? ""}`}</Badge>
                      </p>
                      {v.observaciones && (
                        <p className="text-xs text-red-700">Obs: {v.observaciones}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <FechaLimiteBadge fechaLimite={v.fecha_limite} />
                      <StatusBadge estado={v.estado} />
                      {v.estado === "pendiente" && (
                        <ReviewActions onApprove={() => aprobar(v.id)} onReject={(m) => rechazar(v.id, m)} />
                      )}
                    </div>
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
