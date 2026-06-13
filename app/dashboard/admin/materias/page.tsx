"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { getMaterias, createMateria, updateMateria, deleteMateria } from "@/app/actions/materias"
import { getCarreras } from "@/app/actions/carreras"
import { getPeriodos } from "@/app/actions/periodos"

type Materia = Awaited<ReturnType<typeof getMaterias>>[number]

export default function MateriasPage() {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [carreras, setCarreras] = useState<{ id: number; nombre: string }[]>([])
  const [periodos, setPeriodos] = useState<{ id: number; nombre: string }[]>([])
  const [open, setOpen] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  const [selected, setSelected] = useState<Materia | null>(null)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ nombre: "", codigo: "", creditos: "3", carreraId: "", periodoId: "", activa: true })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [m, c, p] = await Promise.all([getMaterias(), getCarreras(), getPeriodos()])
    setMaterias(m); setCarreras(c); setPeriodos(p)
  }

  function openCreate() {
    setSelected(null)
    setForm({ nombre: "", codigo: "", creditos: "3", carreraId: "", periodoId: "", activa: true })
    setOpen(true)
  }

  function openEdit(m: Materia) {
    setSelected(m)
    setForm({ nombre: m.nombre, codigo: m.codigo, creditos: m.creditos.toString(), carreraId: m.carreraId.toString(), periodoId: m.periodoId?.toString() ?? "", activa: m.activa })
    setOpen(true)
  }

  function handleSave() {
    if (!form.nombre || !form.codigo || !form.carreraId) { toast.error("Nombre, codigo y carrera son requeridos"); return }
    startTransition(async () => {
      try {
        const payload = { nombre: form.nombre, codigo: form.codigo, creditos: parseInt(form.creditos), carreraId: parseInt(form.carreraId), periodoId: form.periodoId ? parseInt(form.periodoId) : undefined, activa: form.activa }
        if (selected) { await updateMateria(selected.id, payload); toast.success("Materia actualizada") }
        else { await createMateria(payload); toast.success("Materia creada") }
        setOpen(false); loadData()
      } catch (e: any) { toast.error(e.message ?? "Error") }
    })
  }

  function handleDelete() {
    if (!selected) return
    startTransition(async () => {
      try { await deleteMateria(selected.id); toast.success("Materia eliminada"); setDelOpen(false); loadData() }
      catch (e: any) { toast.error(e.message ?? "Error") }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Materias</h1>
          <p className="text-sm text-[#64748b] mt-1">Gestion de materias por carrera y periodo</p>
        </div>
        <Button onClick={openCreate} className="bg-[#1a6b3c] hover:bg-[#155730] text-white gap-2">
          <Plus className="w-4 h-4" /> Nueva materia
        </Button>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
              <TableHead className="font-semibold text-[#475569]">Nombre</TableHead>
              <TableHead className="font-semibold text-[#475569]">Codigo</TableHead>
              <TableHead className="font-semibold text-[#475569]">Creditos</TableHead>
              <TableHead className="font-semibold text-[#475569]">Carrera</TableHead>
              <TableHead className="font-semibold text-[#475569]">Periodo</TableHead>
              <TableHead className="font-semibold text-[#475569]">Estado</TableHead>
              <TableHead className="font-semibold text-[#475569] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materias.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-[#94a3b8] py-10">No hay materias registradas</TableCell></TableRow>
            )}
            {materias.map(m => (
              <TableRow key={m.id} className="hover:bg-[#f8fafc]">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-[#3b82f6]" />
                    </div>
                    <span className="font-medium text-[#0f172a]">{m.nombre}</span>
                  </div>
                </TableCell>
                <TableCell><code className="bg-[#f1f5f9] px-2 py-0.5 rounded text-sm font-mono">{m.codigo}</code></TableCell>
                <TableCell className="text-[#64748b]">{m.creditos}</TableCell>
                <TableCell className="text-[#64748b] text-sm">{carreras.find(c => c.id === m.carreraId)?.nombre ?? "—"}</TableCell>
                <TableCell className="text-[#64748b] text-sm">{periodos.find(p => p.id === m.periodoId)?.nombre ?? "—"}</TableCell>
                <TableCell>
                  {m.activa
                    ? <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">Activa</span>
                    : <span className="text-xs font-medium text-[#94a3b8] bg-[#f1f5f9] px-2.5 py-1 rounded-full">Inactiva</span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(m)} className="h-8 w-8 hover:bg-[#e8f5ee] hover:text-[#1a6b3c]"><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setSelected(m); setDelOpen(true) }} className="h-8 w-8 hover:bg-red-50 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{selected ? "Editar materia" : "Nueva materia"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label>Nombre</Label><Input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej. Programacion I" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Codigo</Label><Input value={form.codigo} onChange={e => setForm(p => ({ ...p, codigo: e.target.value.toUpperCase() }))} placeholder="ISI-101" /></div>
              <div className="space-y-1.5"><Label>Creditos</Label><Input type="number" min={1} max={10} value={form.creditos} onChange={e => setForm(p => ({ ...p, creditos: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Carrera</Label>
              <Select value={form.carreraId} onValueChange={v => setForm(p => ({ ...p, carreraId: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar carrera" /></SelectTrigger>
                <SelectContent>{carreras.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.nombre}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Periodo</Label>
              <Select value={form.periodoId} onValueChange={v => setForm(p => ({ ...p, periodoId: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar periodo" /></SelectTrigger>
                <SelectContent>{periodos.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between"><Label>Activa</Label><Switch checked={form.activa} onCheckedChange={v => setForm(p => ({ ...p, activa: v }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isPending} className="bg-[#1a6b3c] hover:bg-[#155730] text-white">{isPending ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={delOpen} onOpenChange={setDelOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Eliminar materia</DialogTitle></DialogHeader>
          <p className="text-sm text-[#64748b]">Se eliminara la materia <strong>{selected?.nombre}</strong>. Esta accion no se puede deshacer.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDelOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>{isPending ? "Eliminando..." : "Eliminar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
