"use client"

import { useState, useEffect } from "react"
import { InvestigacionService } from "@/lib/services"
import { carrerasMock } from "@/lib/mock/carreras"
import type { InformeInvestigacion } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Microscope } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"

const lineas = [
  "Seguridad alimentaria y nutricion",
  "Produccion agropecuaria sostenible",
  "Biotecnologia aplicada",
  "Desarrollo agroindustrial",
  "Economia y mercados agrarios",
]

const COLORS = ["#1a6b3c", "#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6"]

export default function LineasPage() {
  const [informes, setInformes] = useState<InformeInvestigacion[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => { InvestigacionService.getAll().then(setInformes) }, [])

  const stats = lineas.map((linea, i) => {
    const related = informes.filter((inf) => inf.lineaInvestigacion === linea)
    return {
      linea,
      total: related.length,
      aprobados: related.filter((r) => r.estado === "aprobado").length,
      pendientes: related.filter((r) => r.estado === "pendiente").length,
      color: COLORS[i % COLORS.length],
    }
  })

  const chartData = stats.map((s) => ({ name: s.linea.split(" ").slice(0, 3).join(" "), total: s.total, color: s.color }))

  const filteredInformes = informes.filter((i) =>
    `${i.titulo} ${i.investigador} ${i.lineaInvestigacion}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Lineas de Investigacion</h1>
        <p className="text-[#64748b] mt-1">Distribucion de proyectos por linea tematica</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[#e2e8f0]">
          <CardHeader><CardTitle className="text-[#0f172a]">Proyectos por linea</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="total" name="Proyectos" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {stats.map((s) => (
            <Card key={s.linea} className="border-[#e2e8f0]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <p className="font-medium text-sm text-[#0f172a] leading-tight">{s.linea}</p>
                  </div>
                  <span className="text-lg font-bold text-[#0f172a]">{s.total}</span>
                </div>
                <Progress value={s.total > 0 ? (s.aprobados / s.total) * 100 : 0} className="h-1.5 mb-1" />
                <div className="flex gap-3 mt-1.5">
                  <span className="text-xs text-[#1a6b3c]">{s.aprobados} aprobados</span>
                  <span className="text-xs text-yellow-600">{s.pendientes} pendientes</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#0f172a]">Todos los informes</CardTitle>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInformes.map((inf) => (
              <div key={inf.id} className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                <div className="w-9 h-9 rounded-lg bg-[#e8f5ee] flex items-center justify-center flex-shrink-0">
                  <Microscope className="w-4 h-4 text-[#1a6b3c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0f172a] text-sm truncate">{inf.titulo}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{inf.investigador} &bull; {inf.lineaInvestigacion}</p>
                </div>
                <Badge className={
                  inf.estado === "aprobado" ? "bg-[#e8f5ee] text-[#1a6b3c] hover:bg-[#e8f5ee]" :
                  inf.estado === "rechazado" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                  "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                }>{inf.estado}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
