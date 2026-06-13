"use client"

import { useState, useEffect } from "react"
import { TitulacionService } from "@/lib/services"
import type { TemaTitulacion } from "@/lib/types/database"
import { carrerasMock } from "@/lib/mock/carreras"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Trophy, BookOpen, GraduationCap, Plus } from "lucide-react"
import { toast } from "sonner"

const ESTADO_COLOR: Record<TemaTitulacion["estado"], string> = {
  propuesto: "bg-blue-100 text-blue-700",
  en_progreso: "bg-yellow-100 text-yellow-700",
  completado: "bg-green-100 text-green-700",
}

const MODALIDAD_LABEL: Record<TemaTitulacion["modalidad"], string> = {
  proyecto: "Proyecto integrador",
  tesis: "Tesis",
  examen_complexivo: "Examen complexivo",
}

const empty: Omit<TemaTitulacion, "id"> = {
  titulo: "", estudiante: "", tutor: "", carreraId: 1,
  modalidad: "proyecto", estado: "propuesto", avance: 0,
}

export default function MiTitulacionPage() {
  const [temas, setTemas] = useState<TemaTitulacion[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TemaTitulacion | null>(null)
  const [form, setForm] = useState<Omit<TemaTitulacion, "id">>(empty)

  useEffect(() => { TitulacionService.getAll().then(setTemas) }, [])

  // Simulate: show only the first 2 temas as "my topics" for a student
  const misTemas = temas.slice(0, 2)

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (t: TemaTitulacion) => {
    setEditing(t)
    setForm({ titulo: t.titulo, estudiante: t.estudiante, tutor: t.tutor, carreraId: t.carreraId, modalidad: t.modalidad, estado: t.estado, avance: t.avance })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.titulo || !form.estudiante || !form.tutor) {
      toast.error("Complete los campos obligatorios"); return
    }
    if (editing) {
      const updated = await TitulacionService.update(editing.id, form)
      if (updated) { setTemas((prev) => prev.map((t) => t.id === editing.id ? updated : t)); toast.success("Tema actualizado") }
    } else {
      const created = await TitulacionService.create(form)
      setTemas((prev) => [created, ...prev]); toast.success("Propuesta enviada")
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Mi Titulacion</h1>
          <p className="text-[#64748b] mt-1">Seguimiento de tu proceso de titulacion</p>
        </div>
        <Button onClick={openCreate} className="bg-[#1a6b3c] hover:bg-[#155730] text-white">
          <Plus className="w-4 h-4 mr-2" />Proponer tema
        </Button>
      </div>

      {misTemas.length === 0 ? (
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-12 text-center">
            <Trophy className="w-12 h-12 text-[#cbd5e1] mx-auto mb-3" />
            <p className="text-[#64748b]">No tienes un tema de titulacion asignado aun.</p>
            <Button onClick={openCreate} className="mt-4 bg-[#1a6b3c] hover:bg-[#155730] text-white">Proponer un tema</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {misTemas.map((t) => (
            <Card key={t.id} className="border-[#e2e8f0]">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-[#0f172a] text-lg leading-snug">{t.titulo}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_COLOR[t.estado]}`}>
                        {t.estado.replace("_", " ")}
                      </span>
                      <span className="text-xs bg-[#f1f5f9] text-[#64748b] px-2 py-0.5 rounded-full">
                        {MODALIDAD_LABEL[t.modalidad]}
                      </span>
                      <span className="text-xs bg-[#e8f5ee] text-[#1a6b3c] px-2 py-0.5 rounded-full font-medium">
                        {carrerasMock.find((c) => c.id === t.carreraId)?.siglas ?? "—"}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-[#e2e8f0]" onClick={() => openEdit(t)}>
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#1a6b3c]" />
                    <div>
                      <p className="text-xs text-[#64748b]">Estudiante</p>
                      <p className="text-sm font-medium text-[#0f172a]">{t.estudiante}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#3b82f6]" />
                    <div>
                      <p className="text-xs text-[#64748b]">Tutor</p>
                      <p className="text-sm font-medium text-[#0f172a]">{t.tutor}</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-[#64748b]">Avance del trabajo</p>
                    <p className="text-xs font-bold text-[#1a6b3c]">{t.avance}%</p>
                  </div>
                  <div className="w-full bg-[#e2e8f0] rounded-full h-2.5">
                    <div
                      className="bg-[#1a6b3c] h-2.5 rounded-full transition-all"
                      style={{ width: `${t.avance}%` }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[
                    { label: "Propuesta", threshold: 1 },
                    { label: "Capitulo 1", threshold: 30 },
                    { label: "Capitulo 2-3", threshold: 60 },
                    { label: "Sustentacion", threshold: 100 },
                  ].map((m) => (
                    <div key={m.label} className={`rounded-lg p-2 text-center text-xs font-medium border ${t.avance >= m.threshold ? "bg-[#e8f5ee] border-[#1a6b3c] text-[#1a6b3c]" : "bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8]"}`}>
                      {m.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar tema" : "Proponer tema de titulacion"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5 col-span-2">
              <Label>Titulo del trabajo *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Estudiante *</Label>
              <Input value={form.estudiante} onChange={(e) => setForm({ ...form, estudiante: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Tutor *</Label>
              <Input value={form.tutor} onChange={(e) => setForm({ ...form, tutor: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Modalidad</Label>
              <Select value={form.modalidad} onValueChange={(v) => setForm({ ...form, modalidad: v as TemaTitulacion["modalidad"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="proyecto">Proyecto integrador</SelectItem>
                  <SelectItem value="tesis">Tesis</SelectItem>
                  <SelectItem value="examen_complexivo">Examen complexivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Carrera</Label>
              <Select value={String(form.carreraId)} onValueChange={(v) => setForm({ ...form, carreraId: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{carrerasMock.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.siglas}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {editing && (
              <>
                <div className="space-y-1.5">
                  <Label>Estado</Label>
                  <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v as TemaTitulacion["estado"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="propuesto">Propuesto</SelectItem>
                      <SelectItem value="en_progreso">En progreso</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Avance (%) </Label>
                  <Input type="number" min={0} max={100} value={form.avance} onChange={(e) => setForm({ ...form, avance: Number(e.target.value) })} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button className="bg-[#1a6b3c] hover:bg-[#155730] text-white" onClick={handleSave}>
              {editing ? "Guardar cambios" : "Enviar propuesta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
