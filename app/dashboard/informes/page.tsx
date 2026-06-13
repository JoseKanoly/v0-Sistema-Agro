"use client"

import { useState, useEffect } from "react"
import { DocenciaService, MateriaService } from "@/lib/services"
import type { InformeDocencia, Materia } from "@/lib/types/database"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search, CheckCircle, Clock, XCircle } from "lucide-react"
import { toast } from "sonner"

const ESTADO_COLOR: Record<InformeDocencia["estado"], string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
}
const ESTADO_ICON: Record<InformeDocencia["estado"], React.ElementType> = {
  pendiente: Clock,
  aprobado: CheckCircle,
  rechazado: XCircle,
}

const empty: Omit<InformeDocencia, "id"> = {
  docente: "", materiaId: 1, periodoId: 1, tipo: "asignatura",
  fechaEntrega: new Date().toISOString().split("T")[0], estado: "pendiente",
}

export default function InformesPage() {
  const [informes, setInformes] = useState<InformeDocencia[]>([])
  const [materias, setMaterias] = useState<Materia[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<InformeDocencia | null>(null)
  const [form, setForm] = useState<Omit<InformeDocencia, "id">>(empty)

  useEffect(() => {
    DocenciaService.getAll().then((all) => setInformes(all.filter((i) => i.tipo === "asignatura")))
    MateriaService.getAll().then(setMaterias)
  }, [])

  const filtered = informes.filter((i) => i.docente.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (i: InformeDocencia) => {
    setEditing(i)
    setForm({ docente: i.docente, materiaId: i.materiaId, periodoId: i.periodoId, tipo: "asignatura", fechaEntrega: i.fechaEntrega, estado: i.estado })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.docente || !form.fechaEntrega) { toast.error("Complete los campos obligatorios"); return }
    if (editing) {
      const updated = await DocenciaService.update(editing.id, form)
      if (updated) { setInformes((prev) => prev.map((i) => i.id === editing.id ? updated : i)); toast.success("Informe actualizado") }
    } else {
      const created = await DocenciaService.create(form)
      setInformes((prev) => [created, ...prev]); toast.success("Informe registrado")
    }
    setOpen(false)
  }

  const handleDelete = async (id: number) => {
    await DocenciaService.delete(id)
    setInformes((prev) => prev.filter((i) => i.id !== id))
    toast.success("Informe eliminado")
  }

  const getMateria = (id: number) => materias.find((m) => m.id === id)?.nombre ?? `Materia #${id}`

  const pendientes = informes.filter((i) => i.estado === "pendiente").length
  const aprobados = informes.filter((i) => i.estado === "aprobado").length
  const rechazados = informes.filter((i) => i.estado === "rechazado").length

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Mis Informes</h1>
          <p className="text-[#64748b] mt-1">Informes de avance y cierre de asignatura</p>
        </div>
        <Button onClick={openCreate} className="bg-[#1a6b3c] hover:bg-[#155730] text-white">
          <Plus className="w-4 h-4 mr-2" />Nuevo informe
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pendientes", value: pendientes, color: "#f59e0b", Icon: Clock },
          { label: "Aprobados", value: aprobados, color: "#22c55e", Icon: CheckCircle },
          { label: "Rechazados", value: rechazados, color: "#ef4444", Icon: XCircle },
        ].map((s) => (
          <Card key={s.label} className="border-[#e2e8f0]">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#64748b]">{s.label}</p>
                <p className="text-2xl font-bold text-[#0f172a]">{s.value}</p>
              </div>
              <s.Icon className="w-5 h-5" style={{ color: s.color }} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <Input placeholder="Buscar por docente..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Docente</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Fecha entrega</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => {
                const Icon = ESTADO_ICON[i.estado]
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.docente}</TableCell>
                    <TableCell className="text-sm text-[#64748b] max-w-[160px] truncate">{getMateria(i.materiaId)}</TableCell>
                    <TableCell className="text-sm text-[#64748b]">P-{i.periodoId}</TableCell>
                    <TableCell className="text-sm text-[#64748b]">{i.fechaEntrega}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_COLOR[i.estado]}`}>
                        <Icon className="w-3 h-3" />{i.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(i)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(i.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar informe" : "Registrar informe"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5 col-span-2">
              <Label>Docente *</Label>
              <Input value={form.docente} onChange={(e) => setForm({ ...form, docente: e.target.value })} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Materia</Label>
              <Select value={String(form.materiaId)} onValueChange={(v) => setForm({ ...form, materiaId: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{materias.map((m) => <SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fecha entrega *</Label>
              <Input type="date" value={form.fechaEntrega} onChange={(e) => setForm({ ...form, fechaEntrega: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v as InformeDocencia["estado"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button className="bg-[#1a6b3c] hover:bg-[#155730] text-white" onClick={handleSave}>
              {editing ? "Guardar cambios" : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
