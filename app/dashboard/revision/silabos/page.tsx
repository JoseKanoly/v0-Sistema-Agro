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
import { CARRERAS } from "@/lib/mock/carreras"

export default function RevisionSilabosPage() {
  return (
    <AccessGuard roles={["secretaria", "coordinador_carrera", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { silabos, setSilabos, usuarios, agregarNotificacion } = useData()
  const [tab, setTab] = useState<EstadoRevision>("pendiente")

  if (!user) return null

  let visibles = silabos
  if (user.rol === "coordinador_carrera" && user.carrera_id) {
    visibles = silabos.filter((s) => s.carrera_id === user.carrera_id)
  }
  const filtrados = visibles.filter((s) => s.estado === tab)

  const aprobar = (id: string) => {
    const s = silabos.find((x) => x.id === id)
    if (!s) return
    setSilabos((prev) => prev.map((x) => (x.id === id ? { ...x, estado: "aprobado", observaciones: null } : x)))
    agregarNotificacion({
      destinatario_id: s.docente_id,
      titulo: "Silabo aprobado",
      mensaje: `Tu silabo de ${s.materia} fue aprobado.`,
      tipo: "exito",
    })
  }

  const rechazar = (id: string, motivo: string) => {
    const s = silabos.find((x) => x.id === id)
    if (!s) return
    setSilabos((prev) => prev.map((x) => (x.id === id ? { ...x, estado: "rechazado", observaciones: motivo } : x)))
    agregarNotificacion({
      destinatario_id: s.docente_id,
      titulo: "Silabo rechazado",
      mensaje: motivo,
      tipo: "error",
    })
  }

  const counts = {
    pendiente: visibles.filter((s) => s.estado === "pendiente").length,
    aprobado: visibles.filter((s) => s.estado === "aprobado").length,
    rechazado: visibles.filter((s) => s.estado === "rechazado").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Revision de silabos" description="Silabos enviados por docentes" />

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
                Sin silabos en este estado.
              </CardContent>
            </Card>
          ) : (
            filtrados.map((s) => {
              const doc = usuarios.find((u) => u.id === s.docente_id)
              const carrera = CARRERAS.find((c) => c.id === s.carrera_id)
              return (
                <Card key={s.id}>
                  <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{s.materia}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc?.nombres} {doc?.apellidos} - {carrera?.nombre} - {s.archivo}
                      </p>
                      {s.observaciones && (
                        <p className="text-xs text-red-700">Obs: {s.observaciones}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <FechaLimiteBadge fechaLimite={s.fecha_limite} />
                      <StatusBadge estado={s.estado} />
                      {s.estado === "pendiente" && (
                        <ReviewActions onApprove={() => aprobar(s.id)} onReject={(m) => rechazar(s.id, m)} />
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
