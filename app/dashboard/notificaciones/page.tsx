"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface Notificacion {
  id: number
  titulo: string
  mensaje: string
  tipo: string
  leida: boolean
  createdAt: string
}

// Demo notifications shown until real data is loaded from DB
const DEMO: Notificacion[] = [
  { id: 1, titulo: "Silabo pendiente de revision", mensaje: "Tu silabo de Bioquimica fue enviado y esta en proceso de revision por el coordinador.", tipo: "info", leida: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 2, titulo: "Informe aprobado", mensaje: "Tu informe de la asignatura Tecnologia de Alimentos fue aprobado exitosamente.", tipo: "success", leida: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 3, titulo: "Justificacion rechazada", mensaje: "Tu solicitud de justificacion para el dia 05/05/2026 fue rechazada. Por favor, comunicate con secretaria.", tipo: "error", leida: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 4, titulo: "Practica programada", mensaje: "Se ha programado una practica de laboratorio para el dia 20/06/2026 en el Laboratorio de Quimica Analitica.", tipo: "warning", leida: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 5, titulo: "Nuevo periodo academico", mensaje: "El periodo academico 2026-2 ha sido activado. Revisa tu carga horaria asignada.", tipo: "info", leida: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
]

const tipoIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

const tipoColor: Record<string, string> = {
  info: "#3b82f6",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs} h`
  return `Hace ${Math.floor(hrs / 24)} dias`
}

export default function NotificacionesPage() {
  const [notifs, setNotifs] = useState<Notificacion[]>(DEMO)

  const unread = notifs.filter((n) => !n.leida).length

  const markRead = (id: number) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, leida: true })))

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Notificaciones</h1>
            <p className="text-[#64748b] mt-1">
              {unread > 0 ? `Tienes ${unread} notificacion${unread > 1 ? "es" : ""} sin leer` : "Todas las notificaciones han sido leidas"}
            </p>
          </div>
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
              <CheckCheck className="w-4 h-4" />
              Marcar todas
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: notifs.length, color: "#1a6b3c" },
          { label: "Sin leer", value: unread, color: "#3b82f6" },
          { label: "Leidas", value: notifs.length - unread, color: "#22c55e" },
          { label: "Alertas", value: notifs.filter((n) => n.tipo === "warning" || n.tipo === "error").length, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="border-[#e2e8f0]">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">{label}</p>
              <p className="text-3xl font-bold text-[#0f172a] mt-1" style={{ color: value > 0 ? color : undefined }}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#0f172a]">Centro de notificaciones</CardTitle>
          <CardDescription>Actividad reciente del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {notifs.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-10 h-10 text-[#cbd5e1] mx-auto mb-3" />
              <p className="text-[#475569] font-medium">No tienes notificaciones.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifs.map((n) => {
                const Icon = tipoIcon[n.tipo] ?? Info
                const color = tipoColor[n.tipo] ?? "#3b82f6"
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                      n.leida ? "border-[#f1f5f9] bg-white" : "border-[#dbeafe] bg-[#eff6ff]"
                    }`}
                    onClick={() => markRead(n.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && markRead(n.id)}
                    aria-label={`Notificacion: ${n.titulo}`}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: color + "18" }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${n.leida ? "text-[#475569]" : "text-[#0f172a]"}`}>{n.titulo}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-[#94a3b8]">{timeAgo(n.createdAt)}</span>
                          {!n.leida && <div className="w-2 h-2 rounded-full bg-[#3b82f6]" aria-label="No leida" />}
                        </div>
                      </div>
                      <p className={`text-xs mt-0.5 leading-relaxed ${n.leida ? "text-[#94a3b8]" : "text-[#64748b]"}`}>{n.mensaje}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
