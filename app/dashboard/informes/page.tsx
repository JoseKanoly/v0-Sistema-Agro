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
import { Upload, FileText, Plus } from "lucide-react"
import { PERIODO_ACTUAL } from "@/lib/mock/carreras"
import type { InformeAsignatura } from "@/lib/types/database"
import type { ExportColumn } from "@/lib/utils/export"

const HOY = new Date().toISOString().slice(0, 10)

export default function InformesPage() {
  return (
    <AccessGuard roles={["docente"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { informes, setInformes, fechasLimite, agregarNotificacion } = useData()
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const newInputRef = useRef<HTMLInputElement>(null)
  const replaceId = useRef<string | null>(null)
  const [nuevo, setNuevo] = useState({ materia: "" })
  const [showForm, setShowForm] = useState(false)

  if (!user) return null

  const mios = informes.filter((i) => i.docente_id === user.id)

  const convocatoria = fechasLimite.find(
    (f) =>
      f.activa &&
      f.tipo === "informe" &&
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
    setInformes((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              archivo: file.name,
              fecha_subida: HOY,
              estado: "pendiente",
              observaciones: null,
            }
          : i,
      ),
    )
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Informe enviado",
      mensaje: "Tu informe fue enviado a revision.",
      tipo: "info",
    })
    if (replaceInputRef.current) replaceInputRef.current.value = ""
  }

  const onNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !nuevo.materia || !user.carrera_id || !convocatoria) return
    const item: InformeAsignatura = {
      id: `inf-${Date.now()}`,
      docente_id: user.id,
      carrera_id: user.carrera_id,
      materia: nuevo.materia,
      periodo: PERIODO_ACTUAL,
      archivo: file.name,
      fecha_subida: HOY,
      fecha_limite: convocatoria.fecha_limite,
      estado: "pendiente",
      observaciones: null,
    }
    setInformes((prev) => [item, ...prev])
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Informe enviado",
      mensaje: `Tu informe de ${nuevo.materia} fue enviado a revision.`,
      tipo: "info",
    })
    setNuevo({ materia: "" })
    setShowForm(false)
    if (newInputRef.current) newInputRef.current.value = ""
  }

  const columns: ExportColumn<InformeAsignatura>[] = [
    { header: "Materia", accessor: (r) => r.materia },
    { header: "Periodo", accessor: (r) => r.periodo },
    { header: "Archivo", accessor: (r) => r.archivo },
    { header: "Fecha subida", accessor: (r) => r.fecha_subida },
    { header: "Fecha limite", accessor: (r) => r.fecha_limite },
    { header: "Estado", accessor: (r) => r.estado },
    { header: "Observaciones", accessor: (r) => r.observaciones ?? "" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis informes"
        description="Informes finales por asignatura del periodo"
        actions={
          <div className="flex gap-2">
            <ExportButtons
              filename={`informes_${user.cedula}`}
              title="Mis informes"
              subtitle={`${user.nombres} ${user.apellidos}`}
              columns={columns}
              rows={mios}
            />
            {convocatoria && (
              <Button onClick={() => setShowForm((v) => !v)}>
                <Plus className="mr-2 h-4 w-4" />
                {showForm ? "Cancelar" : "Subir nuevo informe"}
              </Button>
            )}
          </div>
        }
      />

      <ConvocatoriaBanner tipos={["informe"]} />

      <input ref={replaceInputRef} type="file" accept=".pdf" onChange={onReplace} className="hidden" />
      <input ref={newInputRef} type="file" accept=".pdf" onChange={onNew} className="hidden" />

      {showForm && convocatoria && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subir un informe nuevo</CardTitle>
            <CardDescription>
              Convocatoria activa: {convocatoria.titulo} - vence el{" "}
              {new Date(convocatoria.fecha_limite).toLocaleDateString("es-EC")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-1.5">
                <Label htmlFor="materia">Materia / Asignatura</Label>
                <Input
                  id="materia"
                  value={nuevo.materia}
                  onChange={(e) => setNuevo({ materia: e.target.value })}
                  placeholder="Ej: Microbiologia de alimentos"
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={() => newInputRef.current?.click()} disabled={!nuevo.materia}>
                  <Upload className="mr-2 h-4 w-4" /> Seleccionar PDF y enviar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {mios.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No tienes informes registrados. {convocatoria ? "Usa el boton de arriba para subir uno." : ""}
            </CardContent>
          </Card>
        ) : (
          mios.map((i) => (
            <Card key={i.id}>
              <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{i.materia}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.archivo} - Periodo {i.periodo}
                    </p>
                    {i.observaciones && (
                      <p className="text-xs text-red-700">Obs: {i.observaciones}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <FechaLimiteBadge fechaLimite={i.fecha_limite} />
                  <StatusBadge estado={i.estado} />
                  <Button size="sm" variant="outline" onClick={() => onPickReplace(i.id)}>
                    <Upload className="mr-2 h-3.5 w-3.5" /> Reemplazar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
