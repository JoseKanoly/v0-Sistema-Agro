"use client"

import { useState, useEffect } from "react"
import { UsuarioService } from "@/lib/services"
import { carrerasMock } from "@/lib/mock/carreras"
import type { Usuario, Rol } from "@/lib/types/database"
import { ROLES } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react"
import { toast } from "sonner"

const ROL_COLOR: Record<Rol, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  ADMINISTRADOR: "bg-blue-100 text-blue-700",
  COORDINADOR: "bg-indigo-100 text-indigo-700",
  DOCENTE: "bg-green-100 text-green-700",
  SECRETARIA: "bg-yellow-100 text-yellow-700",
  ESTUDIANTE: "bg-gray-100 text-gray-700",
}

const empty: Omit<Usuario, "id" | "createdAt"> = {
  nombres: "", apellidos: "", correo: "", cedula: "", telefono: "",
  rol: "DOCENTE", carreraId: null, estado: "activo",
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [form, setForm] = useState<Omit<Usuario, "id" | "createdAt">>(empty)

  useEffect(() => { UsuarioService.getAll().then(setUsuarios) }, [])

  const filtered = usuarios.filter((u) =>
    `${u.nombres} ${u.apellidos} ${u.correo} ${u.cedula}`.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true) }
  const openEdit = (u: Usuario) => {
    setEditing(u)
    setForm({ nombres: u.nombres, apellidos: u.apellidos, correo: u.correo, cedula: u.cedula, telefono: u.telefono, rol: u.rol, carreraId: u.carreraId, estado: u.estado })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.nombres || !form.apellidos || !form.correo || !form.cedula) {
      toast.error("Complete los campos obligatorios"); return
    }
    if (editing) {
      const updated = await UsuarioService.update(editing.id, form)
      if (updated) { setUsuarios((prev) => prev.map((u) => u.id === editing.id ? updated : u)); toast.success("Usuario actualizado") }
    } else {
      const created = await UsuarioService.create({ ...form, createdAt: new Date().toISOString().split("T")[0] })
      setUsuarios((prev) => [created, ...prev]); toast.success("Usuario creado")
    }
    setOpen(false)
  }

  const handleDelete = async (id: number) => {
    await UsuarioService.delete(id)
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
    toast.success("Usuario eliminado")
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Usuarios</h1>
          <p className="text-[#64748b] mt-1">Gestion de usuarios del sistema</p>
        </div>
        <Button onClick={openCreate} className="bg-[#1a6b3c] hover:bg-[#155730] text-white">
          <Plus className="w-4 h-4 mr-2" />Nuevo usuario
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ROLES.map((r) => {
          const count = usuarios.filter((u) => u.rol === r.value).length
          return (
            <Card key={r.value} className="border-[#e2e8f0]">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#64748b]">{r.label}</p>
                  <p className="text-2xl font-bold text-[#0f172a]">{count}</p>
                </div>
                <Users className="w-5 h-5 text-[#1a6b3c]" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <Input placeholder="Buscar usuario..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Cedula</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nombres} {u.apellidos}</TableCell>
                  <TableCell className="text-[#64748b] text-sm">{u.correo}</TableCell>
                  <TableCell className="text-[#64748b] text-sm">{u.cedula}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROL_COLOR[u.rol]}`}>
                      {ROLES.find((r) => r.value === u.rol)?.label ?? u.rol}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-[#64748b]">
                    {u.carreraId ? carrerasMock.find((c) => c.id === u.carreraId)?.siglas ?? "—" : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.estado === "activo" ? "default" : "secondary"} className={u.estado === "activo" ? "bg-[#e8f5ee] text-[#1a6b3c] hover:bg-[#e8f5ee]" : ""}>
                      {u.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(u)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
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
          <DialogHeader>
            <DialogTitle>{editing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombres *</Label>
              <Input value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Apellidos *</Label>
              <Input value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Correo *</Label>
              <Input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Cedula *</Label>
              <Input value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Telefono</Label>
              <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Rol</Label>
              <Select value={form.rol} onValueChange={(v) => setForm({ ...form, rol: v as Rol })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Carrera</Label>
              <Select value={form.carreraId ? String(form.carreraId) : "null"} onValueChange={(v) => setForm({ ...form, carreraId: v === "null" ? null : Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Sin carrera</SelectItem>
                  {carrerasMock.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v as "activo" | "inactivo" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
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
