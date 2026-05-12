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
import { Upload, BookOpen, Plus } from "lucide-react"
import type { Silabo } from "@/lib/types/database"
import type { ExportColumn } from "@/lib/utils/export"

const HOY = new Date().toISOString().slice(0, 10)

export default function SilabosPage() {
  return (
    <AccessGuard roles={["docente"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { silabos, setSilabos, fechasLimite, agregarNotificacion } = useData()
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const newInputRef = useRef<HTMLInputElement>(null)
  const replaceId = useRef<string | null>(null)
  const [nueva, setNueva] = useState({ materia: "", archivoNombre: "" })
  const [showForm, setShowForm] = useState(false)

  if (!user) return null

  const mios = silabos.filter((s) => s.docente_id === user.id)

  // Convocatoria activa de silabos para este usuario
  const convocatoria = fechasLimite.find(
    (f) =>
      f.activa &&
      f.tipo === "silabo" &&
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
    setSilabos((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              archivo: file.name,
              fecha_subida: HOY,
              estado: "pendiente",
              observaciones: null,
            }
          : s,
      ),
    )
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Silabo enviado a revision",
      mensaje: "Tu silabo fue actualizado y esta a la espera de aprobacion.",
      tipo: "info",
    })
    if (replaceInputRef.current) replaceInputRef.current.value = ""
  }

  const onNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !nueva.materia || !user.carrera_id || !convocatoria) return
    const item: Silabo = {
      id: `sil-${Date.now()}`,
      docente_id: user.id,
      carrera_id: user.carrera_id,
      materia: nueva.materia,
      archivo: file.name,
      fecha_subida: HOY,
      fecha_limite: convocatoria.fecha_limite,
      estado: "pendiente",
      observaciones: null,
    }
    setSilabos((prev) => [item, ...prev])
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Silabo enviado",
      mensaje: `Tu silabo de ${nueva.materia} fue enviado a revision.`,
      tipo: "info",
    })
    setNueva({ materia: "", archivoNombre: "" })
    setShowForm(false)
    if (newInputRef.current) newInputRef.current.value = ""
  }

  const triggerNew = () => {
    if (!nueva.materia) return
    newInputRef.current?.click()
  }

  const columns: ExportColumn<Silabo>[] = [
    { header: "Materia", accessor: (r) => r.materia },
    { header: "Archivo", accessor: (r) => r.archivo },
    { header: "Fecha subida", accessor: (r) => r.fecha_subida },
    { header: "Fecha limite", accessor: (r) => r.fecha_limite },
    { header: "Estado", accessor: (r) => r.estado },
    { header: "Observaciones", accessor: (r) => r.observaciones ?? "" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis silabos"
        description="Sube y administra los silabos de tus asignaturas"
        actions={
          <div className="flex gap-2">
            <ExportButtons
              filename={`silabos_${user.cedula}`}
              title="Mis silabos"
              subtitle={`${user.nombres} ${user.apellidos}`}
              columns={columns}
              rows={mios}
            />
            {convocatoria && (
              <Button onClick={() => setShowForm((v) => !v)}>
                <Plus className="mr-2 h-4 w-4" />
                {showForm ? "Cancelar" : "Subir nuevo silabo"}
              </Button>
            )}
          </div>
        }
      />

      <ConvocatoriaBanner tipos={["silabo"]} />

      <input ref={replaceInputRef} type="file" accept=".pdf" onChange={onReplace} className="hidden" />
      <input ref={newInputRef} type="file" accept=".pdf" onChange={onNew} className="hidden" />

      {showForm && convocatoria && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subir un silabo nuevo</CardTitle>
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
                  value={nueva.materia}
                  onChange={(e) => setNueva({ ...nueva, materia: e.target.value })}
                  placeholder="Ej: Sanidad animal"
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={triggerNew} disabled={!nueva.materia}>
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
              No tienes silabos registrados. {convocatoria ? "Usa el boton de arriba para subir uno." : ""}
            </CardContent>
          </Card>
        ) : (
          mios.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{s.materia}</p>
                    <p className="text-xs text-muted-foreground">{s.archivo}</p>
                    {s.observaciones && (
                      <p className="text-xs text-red-700">Obs: {s.observaciones}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <FechaLimiteBadge fechaLimite={s.fecha_limite} />
                  <StatusBadge estado={s.estado} />
                  <Button size="sm" variant="outline" onClick={() => onPickReplace(s.id)}>
                    <Upload className="mr-2 h-3.5 w-3.5" />
                    {s.estado === "rechazado" ? "Volver a subir" : "Reemplazar"}
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
