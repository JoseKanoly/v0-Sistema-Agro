"use client"

import { useState } from "react"
import { informesInvestigacionMock } from "@/lib/mock/docencia"
import { carrerasMock } from "@/lib/mock/carreras"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Microscope, Search, TrendingUp } from "lucide-react"
import { toast } from "sonner"

const AVANCE_SEED = [0, 25, 40, 60, 75, 100, 15, 50, 80, 30]

interface Avance {
  id: number
  proyectoId: number
  titulo: string
  investigador: string
  carreraId: number
  lineaInvestigacion: string
  avancePct: number
  ultimaActualizacion: string
  estado: "pendiente" | "aprobado" | "rechazado"
}

const avancesMock: Avance[] = informesInvestigacionMock.map((p, i) => ({
  id: p.id,
  proyectoId: p.id,
  titulo: p.titulo,
  investigador: p.investigador,
  carreraId: p.carreraId,
  lineaInvestigacion: p.lineaInvestigacion,
  avancePct: AVANCE_SEED[i % AVANCE_SEED.length],
  ultimaActualizacion: p.fecha,
  estado: p.estado,
}))

const ESTADO_STYLES: Record<string, string> = {
  pendiente: "bg-amber-50 text-amber-700",
  aprobado: "bg-[#e8f5ee] text-[#1a6b3c]",
  rechazado: "bg-red-50 text-red-700",
}

export default function AvancesInvestigacionPage() {
  const [avances, setAvances] = useState<Avance[]>(avancesMock)
  const [search, setSearch] = useState("")
  const [carreraFilter, setCarreraFilter] = useState("todos")

  const carreraMap = Object.fromEntries(carrerasMock.map((c) => [c.id, c]))

  const filtered = avances.filter((a) => {
    const matchSearch = `${a.titulo} ${a.investigador} ${a.lineaInvestigacion}`.toLowerCase().includes(search.toLowerCase())
    const matchCarrera = carreraFilter === "todos" || String(a.carreraId) === carreraFilter
    return matchSearch && matchCarrera
  })

  const updateAvance = (id: number, delta: number) => {
    setAvances((prev) =>
      prev.map((a) => a.id === id ? { ...a, avancePct: Math.min(100, Math.max(0, a.avancePct + delta)) } : a)
    )
    toast.success("Avance actualizado")
  }

  const avgAvance = filtered.length > 0
    ? Math.round(filtered.reduce((acc, a) => acc + a.avancePct, 0) / filtered.length)
    : 0

  const completados = avances.filter((a) => a.avancePct === 100).length
  const enProgreso = avances.filter((a) => a.avancePct > 0 && a.avancePct < 100).length
  const sinIniciar = avances.filter((a) => a.avancePct === 0).length

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Avances de Investigacion</h1>
        <p className="text-[#64748b] mt-1">Seguimiento del progreso de cada proyecto de investigacion</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#1a6b3c]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f172a]">{avgAvance}%</p>
              <p className="text-xs text-[#64748b]">Prom. avance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#1a6b3c]">{completados}</p>
            <p className="text-xs text-[#64748b]">Completados</p>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{enProgreso}</p>
            <p className="text-xs text-[#64748b]">En progreso</p>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#94a3b8]">{sinIniciar}</p>
            <p className="text-xs text-[#64748b]">Sin iniciar</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
            <Microscope className="w-4 h-4 text-[#1a6b3c]" />
            Proyectos ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <Input placeholder="Buscar por titulo o investigador..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-[#e2e8f0]" />
            </div>
            <Select value={carreraFilter} onValueChange={setCarreraFilter}>
              <SelectTrigger className="w-full sm:w-44 border-[#e2e8f0]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las carreras</SelectItem>
                {carrerasMock.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.siglas}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filtered.map((a) => {
              const carrera = carreraMap[a.carreraId]
              const avanceColor = a.avancePct === 100 ? "text-[#1a6b3c]" : a.avancePct >= 50 ? "text-amber-700" : "text-[#64748b]"
              return (
                <div key={a.id} className="border border-[#e2e8f0] rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0f172a] text-pretty">{a.titulo}</p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        {a.investigador} · {carrera?.siglas} · {a.lineaInvestigacion}
                      </p>
                    </div>
                    <Badge className={`text-xs border-0 flex-shrink-0 ${ESTADO_STYLES[a.estado]}`}>{a.estado}</Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#64748b]">Progreso</span>
                      <span className={`text-sm font-bold ${avanceColor}`}>{a.avancePct}%</span>
                    </div>
                    <Progress value={a.avancePct} className="h-2 bg-[#e2e8f0]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94a3b8]">Ultima act.: {a.ultimaActualizacion}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateAvance(a.id, -10)} className="h-7 text-xs px-2">-10%</Button>
                      <Button size="sm" variant="outline" onClick={() => updateAvance(a.id, 10)} className="h-7 text-xs px-2 border-[#1a6b3c] text-[#1a6b3c] hover:bg-[#e8f5ee]">+10%</Button>
                    </div>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-[#94a3b8]">No se encontraron proyectos.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
