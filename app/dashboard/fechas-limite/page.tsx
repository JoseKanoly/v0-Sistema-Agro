"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { FechaLimiteBadge } from "@/components/status-badge"
import { ExportButtons } from "@/components/export-buttons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TIPOS_CONVOCATORIA,
  type TipoConvocatoria,
  type AudienciaConvocatoria,
  type CarreraId,
  type FechaLimite,
} from "@/lib/types/database"
import { CARRERAS } from "@/lib/mock/carreras"
import { CalendarClock, Plus, Trash2, Power } from "lucide-react"
import type { ExportColumn } from "@/lib/utils/export"

export default function FechasLimitePage() {
  return (
    <AccessGuard roles={["secretaria", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

interface FormState {
  tipo: TipoConvocatoria
  titulo: string
  descripcion: string
  audiencia: AudienciaConvocatoria
  carrera_id: CarreraId | "todas"
  fecha_apertura: string
  fecha_limite: string
}

const EMPTY: FormState = {
  tipo: "silabo",
  titulo: "",
  descripcion: "",
  audiencia: "docentes",
  carrera_id: "todas",
  fecha_apertura: new Date().toISOString().slice(0, 10),
  fecha_limite: "",
}

function tipoLabel(t: TipoConvocatoria) {
  return TIPOS_CONVOCATORIA.find((x) => x.id === t)?.label ?? t
}

function Content() {
  const { user } = useAuth()
  const { fechasLimite, setFechasLimite, usuarios, setNotificaciones } = useData()
  const [form, setForm] = useState<FormState>(EMPTY)

  if (!user) return null

  const onTipoChange = (t: TipoConvocatoria) => {
    const tipoData = TIPOS_CONVOCATORIA.find((x) => x.id === t)
    setForm((prev) => ({
      ...prev,
      tipo: t,
      audiencia: tipoData?.audiencia ?? prev.audiencia,
    }))
  }

  const notificarAudiencia = (conv: FechaLimite) => {
    // Determinar destinatarios segun audiencia + carrera
    const destinatarios = usuarios.filter((u) => {
      if (!u.activo) return false
      const aud = conv.audiencia
      const rolMatch =
        aud === "ambos"
          ? u.rol === "docente" || u.rol === "estudiante"
          : aud === "docentes"
            ? u.rol === "docente"
            : u.rol === "estudiante"
      if (!rolMatch) return false
      if (conv.carrera_id && u.carrera_id !== conv.carrera_id) return false
      return true
    })

    const now = new Date().toISOString().slice(0, 10)
    setNotificaciones((prev) => [
      ...destinatarios.map((d, idx) => ({
        id: `not-${Date.now()}-${idx}`,
        destinatario_id: d.id,
        titulo: `Nueva convocatoria: ${conv.titulo}`,
        mensaje: `${conv.descripcion} Vence el ${new Date(conv.fecha_limite).toLocaleDateString("es-EC")}.`,
        tipo: "info" as const,
        leida: false,
        fecha: now,
      })),
      ...prev,
    ])
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo || !form.descripcion || !form.fecha_limite) return

    const nueva: FechaLimite = {
      id: `fl-${Date.now()}`,
      tipo: form.tipo,
      titulo: form.titulo,
      descripcion: form.descripcion,
      fecha_apertura: form.fecha_apertura,
      fecha_limite: form.fecha_limite,
      audiencia: form.audiencia,
      carrera_id: form.carrera_id === "todas" ? null : form.carrera_id,
      creada_por: user.id,
      activa: true,
    }

    setFechasLimite((prev) => [nueva, ...prev])
    notificarAudiencia(nueva)
    setForm({ ...EMPTY, audiencia: form.audiencia })
  }

  const toggleActiva = (id: string) =>
    setFechasLimite((prev) => prev.map((f) => (f.id === id ? { ...f, activa: !f.activa } : f)))

  const eliminar = (id: string) => setFechasLimite((prev) => prev.filter((f) => f.id !== id))

  const columns: ExportColumn<FechaLimite>[] = [
    { header: "Titulo", accessor: (r) => r.titulo },
    { header: "Tipo", accessor: (r) => tipoLabel(r.tipo) },
    { header: "Audiencia", accessor: (r) => r.audiencia },
    {
      header: "Carrera",
      accessor: (r) => (r.carrera_id ? CARRERAS.find((c) => c.id === r.carrera_id)?.nombre ?? "" : "Todas"),
    },
    { header: "Apertura", accessor: (r) => r.fecha_apertura },
    { header: "Vence", accessor: (r) => r.fecha_limite },
    { header: "Activa", accessor: (r) => (r.activa ? "Si" : "No") },
  ]

  const activas = fechasLimite.filter((f) => f.activa)
  const inactivas = fechasLimite.filter((f) => !f.activa)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Convocatorias y fechas limite"
        description="Crea eventos para que docentes y estudiantes suban documentos. Al crear, se notifica automaticamente a la audiencia."
        actions={
          <ExportButtons
            filename="convocatorias"
            title="Convocatorias y fechas limite"
            subtitle="Listado completo de eventos institucionales"
            columns={columns}
            rows={fechasLimite}
          />
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crear nueva convocatoria</CardTitle>
          <CardDescription>
            Define el tipo, audiencia y plazo. Al guardar se enviara una notificacion a cada usuario objetivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tipo de convocatoria</Label>
              <Select value={form.tipo} onValueChange={(v) => onTipoChange(v as TipoConvocatoria)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_CONVOCATORIA.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Audiencia</Label>
              <Select
                value={form.audiencia}
                onValueChange={(v) => setForm({ ...form, audiencia: v as AudienciaConvocatoria })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docentes">Solo docentes</SelectItem>
                  <SelectItem value="estudiantes">Solo estudiantes</SelectItem>
                  <SelectItem value="ambos">Ambos (docentes y estudiantes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ej: Entrega de silabos del periodo 2026-2"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="descripcion">Instrucciones / descripcion</Label>
              <Textarea
                id="descripcion"
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Detalla que deben subir, formato y observaciones."
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Carrera</Label>
              <Select
                value={form.carrera_id}
                onValueChange={(v) => setForm({ ...form, carrera_id: v as CarreraId | "todas" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las carreras</SelectItem>
                  {CARRERAS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div />

            <div className="space-y-1.5">
              <Label htmlFor="apertura">Fecha de apertura</Label>
              <Input
                id="apertura"
                type="date"
                value={form.fecha_apertura}
                onChange={(e) => setForm({ ...form, fecha_apertura: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="limite">Fecha limite</Label>
              <Input
                id="limite"
                type="date"
                value={form.fecha_limite}
                onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" /> Crear y notificar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Convocatorias activas
          </h3>
          <Badge variant="secondary">{activas.length}</Badge>
        </div>
        <div className="space-y-2">
          {activas.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No hay convocatorias activas en este momento.
              </CardContent>
            </Card>
          )}
          {activas.map((f) => (
            <ConvocatoriaRow key={f.id} conv={f} onToggle={() => toggleActiva(f.id)} onDelete={() => eliminar(f.id)} />
          ))}
        </div>
      </section>

      {inactivas.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Convocatorias archivadas
          </h3>
          <div className="space-y-2">
            {inactivas.map((f) => (
              <ConvocatoriaRow key={f.id} conv={f} onToggle={() => toggleActiva(f.id)} onDelete={() => eliminar(f.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ConvocatoriaRow({
  conv,
  onToggle,
  onDelete,
}: {
  conv: FechaLimite
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <Card className={conv.activa ? "" : "opacity-60"}>
      <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">{conv.titulo}</p>
            <p className="text-xs text-muted-foreground">{conv.descripcion}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="text-xs">{tipoLabel(conv.tipo)}</Badge>
              <Badge variant="outline" className="text-xs capitalize">{conv.audiencia}</Badge>
              <Badge variant="outline" className="text-xs">
                {conv.carrera_id
                  ? CARRERAS.find((c) => c.id === conv.carrera_id)?.nombre
                  : "Todas las carreras"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Apertura {new Date(conv.fecha_apertura).toLocaleDateString("es-EC")} - vence{" "}
                {new Date(conv.fecha_limite).toLocaleDateString("es-EC")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FechaLimiteBadge fechaLimite={conv.fecha_limite} />
          <Button size="sm" variant="outline" onClick={onToggle}>
            <Power className="mr-1 h-3.5 w-3.5" />
            {conv.activa ? "Archivar" : "Activar"}
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
