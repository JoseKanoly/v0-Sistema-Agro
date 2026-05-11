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

export default function RevisionInformesPage() {
  return (
    <AccessGuard roles={["secretaria", "coordinador_carrera", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { informes, setInformes, usuarios, agregarNotificacion } = useData()
  const [tab, setTab] = useState<EstadoRevision>("pendiente")

  if (!user) return null

  let visibles = informes
  if (user.rol === "coordinador_carrera" && user.carrera_id) {
    visibles = informes.filter((i) => i.carrera_id === user.carrera_id)
  }
  const filtrados = visibles.filter((i) => i.estado === tab)

  const aprobar = (id: string) => {
    const i = informes.find((x) => x.id === id)
    if (!i) return
    setInformes((prev) => prev.map((x) => (x.id === id ? { ...x, estado: "aprobado", observaciones: null } : x)))
    agregarNotificacion({
      destinatario_id: i.docente_id,
      titulo: "Informe aprobado",
      mensaje: `Tu informe de ${i.materia} fue aprobado.`,
      tipo: "exito",
    })
  }

  const rechazar = (id: string, motivo: string) => {
    const i = informes.find((x) => x.id === id)
    if (!i) return
    setInformes((prev) => prev.map((x) => (x.id === id ? { ...x, estado: "rechazado", observaciones: motivo } : x)))
    agregarNotificacion({
      destinatario_id: i.docente_id,
      titulo: "Informe rechazado",
      mensaje: motivo,
      tipo: "error",
    })
  }

  const counts = {
    pendiente: visibles.filter((i) => i.estado === "pendiente").length,
    aprobado: visibles.filter((i) => i.estado === "aprobado").length,
    rechazado: visibles.filter((i) => i.estado === "rechazado").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Revision de informes" description="Informes de asignatura enviados" />

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
                Sin informes en este estado.
              </CardContent>
            </Card>
          ) : (
            filtrados.map((i) => {
              const doc = usuarios.find((u) => u.id === i.docente_id)
              const carrera = CARRERAS.find((c) => c.id === i.carrera_id)
              return (
                <Card key={i.id}>
                  <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{i.materia}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc?.nombres} {doc?.apellidos} - {carrera?.nombre} - {i.archivo} - Periodo {i.periodo}
                      </p>
                      {i.observaciones && (
                        <p className="text-xs text-red-700">Obs: {i.observaciones}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <FechaLimiteBadge fechaLimite={i.fecha_limite} />
                      <StatusBadge estado={i.estado} />
                      {i.estado === "pendiente" && (
                        <ReviewActions onApprove={() => aprobar(i.id)} onReject={(m) => rechazar(i.id, m)} />
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
