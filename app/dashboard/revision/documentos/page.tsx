"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { ReviewActions } from "@/components/review-actions"
import { ExportButtons } from "@/components/export-buttons"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TIPOS_DOCUMENTO_ESTUDIANTE,
  type EstadoRevision,
  type DocumentoEstudiante,
} from "@/lib/types/database"
import type { ExportColumn } from "@/lib/utils/export"

export default function RevisionDocumentosPage() {
  return (
    <AccessGuard roles={["secretaria", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { documentos, setDocumentos, usuarios, agregarNotificacion } = useData()
  const [tab, setTab] = useState<EstadoRevision>("pendiente")

  if (!user) return null

  const filtrados = documentos.filter((d) => d.estado === tab)

  const aprobar = (id: string) => {
    const doc = documentos.find((d) => d.id === id)
    if (!doc) return
    setDocumentos((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              estado: "aprobado",
              observaciones: null,
              revisado_por: user.id,
              fecha_revision: new Date().toISOString().slice(0, 10),
            }
          : d,
      ),
    )
    agregarNotificacion({
      destinatario_id: doc.estudiante_id,
      titulo: "Documento aprobado",
      mensaje: `Tu ${TIPOS_DOCUMENTO_ESTUDIANTE.find((t) => t.id === doc.tipo)?.label} fue aprobado.`,
      tipo: "exito",
    })
  }

  const rechazar = (id: string, motivo: string) => {
    const doc = documentos.find((d) => d.id === id)
    if (!doc) return
    setDocumentos((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              estado: "rechazado",
              observaciones: motivo,
              revisado_por: user.id,
              fecha_revision: new Date().toISOString().slice(0, 10),
            }
          : d,
      ),
    )
    agregarNotificacion({
      destinatario_id: doc.estudiante_id,
      titulo: "Documento rechazado",
      mensaje: motivo,
      tipo: "error",
    })
  }

  const counts = {
    pendiente: documentos.filter((d) => d.estado === "pendiente").length,
    aprobado: documentos.filter((d) => d.estado === "aprobado").length,
    rechazado: documentos.filter((d) => d.estado === "rechazado").length,
  }

  const columns: ExportColumn<DocumentoEstudiante>[] = [
    {
      header: "Estudiante",
      accessor: (r) => {
        const u = usuarios.find((x) => x.id === r.estudiante_id)
        return u ? `${u.nombres} ${u.apellidos}` : ""
      },
    },
    { header: "Cedula", accessor: (r) => usuarios.find((x) => x.id === r.estudiante_id)?.cedula ?? "" },
    {
      header: "Documento",
      accessor: (r) => TIPOS_DOCUMENTO_ESTUDIANTE.find((t) => t.id === r.tipo)?.label ?? r.tipo,
    },
    { header: "Archivo", accessor: (r) => r.nombre_archivo },
    { header: "Fecha subida", accessor: (r) => r.fecha_subida },
    { header: "Estado", accessor: (r) => r.estado },
    { header: "Observaciones", accessor: (r) => r.observaciones ?? "" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revision de documentos de estudiantes"
        description="Aprueba o rechaza los documentos subidos"
        actions={
          <ExportButtons
            filename="revision_documentos"
            title="Revision de documentos de estudiantes"
            columns={columns}
            rows={documentos}
          />
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as EstadoRevision)}>
        <TabsList>
          <TabsTrigger value="pendiente">
            En revision <Badge variant="secondary" className="ml-2">{counts.pendiente}</Badge>
          </TabsTrigger>
          <TabsTrigger value="aprobado">
            Aprobados <Badge variant="secondary" className="ml-2">{counts.aprobado}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rechazado">
            Rechazados <Badge variant="secondary" className="ml-2">{counts.rechazado}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-2">
          {filtrados.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Sin documentos en este estado.
              </CardContent>
            </Card>
          ) : (
            filtrados.map((d) => {
              const est = usuarios.find((u) => u.id === d.estudiante_id)
              const tipoLabel = TIPOS_DOCUMENTO_ESTUDIANTE.find((t) => t.id === d.tipo)?.label
              return (
                <Card key={d.id}>
                  <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{est?.nombres} {est?.apellidos}</p>
                        <Badge variant="outline">{tipoLabel}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {d.nombre_archivo} - Subido el {new Date(d.fecha_subida).toLocaleDateString("es-EC")}
                      </p>
                      {d.observaciones && (
                        <p className="text-xs text-red-700">Obs: {d.observaciones}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge estado={d.estado} />
                      {d.estado === "pendiente" && (
                        <ReviewActions
                          onApprove={() => aprobar(d.id)}
                          onReject={(m) => rechazar(d.id, m)}
                        />
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
