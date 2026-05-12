"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS = {
  info: Info,
  exito: CheckCircle2,
  advertencia: AlertTriangle,
  error: XCircle,
} as const

const COLORS = {
  info: "text-sky-600",
  exito: "text-emerald-600",
  advertencia: "text-amber-600",
  error: "text-red-600",
}

export default function NotificacionesPage() {
  const { user } = useAuth()
  const { notificaciones, setNotificaciones } = useData()

  if (!user) return null

  const mias = notificaciones.filter((n) => n.destinatario_id === user.id)
  const noLeidas = mias.filter((n) => !n.leida).length

  const marcarLeida = (id: string) => {
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
  }

  const marcarTodasLeidas = () => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.destinatario_id === user.id ? { ...n, leida: true } : n)),
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificaciones"
        description={noLeidas > 0 ? `Tienes ${noLeidas} sin leer` : "Estas al dia"}
        actions={
          noLeidas > 0 ? (
            <Button variant="outline" onClick={marcarTodasLeidas}>
              <Check className="mr-2 h-4 w-4" /> Marcar todas como leidas
            </Button>
          ) : null
        }
      />

      {mias.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <Bell className="h-8 w-8" />
            <p className="text-sm">No tienes notificaciones por el momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {mias.map((n) => {
            const Icon = ICONS[n.tipo]
            return (
              <Card key={n.id} className={cn(!n.leida && "border-primary/40 bg-primary/5")}>
                <CardContent className="flex gap-3 py-4">
                  <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", COLORS[n.tipo])} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{n.titulo}</p>
                      <span className="text-xs text-muted-foreground">{n.fecha}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.mensaje}</p>
                    {!n.leida && (
                      <div className="flex items-center justify-between pt-1">
                        <Badge variant="secondary">Nueva</Badge>
                        <Button size="sm" variant="ghost" onClick={() => marcarLeida(n.id)}>
                          Marcar como leida
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
