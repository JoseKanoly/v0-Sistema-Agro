"use client"

import { useState, useEffect } from "react"
import { InvestigacionService } from "@/lib/services"
import { carrerasMock } from "@/lib/mock/carreras"
import type { InformeInvestigacion } from "@/lib/types/database"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search, CheckCircle2, XCircle, Clock, Microscope } from "lucide-react"
import { toast } from "sonner"

const ESTADO_COLOR: Record<InformeInvestigacion["estado"], string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  aprobado: "bg-[#e8f5ee] text-[#1a6b3c]",
  rechazado: "bg-red-100 text-red-700",
}

const lineas = [
  "Seguridad alimentaria y nutricion",
  "Produccion agropecuaria sostenible",
  "Biotecnologia aplicada",
  "Desarrollo agroindustrial",
  "Economia y mercados agrarios",
]

const empty: Omit<InformeInvestigacion, "id"> = { titulo: "", investigador: "", carreraId: 1, lineaInvestigacion: lineas[0], fecha: "", estado: "pendiente" }

export default function InvestigacionPage() {
  const [informes, setInformes] = useState<InformeInvestigacion[]>([])
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState("all")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<InformeInvestigacion | null>(null)
  const [form, setForm] = useState<Omit<InformeInvestigacion, "id">>(empty)

  useEffect(() => { InvestigacionService.getAll().then(setInformes) }, [])

  const filtered = informes
    .filter((i) => `${i.titulo} ${i.investigador}`.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => filterEstado === "all" || i.estado === filterEstado)

  const pendientes = informes.filter((i) => i.estado === "pendiente").length
  const aprobados = informes.filter((i) => i.estado === "aprobado").length

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (i: InformeInvestigacion) => {
    setEditing(i)
    setForm({ titulo: i.titulo, investigador: i.investigador, carreraId: i.carreraId, lineaInvestigacion: i.lineaInvestigacion, fecha: i.fecha, estado: i.estado })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.titulo || !form.investigador) { toast.error("Complete los campos obligatorios"); return }
    if (editing) {
      const updated = await InvestigacionService.update(editing.id, form)
      if (updated) { setInformes((prev) => prev.map((x) => x.id === editing.id ? updated : x)); toast.success("Informe actualizado") }
    } else {
      const created = await InvestigacionService.create(form)
      setInformes((prev) => [created, ...prev]); toast.success("Informe registrado")
    }
    setOpen(false)
  }

  const handleDelete = async (id: number) => {
    await InvestigacionService.delete(id)
    setInformes((prev) => prev.filter((x) => x.id !== id))
    toast.success("Informe eliminado")
  }

  const handleEstado = async (id: number, estado: InformeInvestigacion["estado"]) => {
    const updated = await InvestigacionService.update(id, { estado })
    if (updated) { setInformes((prev) => prev.map((x) => x.id === id ? updated : x)); toast.success(`Informe ${estado}`) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Informes de Investigacion</h1>
          <p className="text-[#64748b] mt-1">Proyectos y avances de investigacion</p>
        </div>
        <Button onClick={openCreate} className="bg-[#1a6b3c] hover:bg-[#155730] text-white">
          <Plus className="w-4 h-4 mr-2" />Nuevo informe
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5 flex items-center gap-4">
            <Microscope className="w-8 h-8 text-[#1a6b3c]" />
            <div><p className="text-xs text-[#64748b]">Total</p><p className="text-2xl font-bold text-[#0f172a]">{informes.length}</p></div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5 flex items-center gap-4">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div><p className="text-xs text-[#64748b]">Pendientes</p><p className="text-2xl font-bold text-[#0f172a]">{pendientes}</p></div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5 flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-[#22c55e]" />
            <div><p className="text-xs text-[#64748b]">Aprobados</p><p className="text-2xl font-bold text-[#0f172a]">{aprobados}</p></div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5 flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <div><p className="text-xs text-[#64748b]">Rechazados</p><p className="text-2xl font-bold text-[#0f172a]">{informes.filter((i) => i.estado === "rechazado").length}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <Input placeholder="Buscar titulo o investigador..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Investigador</TableHead>
                <TableHead>Linea</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inf) => (
                <TableRow key={inf.id}>
                  <TableCell className="font-medium max-w-xs truncate">{inf.titulo}</TableCell>
                  <TableCell className="text-sm text-[#64748b]">{inf.investigador}</TableCell>
                  <TableCell className="text-sm text-[#64748b] max-w-[150px] truncate">{inf.lineaInvestigacion}</TableCell>
                  <TableCell className="text-sm">{carrerasMock.find((c) => c.id === inf.carreraId)?.siglas}</TableCell>
                  <TableCell className="text-sm">{inf.fecha}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADO_COLOR[inf.estado]}`}>{inf.estado}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {inf.estado === "pendiente" && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleEstado(inf.id, "aprobado")} className="text-[#1a6b3c] hover:bg-[#e8f5ee]"><CheckCircle2 className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEstado(inf.id, "rechazado")} className="text-red-500 hover:bg-red-50"><XCircle className="w-4 h-4" /></Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openEdit(inf)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(inf.id)} className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Editar informe" : "Nuevo informe"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Titulo *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Investigador *</Label>
                <Input value={form.investigador} onChange={(e) => setForm({ ...form, investigador: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Carrera</Label>
                <Select value={String(form.carreraId)} onValueChange={(v) => setForm({ ...form, carreraId: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{carrerasMock.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Linea de investigacion</Label>
              <Select value={form.lineaInvestigacion} onValueChange={(v) => setForm({ ...form, lineaInvestigacion: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{lineas.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Fecha</Label>
                <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v as InformeInvestigacion["estado"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="aprobado">Aprobado</SelectItem>
                    <SelectItem value="rechazado">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
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
