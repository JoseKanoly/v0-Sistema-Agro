"use client"

import { useState } from "react"
import { carrerasMock } from "@/lib/mock/carreras"
import { ROLES } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Send, Users, CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"

interface Notif {
  id: number
  asunto: string
  mensaje: string
  destinatarios: string[]
  fecha: string
  estado: "enviada" | "pendiente"
}

const historial: Notif[] = [
  { id: 1, asunto: "Inicio de periodo academico 2026-I", mensaje: "Se informa el inicio del nuevo periodo...", destinatarios: ["DOCENTE", "ESTUDIANTE"], fecha: "2026-04-01", estado: "enviada" },
  { id: 2, asunto: "Plazo de entrega de silabos", mensaje: "Recordatorio: el plazo vence el 15 de abril...", destinatarios: ["DOCENTE"], fecha: "2026-04-10", estado: "enviada" },
  { id: 3, asunto: "Actualizacion del sistema", mensaje: "Se realizaron mejoras en el modulo de laboratorio...", destinatarios: ["SUPER_ADMIN", "ADMINISTRADOR", "COORDINADOR"], fecha: "2026-04-12", estado: "enviada" },
]

export default function NotificacionesMasivasPage() {
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [rolesSeleccionados, setRolesSeleccionados] = useState<string[]>([])
  const [sent, setSent] = useState<Notif[]>(historial)

  const toggleRol = (rol: string) => {
    setRolesSeleccionados((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    )
  }

  const handleEnviar = () => {
    if (!asunto.trim()) { toast.error("Ingrese un asunto"); return }
    if (!mensaje.trim()) { toast.error("Ingrese el mensaje"); return }
    if (rolesSeleccionados.length === 0) { toast.error("Seleccione al menos un destinatario"); return }
    const nueva: Notif = {
      id: sent.length + 1,
      asunto,
      mensaje,
      destinatarios: rolesSeleccionados,
      fecha: new Date().toISOString().split("T")[0],
      estado: "enviada",
    }
    setSent((p) => [nueva, ...p])
    setAsunto("")
    setMensaje("")
    setRolesSeleccionados([])
    toast.success(`Notificacion enviada a ${rolesSeleccionados.length} grupo(s)`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Notificaciones Masivas</h1>
        <p className="text-[#64748b] mt-1">Envia comunicados a grupos de usuarios del sistema</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Compose */}
        <Card className="border-[#e2e8f0] lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <Bell className="w-4 h-4 text-[#1a6b3c]" />
              Redactar notificacion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Asunto *</Label>
              <Input value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="Titulo del comunicado..." />
            </div>
            <div className="space-y-1.5">
              <Label>Mensaje *</Label>
              <Textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escriba el contenido del comunicado..."
                rows={5}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Destinatarios *</Label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <label key={r.value} className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors">
                    <Checkbox
                      checked={rolesSeleccionados.includes(r.value)}
                      onCheckedChange={() => toggleRol(r.value)}
                    />
                    <span className="text-sm text-[#0f172a]">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button onClick={handleEnviar} className="w-full bg-[#1a6b3c] hover:bg-[#155730] text-white gap-2">
              <Send className="w-4 h-4" />
              Enviar notificacion
            </Button>
          </CardContent>
        </Card>

        {/* Stats + Historial */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-[#e2e8f0]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[#0f172a]">{sent.length}</p>
                <p className="text-xs text-[#64748b] mt-0.5">Total enviadas</p>
              </CardContent>
            </Card>
            <Card className="border-[#e2e8f0]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[#0f172a]">{carrerasMock.length}</p>
                <p className="text-xs text-[#64748b] mt-0.5">Carreras activas</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[#e2e8f0]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#0f172a]">Historial reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sent.slice(0, 6).map((n) => (
                <div key={n.id} className="flex items-start gap-3 pb-3 border-b border-[#f1f5f9] last:border-0 last:pb-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.estado === "enviada" ? "bg-[#e8f5ee]" : "bg-amber-50"}`}>
                    {n.estado === "enviada"
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-[#1a6b3c]" />
                      : <Clock className="w-3.5 h-3.5 text-amber-600" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#0f172a] truncate">{n.asunto}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{n.fecha}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {n.destinatarios.slice(0, 2).map((d) => (
                        <Badge key={d} className="text-[10px] px-1.5 py-0 border-0 bg-[#f1f5f9] text-[#475569]">
                          {ROLES.find((r) => r.value === d)?.label ?? d}
                        </Badge>
                      ))}
                      {n.destinatarios.length > 2 && (
                        <Badge className="text-[10px] px-1.5 py-0 border-0 bg-[#f1f5f9] text-[#475569]">
                          +{n.destinatarios.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
