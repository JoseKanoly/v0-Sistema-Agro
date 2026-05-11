"use client"

import { useRef, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"
import { TIPOS_DOCUMENTO_ESTUDIANTE, type TipoDocumentoEstudiante } from "@/lib/types/database"

export default function MisDocumentosPage() {
  return (
    <AccessGuard roles={["estudiante"]}>
      <DocumentosContent />
    </AccessGuard>
  )
}

function DocumentosContent() {
  const { user } = useAuth()
  const { documentos, setDocumentos, agregarNotificacion } = useData()
  const [uploadingFor, setUploadingFor] = useState<TipoDocumentoEstudiante | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  if (!user) return null
  const mios = documentos.filter((d) => d.estudiante_id === user.id)

  const handleUpload = (tipo: TipoDocumentoEstudiante) => {
    setUploadingFor(tipo)
    inputRef.current?.click()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadingFor) return
    if (!file.name.toLowerCase().endsWith(".pdf") && !file.type.includes("image")) {
      alert("Solo se permiten archivos PDF o imagenes")
      return
    }

    const existente = mios.find((d) => d.tipo === uploadingFor)
    const nuevo = {
      id: existente?.id ?? `doc-${Date.now()}`,
      estudiante_id: user.id,
      tipo: uploadingFor,
      nombre_archivo: file.name,
      fecha_subida: new Date().toISOString().slice(0, 10),
      estado: "pendiente" as const,
      observaciones: null,
      revisado_por: null,
      fecha_revision: null,
    }

    setDocumentos((prev) => {
      const filtered = prev.filter((d) => d.id !== existente?.id)
      return [...filtered, nuevo]
    })
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Documento subido",
      mensaje: `Tu documento "${TIPOS_DOCUMENTO_ESTUDIANTE.find((t) => t.id === uploadingFor)?.label}" fue enviado a revision.`,
      tipo: "info",
    })
    setUploadingFor(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis documentos"
        description="Sube y administra los documentos requeridos por secretaria"
      />

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleFile}
        className="hidden"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {TIPOS_DOCUMENTO_ESTUDIANTE.map((t) => {
          const doc = mios.find((d) => d.tipo === t.id)
          return (
            <Card key={t.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-primary/10 p-2 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{t.label}</CardTitle>
                      <CardDescription>{doc ? doc.nombre_archivo : "Sin archivo subido"}</CardDescription>
                    </div>
                  </div>
                  {doc && <StatusBadge estado={doc.estado} />}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {doc?.observaciones && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    <p className="font-medium">Observacion de secretaria:</p>
                    <p>{doc.observaciones}</p>
                  </div>
                )}
                {doc && (
                  <p className="text-xs text-muted-foreground">
                    Subido el {new Date(doc.fecha_subida).toLocaleDateString("es-EC")}
                  </p>
                )}
                <Button
                  onClick={() => handleUpload(t.id)}
                  variant={doc?.estado === "rechazado" || !doc ? "default" : "outline"}
                  className="w-full"
                  disabled={doc?.estado === "aprobado"}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {!doc ? "Subir archivo" : doc.estado === "rechazado" ? "Volver a subir" : doc.estado === "aprobado" ? "Aprobado" : "Reemplazar"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
