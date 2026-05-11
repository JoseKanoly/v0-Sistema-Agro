"use client"

import { useState } from "react"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLE_LABELS, ROLE_BADGE_CLASSES } from "@/lib/navigation"
import { CARRERAS } from "@/lib/mock/carreras"
import type { UserRole, Usuario } from "@/lib/types/database"
import { Search, Power, ShieldCheck, ShieldOff } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminUsuariosPage() {
  return (
    <AccessGuard roles={["super_admin"]}>
      <UsuariosContent />
    </AccessGuard>
  )
}

function UsuariosContent() {
  const { usuarios, setUsuarios } = useData()
  const [search, setSearch] = useState("")
  const [rolFilter, setRolFilter] = useState<UserRole | "todos">("todos")

  const filtered = usuarios.filter((u) => {
    const matchSearch =
      `${u.nombres} ${u.apellidos} ${u.email} ${u.cedula}`.toLowerCase().includes(search.toLowerCase())
    const matchRol = rolFilter === "todos" || u.rol === rolFilter
    return matchSearch && matchRol
  })

  const toggleActivo = (id: string) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)))
  }

  const toggleVinculacion = (id: string) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, tiene_vinculacion: !u.tiene_vinculacion } : u)))
  }

  const toggleInvestigacion = (id: string) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, tiene_investigacion: !u.tiene_investigacion } : u)))
  }

  const stats = {
    total: usuarios.length,
    activos: usuarios.filter((u) => u.activo).length,
    docentes: usuarios.filter((u) => u.rol === "docente").length,
    estudiantes: usuarios.filter((u) => u.rol === "estudiante").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion de usuarios"
        description="Administra cuentas, roles y asignaciones del sistema"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Activos" value={stats.activos} />
        <StatCard label="Docentes" value={stats.docentes} />
        <StatCard label="Estudiantes" value={stats.estudiantes} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o cedula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={rolFilter} onValueChange={(v) => setRolFilter(v as UserRole | "todos")}>
          <SelectTrigger className="sm:w-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los roles</SelectItem>
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.map((u) => (
          <UsuarioRow
            key={u.id}
            user={u}
            onToggleActivo={() => toggleActivo(u.id)}
            onToggleVinc={() => toggleVinculacion(u.id)}
            onToggleInv={() => toggleInvestigacion(u.id)}
          />
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No se encontraron usuarios con esos filtros.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}

function UsuarioRow({
  user,
  onToggleActivo,
  onToggleVinc,
  onToggleInv,
}: {
  user: Usuario
  onToggleActivo: () => void
  onToggleVinc: () => void
  onToggleInv: () => void
}) {
  const carrera = CARRERAS.find((c) => c.id === user.carrera_id)
  return (
    <Card className={cn(!user.activo && "opacity-60")}>
      <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">
              {user.nombres} {user.apellidos}
            </span>
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                ROLE_BADGE_CLASSES[user.rol],
              )}
            >
              {ROLE_LABELS[user.rol]}
            </span>
            {!user.activo && <Badge variant="outline">Inactivo</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            {user.email} - Cedula: {user.cedula}
            {carrera && ` - ${carrera.nombre}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {user.rol === "docente" && (
            <>
              <Button
                size="sm"
                variant={user.tiene_vinculacion ? "default" : "outline"}
                onClick={onToggleVinc}
              >
                Vinculacion
              </Button>
              <Button
                size="sm"
                variant={user.tiene_investigacion ? "default" : "outline"}
                onClick={onToggleInv}
              >
                Investigacion
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" onClick={onToggleActivo}>
            {user.activo ? <ShieldOff className="mr-1 h-3.5 w-3.5" /> : <ShieldCheck className="mr-1 h-3.5 w-3.5" />}
            {user.activo ? "Desactivar" : "Activar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
