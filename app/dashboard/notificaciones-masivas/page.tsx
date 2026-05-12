"use client"

import { useState } from "react"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send, CheckCircle2 } from "lucide-react"
import type { UserRole } from "@/lib/types/database"
import { ROLE_LABELS } from "@/lib/navigation"
import { CARRERAS } from "@/lib/mock/carreras"

export default function MasivasPage() {
  return (
    <AccessGuard roles={["secretaria", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { usuarios, setNotificaciones } = useData()
  const [destino, setDestino] = useState<UserRole | "todos">("estudiante")
  const [carrera, setCarrera] = useState<string>("todas")
  const [titulo, setTitulo] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [enviados, setEnviados] = useState<number | null>(null)

  const candidatos = usuarios.filter((u) => {
    if (destino !== "todos" && u.rol !== destino) return false
    if (carrera !== "todas" && u.carrera_id !== carrera) return false
    return u.activo
  })

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo || !mensaje) return
    const hoy = new Date().toISOString().slice(0, 10)
    setNotificaciones((prev) => [
      ...candidatos.map((u, idx) => ({
        id: `not-${Date.now()}-${idx}`,
        destinatario_id: u.id,
        titulo,
        mensaje,
        tipo: "info" as const,
        leida: false,
        fecha: hoy,
      })),
      ...prev,
    ])
    setEnviados(candidatos.length)
    setTitulo("")
    setMensaje("")
    setTimeout(() => setEnviados(null), 4000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificaciones masivas"
        description="Envia un mensaje a un grupo segmentado por rol y carrera"
      />

      <Card>
        <CardHeader>
          <CardTitle>Nueva notificacion</CardTitle>
          <CardDescription>
            Se enviara a {candidatos.length} {candidatos.length === 1 ? "persona" : "personas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Destinatarios por rol</Label>
              <Select value={destino} onValueChange={(v) => setDestino(v as UserRole | "todos")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los usuarios</SelectItem>
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Filtrar por carrera</Label>
              <Select value={carrera} onValueChange={setCarrera}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las carreras</SelectItem>
                  {CARRERAS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="titulo">Titulo</Label>
              <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea
                id="mensaje"
                rows={4}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <Button type="submit" disabled={candidatos.length === 0}>
                <Send className="mr-2 h-4 w-4" /> Enviar ({candidatos.length})
              </Button>
              {enviados !== null && (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Enviado a {enviados} {enviados === 1 ? "persona" : "personas"}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
