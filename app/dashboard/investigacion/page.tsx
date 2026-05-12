"use client"

import { useRef, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { AccessGuard } from "@/components/access-guard"
import { PageHeader } from "@/components/page-header"
import { ConvocatoriaBanner } from "@/components/convocatoria-banner"
import { ExportButtons } from "@/components/export-buttons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Microscope, FileText, Upload } from "lucide-react"
import { CARRERAS } from "@/lib/mock/carreras"
import { Progress } from "@/components/ui/progress"
import type { ExportColumn } from "@/lib/utils/export"
import type { ProyectoInvestigacion } from "@/lib/types/database"

const HOY = new Date().toISOString().slice(0, 10)

export default function InvestigacionPage() {
  return (
    <AccessGuard roles={["docente", "coordinador_investigacion", "super_admin"]}>
      <Content />
    </AccessGuard>
  )
}

function Content() {
  const { user } = useAuth()
  const { proyectos, hitos, setHitos, usuarios, agregarNotificacion } = useData()
  const inputRef = useRef<HTMLInputElement>(null)
  const targetHito = useRef<string | null>(null)

  if (!user) return null

  if (user.rol === "docente" && !user.tiene_investigacion) {
    return (
      <div className="space-y-6">
        <PageHeader title="Investigacion" description="Tus proyectos de investigacion" />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Microscope className="h-10 w-10" />
            <p className="text-sm">No tienes proyectos de investigacion asignados.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const visibles = user.rol === "docente" ? proyectos.filter((p) => p.docente_id === user.id) : proyectos

  const onPick = (hitoId: string) => {
    targetHito.current = hitoId
    inputRef.current?.click()
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const id = targetHito.current
    if (!file || !id) return
    setHitos((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, archivo: file.name, fecha_subida: HOY, completado: true } : h,
      ),
    )
    agregarNotificacion({
      destinatario_id: user.id,
      titulo: "Hito de investigacion completado",
      mensaje: "Tu avance fue registrado correctamente.",
      tipo: "exito",
    })
    if (inputRef.current) inputRef.current.value = ""
  }

  const projectColumns: ExportColumn<ProyectoInvestigacion>[] = [
    { header: "Titulo", accessor: (r) => r.titulo },
    {
      header: "Investigador",
      accessor: (r) => {
        const d = usuarios.find((u) => u.id === r.docente_id)
        return d ? `${d.nombres} ${d.apellidos}` : ""
      },
    },
    {
      header: "Carrera",
      accessor: (r) => CARRERAS.find((c) => c.id === r.carrera_id)?.nombre ?? "",
    },
    { header: "Total hitos", accessor: (r) => r.total_hitos },
    {
      header: "Completados",
      accessor: (r) => hitos.filter((h) => h.proyecto_id === r.id && h.completado).length,
    },
    {
      header: "Avance %",
      accessor: (r) => {
        const total = r.total_hitos
        const ok = hitos.filter((h) => h.proyecto_id === r.id && h.completado).length
        return Math.round((ok / total) * 100)
      },
    },
    { header: "Fecha inicio", accessor: (r) => r.fecha_inicio },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.rol === "docente" ? "Mis proyectos de investigacion" : "Proyectos de investigacion"}
        description="Avance de hitos por proyecto"
        actions={
          <ExportButtons
            filename="proyectos_investigacion"
            title="Proyectos de investigacion"
            subtitle="Resumen de avance por proyecto"
            columns={projectColumns}
            rows={visibles}
          />
        }
      />

      {user.rol === "docente" && <ConvocatoriaBanner tipos={["investigacion_hito"]} />}

      <input ref={inputRef} type="file" accept=".pdf" onChange={onFile} className="hidden" />

      <div className="grid gap-4 lg:grid-cols-2">
        {visibles.map((p) => {
          const hitosP = hitos.filter((h) => h.proyecto_id === p.id).sort((a, b) => a.numero - b.numero)
          const completados = hitosP.filter((h) => h.completado).length
          const docente = usuarios.find((u) => u.id === p.docente_id)
          const carrera = CARRERAS.find((c) => c.id === p.carrera_id)
          const progreso = (completados / p.total_hitos) * 100

          return (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Microscope className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{p.titulo}</CardTitle>
                    <CardDescription>
                      {docente?.nombres} {docente?.apellidos} - {carrera?.nombre}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Hitos: {completados} / {p.total_hitos}
                    </span>
                    <span className="font-medium">{Math.round(progreso)}%</span>
                  </div>
                  <Progress value={progreso} />
                </div>
                <div className="space-y-1.5">
                  {hitosP.map((h) => (
                    <div
                      key={h.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-2 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{h.titulo}</span>
                        {h.archivo && (
                          <span className="text-xs text-muted-foreground">- {h.archivo}</span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant={h.completado ? "default" : "outline"}>
                          {h.completado ? "Entregado" : "Pendiente"}
                        </Badge>
                        {user.rol === "docente" && p.docente_id === user.id && (
                          <Button size="sm" variant="outline" onClick={() => onPick(h.id)}>
                            <Upload className="mr-1 h-3.5 w-3.5" />
                            {h.completado ? "Reemplazar" : "Subir"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
