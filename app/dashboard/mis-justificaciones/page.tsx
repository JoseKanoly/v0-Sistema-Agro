"use client"

import { useState, useEffect } from "react"
import { JustificacionService, FaltaService, MateriaService } from "@/lib/services"
import type { Justificacion, Falta, Materia } from "@/lib/types/database"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

const ESTADO_COLOR: Record<Justificacion["estado"], string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
}
const ESTADO_ICON: Record<Justificacion["estado"], React.ElementType> = {
  pendiente: Clock,
  aprobado: CheckCircle,
  rechazado: XCircle,
}

const MOTIVOS = [
  "Cita medica programada",
  "Calamidad domestica familiar",
  "Participacion en evento academico",
  "Problema de transporte",
  "Enfermedad con certificado medico",
]

const empty: Omit<Justificacion, "id"> = {
  estudianteId: 1, faltaId: 1,
  motivo: MOTIVOS[0],
  fecha: new Date().toISOString().split("T")[0],
  estado: "pendiente",
}

export default function MisJustificacionesPage() {
  const [justificaciones, setJustificaciones] = useState<Justificacion[]>([])
  const [faltas, setFaltas] = useState<Falta[]>([])
  const [materias, setMaterias] = useState<Materia[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Justificacion | null>(null)
  const [form, setForm] = useState<Omit<Justificacion, "id">>(empty)

  useEffect(() => {
    JustificacionService.getAll().then(setJustificaciones)
    FaltaService.getAll().then((all) => setFaltas(all.filter((f) => f.estudianteId === 1)))
    MateriaService.getAll().then(setMaterias)
  }, [])

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (j: Justificacion) => {
    setEditing(j)
    setForm({ estudianteId: j.estudianteId, faltaId: j.faltaId, motivo: j.motivo, fecha: j.fecha, estado: j.estado })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.motivo || !form.fecha) { toast.error("Complete los campos obligatorios"); return }
    if (editing) {
      const updated = await JustificacionService.update(editing.id, form)
      if (updated) { setJustificaciones((prev) => prev.map((j) => j.id === editing.id ? updated : j)); toast.success("Justificacion actualizada") }
    } else {
      const created = await JustificacionService.create(form)
      setJustificaciones((prev) => [created, ...prev]); toast.success("Justificacion enviada")
    }
    setOpen(false)
  }

  const handleDelete = async (id: number) => {
    await JustificacionService.delete(id)
    setJustificaciones((prev) => prev.filter((j) => j.id !== id))
    toast.success("Justificacion eliminada")
  }

  const getFaltaInfo = (faltaId: number) => {
    const f = faltas.find((f) => f.id === faltaId)
    if (!f) return "Falta no encontrada"
    const m = materias.find((m) => m.id === f.materiaId)
    return `${f.fecha} - ${m?.nombre ?? `Mat. #${f.materiaId}`}`
  }

  const pendientes = justificaciones.filter((j) => j.estado === "pendiente").length
  const aprobadas = justificaciones.filter((j) => j.estado === "aprobado").length
  const rechazadas = justificaciones.filter((j) => j.estado === "rechazado").length

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Mis Justificaciones</h1>
          <p className="text-[#64748b] mt-1">Solicitudes de justificacion de faltas y atrasos</p>
        </div>
        <Button onClick={openCreate} className="bg-[#1a6b3c] hover:bg-[#155730] text-white">
          <Plus className="w-4 h-4 mr-2" />Nueva justificacion
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pendientes", value: pendientes, color: "#f59e0b", Icon: Clock },
          { label: "Aprobadas", value: aprobadas, color: "#22c55e", Icon: CheckCircle },
          { label: "Rechazadas", value: rechazadas, color: "#ef4444", Icon: XCircle },
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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Falta justificada</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Fecha solicitud</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {justificaciones.map((j) => {
                const Icon = ESTADO_ICON[j.estado]
                return (
                  <TableRow key={j.id}>
                    <TableCell className="text-sm text-[#64748b] max-w-[200px] truncate">{getFaltaInfo(j.faltaId)}</TableCell>
                    <TableCell className="text-sm font-medium max-w-[180px] truncate">{j.motivo}</TableCell>
                    <TableCell className="text-sm text-[#64748b]">{j.fecha}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_COLOR[j.estado]}`}>
                        <Icon className="w-3 h-3" />{j.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(j)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(j.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-[#e2e8f0] bg-[#fffbeb]">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#92400e]">Proceso de justificacion</p>
            <p className="text-sm text-[#92400e] mt-0.5">
              Las justificaciones deben presentarse dentro de las 48 horas siguientes a la falta. Se requiere documentacion de respaldo. La secretaria academica revisara y aprobara o rechazara cada solicitud.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar justificacion" : "Nueva solicitud de justificacion"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Falta a justificar</Label>
              <Select value={String(form.faltaId)} onValueChange={(v) => setForm({ ...form, faltaId: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {faltas.map((f) => {
                    const m = materias.find((m) => m.id === f.materiaId)
                    return <SelectItem key={f.id} value={String(f.id)}>{f.fecha} - {m?.nombre ?? `Mat. #${f.materiaId}`} ({f.tipo})</SelectItem>
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Motivo *</Label>
              <Select value={form.motivo} onValueChange={(v) => setForm({ ...form, motivo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOTIVOS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fecha de solicitud *</Label>
              <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button className="bg-[#1a6b3c] hover:bg-[#155730] text-white" onClick={handleSave}>
              {editing ? "Guardar cambios" : "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
