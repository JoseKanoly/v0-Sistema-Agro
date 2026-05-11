"use client"

import { useState } from "react"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { FechaLimiteBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarClock, Plus, Trash2 } from "lucide-react"

const TIPO_LABELS = {
  silabo: "Silabos",
  informe: "Informes",
  vinculacion_mensual: "Vinculacion mensual",
  vinculacion_final: "Vinculacion final",
  documento_estudiante: "Documentos estudiantes",
} as const

export default function FechasLimitePage() {
  return (
    <AccessGuard roles={["secretaria", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { fechasLimite, setFechasLimite } = useData()
  const [form, setForm] = useState({
    tipo: "silabo" as keyof typeof TIPO_LABELS,
    descripcion: "",
    fecha_limite: "",
  })

  const agregar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.descripcion || !form.fecha_limite) return
    setFechasLimite((prev) => [
      ...prev,
      { id: `fl-${Date.now()}`, ...form, carrera_id: null },
    ])
    setForm({ tipo: "silabo", descripcion: "", fecha_limite: "" })
  }

  const eliminar = (id: string) => setFechasLimite((prev) => prev.filter((f) => f.id !== id))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fechas limite"
        description="Define los plazos institucionales del periodo"
      />

      <Card>
        <CardContent className="py-4">
          <form onSubmit={agregar} className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as typeof form.tipo })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Descripcion</Label>
              <Input
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Ej: Entrega de silabos 2026-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fecha limite</Label>
              <Input
                type="date"
                value={form.fecha_limite}
                onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })}
              />
            </div>
            <div className="sm:col-span-4">
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" /> Agregar fecha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {fechasLimite.map((f) => (
          <Card key={f.id}>
            <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{f.descripcion}</p>
                  <p className="text-xs text-muted-foreground">
                    {TIPO_LABELS[f.tipo]} - vence {new Date(f.fecha_limite).toLocaleDateString("es-EC")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FechaLimiteBadge fechaLimite={f.fecha_limite} />
                <Button size="sm" variant="ghost" onClick={() => eliminar(f.id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
