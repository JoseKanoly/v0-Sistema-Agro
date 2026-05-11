"use client"

import { useRef } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, FechaLimiteBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, BookOpen } from "lucide-react"

export default function SilabosPage() {
  return (
    <AccessGuard roles={["docente"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { silabos, setSilabos, agregarNotificacion } = useData()
  const inputRef = useRef<HTMLInputElement>(null)
  const replaceRef = useRef<string | null>(null)

  if (!user) return null
  const mios = silabos.filter((s) => s.docente_id === user.id)

  const onPick = (id: string) => {
    replaceRef.current = id
    inputRef.current?.click()
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const id = replaceRef.current
    if (!file || !id) return
    setSilabos((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              archivo: file.name,
              fecha_subida: new Date().toISOString().slice(0, 10),
              estado: "pendiente",
              observaciones: null,
            }
          : s,
      ),
    )
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Silabo actualizado",
      mensaje: "Tu silabo fue enviado a revision.",
      tipo: "info",
    })
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis silabos"
        description="Sube y administra los silabos de tus asignaturas"
      />

      <input ref={inputRef} type="file" accept=".pdf" onChange={onFile} className="hidden" />

      <div className="space-y-2">
        {mios.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No tienes asignaturas asignadas.
            </CardContent>
          </Card>
        ) : (
          mios.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{s.materia}</p>
                    <p className="text-xs text-muted-foreground">{s.archivo}</p>
                    {s.observaciones && (
                      <p className="text-xs text-red-700">Obs: {s.observaciones}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <FechaLimiteBadge fechaLimite={s.fecha_limite} />
                  <StatusBadge estado={s.estado} />
                  <Button size="sm" variant="outline" onClick={() => onPick(s.id)}>
                    <Upload className="mr-2 h-3.5 w-3.5" />
                    {s.estado === "rechazado" ? "Volver a subir" : "Reemplazar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
