"use client"

import { useState } from "react"
import { temasTitulacionMock } from "@/lib/mock/titulacion"
import { carrerasMock } from "@/lib/mock/carreras"
import type { TemaTitulacion } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Award, Search, Plus, Pencil, Trash2, GraduationCap } from "lucide-react"
import { toast } from "sonner"

type Estado = TemaTitulacion["estado"]

const ESTADO_STYLES: Record<Estado, string> = {
  propuesto: "bg-blue-50 text-blue-700",
  en_progreso: "bg-amber-50 text-amber-700",
  completado: "bg-[#e8f5ee] text-[#1a6b3c]",
}

const MODALIDAD_STYLES: Record<TemaTitulacion["modalidad"], string> = {
  proyecto: "bg-purple-50 text-purple-700",
  tesis: "bg-indigo-50 text-indigo-700",
  examen_complexivo: "bg-cyan-50 text-cyan-700",
}

const empty = { titulo: "", estudiante: "", tutor: "", carreraId: 1, modalidad: "proyecto" as const, estado: "propuesto" as const, avance: 0 }

export default function TitulacionPage() {
  const [items, setItems] = useState<TemaTitulacion[]>(temasTitulacionMock)
  const [search, setSearch] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("todos")
  const [carreraFilter, setCarreraFilter] = useState("todos")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TemaTitulacion | null>(null)
  const [form, setForm] = useState<Omit<TemaTitulacion, "id">>(empty)

  const carreraMap = Object.fromEntries(carrerasMock.map((c) => [c.id, c]))

  const filtered = items.filter((i) => {
    const matchSearch = `${i.titulo} ${i.estudiante} ${i.tutor}`.toLowerCase().includes(search.toLowerCase())
    const matchEstado = estadoFilter === "todos" || i.estado === estadoFilter
    const matchCarrera = carreraFilter === "todos" || String(i.carreraId) === carreraFilter
    return matchSearch && matchEstado && matchCarrera
  })

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (t: TemaTitulacion) => {
    setEditing(t)
    setForm({ titulo: t.titulo, estudiante: t.estudiante, tutor: t.tutor, carreraId: t.carreraId, modalidad: t.modalidad, estado: t.estado, avance: t.avance })
    setOpen(true)
  }
  const handleSave = () => {
    if (!form.titulo || !form.estudiante) { toast.error("Complete los campos obligatorios"); return }
    if (editing) {
      setItems((p) => p.map((i) => i.id === editing.id ? { ...form, id: editing.id } : i))
      toast.success("Tema actualizado")
    } else {
      const newId = Math.max(...items.map((i) => i.id)) + 1
      setItems((p) => [...p, { ...form, id: newId }])
      toast.success("Tema registrado")
    }
    setOpen(false)
  }
  const handleDelete = (id: number) => {
    setItems((p) => p.filter((i) => i.id !== id))
    toast.success("Tema eliminado")
  }

  const stats = {
    propuesto: items.filter((i) => i.estado === "propuesto").length,
    en_progreso: items.filter((i) => i.estado === "en_progreso").length,
    completado: items.filter((i) => i.estado === "completado").length,
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Titulacion</h1>
          <p className="text-[#64748b] mt-1">Temas de titulacion por modalidad y estado</p>
        </div>
        <Button onClick={openCreate} className="bg-[#1a6b3c] hover:bg-[#155730] text-white gap-2">
          <Plus className="w-4 h-4" />Nuevo tema
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Propuestos", value: stats.propuesto, color: "text-blue-700" },
          { label: "En progreso", value: stats.en_progreso, color: "text-amber-700" },
          { label: "Completados", value: stats.completado, color: "text-[#1a6b3c]" },
        ].map((s) => (
          <Card key={s.label} className="border-[#e2e8f0]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#0f172a]">{s.value}</p>
              <p className={`text-xs font-medium mt-0.5 ${s.color}`}>{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
            <Award className="w-4 h-4 text-[#1a6b3c]" />
            Temas de titulacion ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <Input placeholder="Buscar por titulo o estudiante..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-[#e2e8f0]" />
            </div>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-full sm:w-44 border-[#e2e8f0]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="propuesto">Propuesto</SelectItem>
                <SelectItem value="en_progreso">En progreso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={carreraFilter} onValueChange={setCarreraFilter}>
              <SelectTrigger className="w-full sm:w-44 border-[#e2e8f0]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las carreras</SelectItem>
                {carrerasMock.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.siglas}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((t) => {
              const carrera = carreraMap[t.carreraId]
              return (
                <div key={t.id} className="border border-[#e2e8f0] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-[#0f172a] leading-snug text-pretty">{t.titulo}</p>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(t)} className="h-7 w-7 p-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} className="h-7 w-7 p-0 text-red-500 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge className={`text-xs border-0 ${ESTADO_STYLES[t.estado]}`}>{t.estado.replace("_", " ")}</Badge>
                    <Badge className={`text-xs border-0 ${MODALIDAD_STYLES[t.modalidad]}`}>{t.modalidad.replace("_", " ")}</Badge>
                    {carrera && <Badge variant="outline" className="text-xs">{carrera.siglas}</Badge>}
                  </div>
                  <div className="space-y-1 text-xs text-[#64748b] mb-3">
                    <div className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /><span>{t.estudiante}</span></div>
                    <div className="flex items-center gap-1.5"><span className="text-[#94a3b8]">Tutor:</span><span>{t.tutor}</span></div>
                  </div>
                  {t.estado !== "propuesto" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[#64748b]">
                        <span>Avance</span>
                        <span className="font-medium">{t.avance}%</span>
                      </div>
                      <Progress value={t.avance} className="h-1.5 bg-[#e2e8f0]" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-[#94a3b8]">No se encontraron temas de titulacion.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Editar tema" : "Nuevo tema de titulacion"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Titulo *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Estudiante *</Label>
                <Input value={form.estudiante} onChange={(e) => setForm({ ...form, estudiante: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Tutor</Label>
                <Input value={form.tutor} onChange={(e) => setForm({ ...form, tutor: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Modalidad</Label>
                <Select value={form.modalidad} onValueChange={(v) => setForm({ ...form, modalidad: v as TemaTitulacion["modalidad"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proyecto">Proyecto</SelectItem>
                    <SelectItem value="tesis">Tesis</SelectItem>
                    <SelectItem value="examen_complexivo">Examen complexivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v as Estado })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="propuesto">Propuesto</SelectItem>
                    <SelectItem value="en_progreso">En progreso</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Carrera</Label>
                <Select value={String(form.carreraId)} onValueChange={(v) => setForm({ ...form, carreraId: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {carrerasMock.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.siglas}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Avance %</Label>
                <Input type="number" min={0} max={100} value={form.avance} onChange={(e) => setForm({ ...form, avance: Number(e.target.value) })} />
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
