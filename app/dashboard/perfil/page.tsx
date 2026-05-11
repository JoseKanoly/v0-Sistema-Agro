"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Save, CheckCircle2 } from "lucide-react"
import { ROLE_LABELS, ROLE_BADGE_CLASSES } from "@/lib/navigation"
import { CARRERAS } from "@/lib/mock/carreras"
import { cn } from "@/lib/utils"

export default function PerfilPage() {
  const { user } = useAuth()
  const { setUsuarios } = useData()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    nombres: user?.nombres ?? "",
    apellidos: user?.apellidos ?? "",
    cedula: user?.cedula ?? "",
  })

  if (!user) return null

  const carrera = CARRERAS.find((c) => c.id === user.carrera_id)
  const initials = `${user.nombres.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUsuarios((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...form } : u)))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title="Mi perfil" description="Tu informacion personal en SISPAA" />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="mx-auto h-20 w-20">
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-3 text-lg">
              {user.nombres} {user.apellidos}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-center">
              <span
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                  ROLE_BADGE_CLASSES[user.rol],
                )}
              >
                {ROLE_LABELS[user.rol]}
              </span>
            </div>
            {carrera && (
              <div className="rounded-md border bg-muted/40 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Carrera</p>
                <p className="font-medium">{carrera.nombre}</p>
              </div>
            )}
            {user.rol === "docente" && (
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {user.tiene_vinculacion ? (
                  <Badge variant="secondary">Vinculacion asignada</Badge>
                ) : (
                  <Badge variant="outline">Sin vinculacion</Badge>
                )}
                {user.tiene_investigacion ? (
                  <Badge variant="secondary">Investigacion asignada</Badge>
                ) : (
                  <Badge variant="outline">Sin investigacion</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Editar informacion</CardTitle>
            <CardDescription>Actualiza tus datos personales</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    value={form.nombres}
                    onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    value={form.apellidos}
                    onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cedula">Cedula</Label>
                <Input
                  id="cedula"
                  value={form.cedula}
                  onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo institucional</Label>
                <Input id="email" value={user.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">El correo institucional no se puede modificar.</p>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Guardar cambios
                </Button>
                {saved && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Datos guardados
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
