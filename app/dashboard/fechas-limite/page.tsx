"use client"

import { useState } from "react"
import { periodosMock } from "@/lib/mock/periodos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CalendarCheck, Plus, Pencil, Trash2, Clock } from "lucide-react"
import { toast } from "sonner"

interface Convocatoria {
  id: number
  titulo: string
  modulo: string
  fechaInicio: string
  fechaFin: string
  periodoId: number
  estado: "activa" | "cerrada" | "proxima"
}

const initialData: Convocatoria[] = [
  { id: 1, titulo: "Entrega de silabos", modulo: "Docencia", fechaInicio: "2026-04-01", fechaFin: "2026-04-15", periodoId: 1, estado: "activa" },
  { id: 2, titulo: "Entrega de informes de asignatura", modulo: "Docencia", fechaInicio: "2026-04-20", fechaFin: "2026-05-10", periodoId: 1, estado: "proxima" },
  { id: 3, titulo: "Registro de practicas de laboratorio", modulo: "Laboratorio", fechaInicio: "2026-04-01", fechaFin: "2026-08-31", periodoId: 1, estado: "activa" },
  { id: 4, titulo: "Justificaciones de faltas", modulo: "Academico", fechaInicio: "2026-04-01", fechaFin: "2026-08-31", periodoId: 1, estado: "activa" },
  { id: 5, titulo: "Presentacion de temas de titulacion", modulo: "Titulacion", fechaInicio: "2026-05-01", fechaFin: "2026-05-31", periodoId: 1, estado: "proxima" },
  { id: 6, titulo: "Informes de vinculacion", modulo: "Vinculacion", fechaInicio: "2026-06-01", fechaFin: "2026-07-31", periodoId: 1, estado: "proxima" },
]

const ESTADO_COLORS: Record<string, string> = {
  activa: "bg-[#e8f5ee] text-[#1a6b3c]",
  cerrada: "bg-gray-100 text-gray-600",
  proxima: "bg-blue-50 text-blue-700",
}

const empty = { titulo: "", modulo: "", fechaInicio: "", fechaFin: "", periodoId: 1, estado: "proxima" as const }

export default function FechasLimitePage() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>(initialData)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Convocatoria | null>(null)
  const [form, setForm] = useState<Omit<Convocatoria, "id">>(empty)

  const activas = convocatorias.filter((c) => c.estado === "activa").length
  const proximas = convocatorias.filter((c) => c.estado === "proxima").length
  const cerradas = convocatorias.filter((c) => c.estado === "cerrada").length

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (c: Convocatoria) => {
    setEditing(c)
    setForm({ titulo: c.titulo, modulo: c.modulo, fechaInicio: c.fechaInicio, fechaFin: c.fechaFin, periodoId: c.periodoId, estado: c.estado })
    setOpen(true)
  }
  const handleSave = () => {
    if (!form.titulo || !form.fechaInicio || !form.fechaFin) { toast.error("Complete los campos obligatorios"); return }
    if (editing) {
      setConvocatorias((p) => p.map((c) => c.id === editing.id ? { ...form, id: editing.id } : c))
      toast.success("Convocatoria actualizada")
    } else {
      const newId = Math.max(...convocatorias.map((c) => c.id)) + 1
      setConvocatorias((p) => [...p, { ...form, id: newId }])
      toast.success("Convocatoria creada")
    }
    setOpen(false)
  }
  const handleDelete = (id: number) => {
    setConvocatorias((p) => p.filter((c) => c.id !== id))
    toast.success("Convocatoria eliminada")
  }

  const periodoNombre = (id: number) => periodosMock.find((p) => p.id === id)?.nombre ?? "—"

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Gestionar Convocatorias</h1>
          <p className="text-[#64748b] mt-1">Fechas limite por modulo y periodo academico</p>
        </div>
        <Button onClick={openCreate} className="bg-[#1a6b3c] hover:bg-[#155730] text-white gap-2">
          <Plus className="w-4 h-4" />Nueva convocatoria
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Activas", value: activas, color: "text-[#1a6b3c]", bg: "bg-[#e8f5ee]" },
          { label: "Proximas", value: proximas, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Cerradas", value: cerradas, color: "text-gray-600", bg: "bg-gray-100" },
        ].map((s) => (
          <Card key={s.label} className="border-[#e2e8f0]">
            <CardContent className={`p-5 ${s.bg} rounded-xl`}>
              <p className="text-3xl font-bold text-[#0f172a]">{s.value}</p>
              <p className={`text-sm font-medium mt-0.5 ${s.color}`}>{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {convocatorias.map((c) => (
          <Card key={c.id} className="border-[#e2e8f0]">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center flex-shrink-0">
                    <CalendarCheck className="w-5 h-5 text-[#1a6b3c]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0f172a] truncate">{c.titulo}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-full">{c.modulo}</span>
                      <span className="text-xs text-[#64748b]">{periodoNombre(c.periodoId)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-[#64748b]">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{c.fechaInicio} — {c.fechaFin}</span>
                  </div>
                  <Badge className={`text-xs border-0 ${ESTADO_COLORS[c.estado]}`}>{c.estado}</Badge>
                  <div className="flex gap-1 ml-auto sm:ml-0">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(c)} className="h-8 w-8 p-0">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Editar convocatoria" : "Nueva convocatoria"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Titulo *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Modulo</Label>
                <Input value={form.modulo} onChange={(e) => setForm({ ...form, modulo: e.target.value })} placeholder="Docencia, Laboratorio..." />
              </div>
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as Convocatoria["estado"] })}
                  className="w-full h-9 border border-[#e2e8f0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="activa">Activa</option>
                  <option value="proxima">Proxima</option>
                  <option value="cerrada">Cerrada</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Fecha inicio *</Label>
                <Input type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Fecha fin *</Label>
                <Input type="date" value={form.fechaFin} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-[#1a6b3c] hover:bg-[#155730] text-white">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
