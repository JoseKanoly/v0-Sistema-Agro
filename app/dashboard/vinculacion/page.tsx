"use client"

import { useRef, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, FechaLimiteBadge } from "@/components/status-badge"
import { ConvocatoriaBanner } from "@/components/convocatoria-banner"
import { ExportButtons } from "@/components/export-buttons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Handshake, Plus } from "lucide-react"
import type { ReporteVinculacion } from "@/lib/types/database"
import type { ExportColumn } from "@/lib/utils/export"

const HOY = new Date().toISOString().slice(0, 10)

export default function VinculacionPage() {
  return (
    <AccessGuard roles={["docente"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { vinculacion, setVinculacion, fechasLimite, agregarNotificacion } = useData()
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const newInputRef = useRef<HTMLInputElement>(null)
  const replaceId = useRef<string | null>(null)
  const [nuevo, setNuevo] = useState<{ tipo: "mensual" | "final"; mes: string; titulo: string }>({
    tipo: "mensual",
    mes: "",
    titulo: "",
  })
  const [showForm, setShowForm] = useState(false)

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

  const convocatoria = fechasLimite.find(
    (f) =>
      f.activa &&
      (f.tipo === "vinculacion_mensual" || f.tipo === "vinculacion_final") &&
      f.fecha_apertura <= HOY &&
      (f.audiencia === "docentes" || f.audiencia === "ambos") &&
      (!f.carrera_id || f.carrera_id === user.carrera_id),
  )

  const onPickReplace = (id: string) => {
    replaceId.current = id
    replaceInputRef.current?.click()
  }

  const onReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const id = replaceId.current
    if (!file || !id) return
    setVinculacion((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              archivo: file.name,
              fecha_subida: HOY,
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
    if (replaceInputRef.current) replaceInputRef.current.value = ""
  }

  const onNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !nuevo.titulo || !convocatoria) return
    const item: ReporteVinculacion = {
      id: `vin-${Date.now()}`,
      docente_id: user.id,
      tipo: nuevo.tipo,
      mes: nuevo.tipo === "mensual" ? nuevo.mes : null,
      titulo: nuevo.titulo,
      archivo: file.name,
      fecha_subida: HOY,
      fecha_limite: convocatoria.fecha_limite,
      estado: "pendiente",
      observaciones: null,
    }
    setVinculacion((prev) => [item, ...prev])
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Reporte de vinculacion enviado",
      mensaje: `${nuevo.titulo} - enviado a revision.`,
      tipo: "info",
    })
    setNuevo({ tipo: "mensual", mes: "", titulo: "" })
    setShowForm(false)
    if (newInputRef.current) newInputRef.current.value = ""
  }

  const columns: ExportColumn<ReporteVinculacion>[] = [
    { header: "Titulo", accessor: (r) => r.titulo },
    { header: "Tipo", accessor: (r) => (r.tipo === "final" ? "Final" : "Mensual") },
    { header: "Mes", accessor: (r) => r.mes ?? "" },
    { header: "Archivo", accessor: (r) => r.archivo },
    { header: "Fecha subida", accessor: (r) => r.fecha_subida },
    { header: "Fecha limite", accessor: (r) => r.fecha_limite },
    { header: "Estado", accessor: (r) => r.estado },
    { header: "Observaciones", accessor: (r) => r.observaciones ?? "" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vinculacion con la sociedad"
        description="Sube tus reportes mensuales y el reporte final del proyecto"
        actions={
          <div className="flex gap-2">
            <ExportButtons
              filename={`vinculacion_${user.cedula}`}
              title="Reportes de vinculacion"
              subtitle={`${user.nombres} ${user.apellidos}`}
              columns={columns}
              rows={mios}
            />
            {convocatoria && (
              <Button onClick={() => setShowForm((v) => !v)}>
                <Plus className="mr-2 h-4 w-4" />
                {showForm ? "Cancelar" : "Subir nuevo reporte"}
              </Button>
            )}
          </div>
        }
      />

      <ConvocatoriaBanner tipos={["vinculacion_mensual", "vinculacion_final"]} />

      <input ref={replaceInputRef} type="file" accept=".pdf" onChange={onReplace} className="hidden" />
      <input ref={newInputRef} type="file" accept=".pdf" onChange={onNew} className="hidden" />

      {showForm && convocatoria && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subir un reporte nuevo</CardTitle>
            <CardDescription>
              Convocatoria activa: {convocatoria.titulo} - vence el{" "}
              {new Date(convocatoria.fecha_limite).toLocaleDateString("es-EC")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select
                value={nuevo.tipo}
                onValueChange={(v) => setNuevo({ ...nuevo, tipo: v as "mensual" | "final" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mes">Mes (si es mensual)</Label>
              <Input
                id="mes"
                value={nuevo.mes}
                onChange={(e) => setNuevo({ ...nuevo, mes: e.target.value })}
                placeholder="Ej: Mayo 2026"
                disabled={nuevo.tipo === "final"}
              />
            </div>
            <div className="space-y-1.5 md:col-span-3">
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                value={nuevo.titulo}
                onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
                placeholder="Ej: Reporte mensual de practicas - Mayo"
              />
            </div>
            <div className="md:col-span-3">
              <Button type="button" onClick={() => newInputRef.current?.click()} disabled={!nuevo.titulo}>
                <Upload className="mr-2 h-4 w-4" /> Seleccionar PDF y enviar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mis reportes</CardTitle>
          <CardDescription>Estado de cada reporte enviado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {mios.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No tienes reportes registrados.
            </p>
          ) : (
            mios.map((v) => (
              <div
                key={v.id}
                className="flex flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">{v.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.archivo} - <Badge variant="outline">{v.tipo === "final" ? "Final" : `Mensual ${v.mes ?? ""}`}</Badge>
                  </p>
                  {v.observaciones && <p className="text-xs text-red-700">Obs: {v.observaciones}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <FechaLimiteBadge fechaLimite={v.fecha_limite} />
                  <StatusBadge estado={v.estado} />
                  <Button size="sm" variant="outline" onClick={() => onPickReplace(v.id)}>
                    <Upload className="mr-2 h-3.5 w-3.5" /> Reemplazar
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
