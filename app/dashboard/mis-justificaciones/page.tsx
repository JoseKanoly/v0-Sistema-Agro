"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TIPOS_FALTA, type Justificacion, type TipoFalta } from "@/lib/types/database"
import { Plus, FileUp } from "lucide-react"

export default function MisJustificacionesPage() {
  return (
    <AccessGuard roles={["estudiante", "docente"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { justificaciones, setJustificaciones, agregarNotificacion } = useData()
  const [showForm, setShowForm] = useState(false)

  if (!user) return null
  const mias = justificaciones.filter((j) => j.solicitante_id === user.id)

  const [form, setForm] = useState({
    materia: "",
    fecha_inicio: "",
    fecha_fin: "",
    horas: 2,
    tipo: "enfermedad" as TipoFalta,
    motivo: "",
    archivo: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nueva: Justificacion = {
      id: `jus-${Date.now()}`,
      solicitante_id: user.id,
      rol_solicitante: user.rol === "docente" ? "docente" : "estudiante",
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin || form.fecha_inicio,
      materia: form.materia,
      horas_justificadas: Number(form.horas),
      motivo: form.motivo,
      tipo: form.tipo,
      archivo_adjunto: form.archivo || null,
      estado: "pendiente",
      observaciones: null,
      revisado_por: null,
      fecha_solicitud: new Date().toISOString().slice(0, 10),
      fecha_revision: null,
    }
    setJustificaciones((prev) => [nueva, ...prev])
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Justificacion enviada",
      mensaje: `Tu justificacion para ${form.materia} esta en revision.`,
      tipo: "info",
    })
    setShowForm(false)
    setForm({ materia: "", fecha_inicio: "", fecha_fin: "", horas: 2, tipo: "enfermedad", motivo: "", archivo: "" })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.rol === "docente" ? "Justificar inasistencia" : "Mis justificaciones"}
        description="Solicitudes de justificacion de faltas"
        actions={
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus className="mr-2 h-4 w-4" /> {showForm ? "Cancelar" : "Nueva justificacion"}
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva solicitud</CardTitle>
            <CardDescription>Adjunta un documento de respaldo cuando aplique.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="materia">Materia / Asignatura</Label>
                <Input
                  id="materia"
                  value={form.materia}
                  required
                  onChange={(e) => setForm({ ...form, materia: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fi">Fecha de inicio</Label>
                <Input
                  id="fi"
                  type="date"
                  value={form.fecha_inicio}
                  required
                  onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ff">Fecha fin (opcional)</Label>
                <Input
                  id="ff"
                  type="date"
                  value={form.fecha_fin}
                  onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="horas">Horas a justificar</Label>
                <Input
                  id="horas"
                  type="number"
                  min={1}
                  max={8}
                  value={form.horas}
                  onChange={(e) => setForm({ ...form, horas: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo de falta</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as TipoFalta })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_FALTA.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="motivo">Motivo</Label>
                <Textarea
                  id="motivo"
                  rows={3}
                  value={form.motivo}
                  required
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="archivo">Documento de respaldo (nombre del archivo)</Label>
                <div className="flex gap-2">
                  <FileUp className="mt-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="archivo"
                    placeholder="certificado_medico.pdf"
                    value={form.archivo}
                    onChange={(e) => setForm({ ...form, archivo: e.target.value })}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Enviar solicitud</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {mias.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No tienes justificaciones registradas.
            </CardContent>
          </Card>
        ) : (
          mias.map((j) => (
            <Card key={j.id}>
              <CardContent className="space-y-2 py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{j.materia}</p>
                    <p className="text-xs text-muted-foreground">
                      {j.fecha_inicio === j.fecha_fin ? j.fecha_inicio : `${j.fecha_inicio} - ${j.fecha_fin}`} - {j.horas_justificadas}h - {TIPOS_FALTA.find((t) => t.id === j.tipo)?.label}
                    </p>
                  </div>
                  <StatusBadge estado={j.estado} />
                </div>
                <p className="text-sm">{j.motivo}</p>
                {j.archivo_adjunto && (
                  <p className="text-xs text-muted-foreground">Adjunto: {j.archivo_adjunto}</p>
                )}
                {j.observaciones && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-800">
                    {j.observaciones}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
