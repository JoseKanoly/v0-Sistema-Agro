"use client"

import { useState, useEffect } from "react"
import { LaboratorioService, EquipoService, ReactivoService, PracticaService } from "@/lib/services"
import { carrerasMock } from "@/lib/mock/carreras"
import type { Laboratorio, Equipo, Reactivo, Practica } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Wrench, TestTube, ClipboardList, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"

export default function LaboratorioDashboardPage() {
  const [labs, setLabs] = useState<Laboratorio[]>([])
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [reactivos, setReactivos] = useState<Reactivo[]>([])
  const [practicas, setPracticas] = useState<Practica[]>([])

  useEffect(() => {
    LaboratorioService.getAll().then(setLabs)
    EquipoService.getAll().then(setEquipos)
    ReactivoService.getAll().then(setReactivos)
    PracticaService.getAll().then(setPracticas)
  }, [])

  const equiposOK = equipos.filter((e) => e.estado === "operativo").length
  const reactivosOK = reactivos.filter((r) => r.estado === "disponible").length
  const reactivosAlerta = reactivos.filter((r) => r.estado === "bajo_stock").length
  const practicasRealizadas = practicas.filter((p) => p.estado === "realizada").length

  const labStats = labs.map((l) => ({
    name: l.nombre.replace("Laboratorio de ", "Lab. "),
    equipos: equipos.filter((e) => e.laboratorioId === l.id).length,
    reactivos: reactivos.filter((r) => r.laboratorioId === l.id).length,
  }))

  const equiposPie = [
    { name: "Operativo", value: equiposOK, fill: "#22c55e" },
    { name: "Mantenimiento", value: equipos.filter((e) => e.estado === "mantenimiento").length, fill: "#f59e0b" },
    { name: "Dañado", value: equipos.filter((e) => e.estado === "dañado").length, fill: "#ef4444" },
  ]

  const reactivosPie = [
    { name: "Disponible", value: reactivosOK, fill: "#1a6b3c" },
    { name: "Bajo stock", value: reactivosAlerta, fill: "#f59e0b" },
    { name: "Agotado", value: reactivos.filter((r) => r.estado === "agotado").length, fill: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Dashboard de Laboratorios</h1>
        <p className="text-[#64748b] mt-1">Resumen general del estado de laboratorios</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5 flex items-center gap-4">
            <FlaskConical className="w-8 h-8 text-[#1a6b3c]" />
            <div><p className="text-xs text-[#64748b]">Laboratorios</p><p className="text-2xl font-bold text-[#0f172a]">{labs.length}</p></div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5 flex items-center gap-4">
            <Wrench className="w-8 h-8 text-blue-500" />
            <div><p className="text-xs text-[#64748b]">Equipos</p><p className="text-2xl font-bold text-[#0f172a]">{equipos.length}</p><p className="text-xs text-[#1a6b3c]">{equiposOK} operativos</p></div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5 flex items-center gap-4">
            <TestTube className="w-8 h-8 text-purple-500" />
            <div><p className="text-xs text-[#64748b]">Reactivos</p><p className="text-2xl font-bold text-[#0f172a]">{reactivos.length}</p>{reactivosAlerta > 0 && <p className="text-xs text-yellow-600">{reactivosAlerta} bajo stock</p>}</div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5 flex items-center gap-4">
            <ClipboardList className="w-8 h-8 text-[#f59e0b]" />
            <div><p className="text-xs text-[#64748b]">Practicas</p><p className="text-2xl font-bold text-[#0f172a]">{practicas.length}</p><p className="text-xs text-[#64748b]">{practicasRealizadas} realizadas</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[#e2e8f0]">
          <CardHeader><CardTitle className="text-[#0f172a]">Estado de equipos</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={equiposPie} dataKey="value" nameKey="name" outerRadius={80} paddingAngle={3} label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}>
                  {equiposPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Legend /><Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0]">
          <CardHeader><CardTitle className="text-[#0f172a]">Estado de reactivos</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={reactivosPie} dataKey="value" nameKey="name" outerRadius={80} paddingAngle={3} label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}>
                  {reactivosPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Legend /><Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader><CardTitle className="text-[#0f172a]">Equipos y reactivos por laboratorio</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={labStats} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="equipos" name="Equipos" fill="#1a6b3c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reactivos" name="Reactivos" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {labs.map((lab) => {
          const eqCount = equipos.filter((e) => e.laboratorioId === lab.id).length
          const reacCount = reactivos.filter((r) => r.laboratorioId === lab.id).length
          const carrera = carrerasMock.find((c) => c.id === lab.carreraId)
          return (
            <Card key={lab.id} className="border-[#e2e8f0]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-[#1a6b3c]" />
                  </div>
                  <Badge className={lab.estado === "activo" ? "bg-[#e8f5ee] text-[#1a6b3c] hover:bg-[#e8f5ee]" : "bg-gray-100 text-gray-600"}>{lab.estado}</Badge>
                </div>
                <p className="font-bold text-[#0f172a] text-sm">{lab.nombre}</p>
                <p className="text-xs text-[#64748b] mt-0.5">{lab.ubicacion}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{carrera?.siglas ?? ""} &bull; Cap: {lab.capacidad}</p>
                <div className="flex gap-4 mt-3 pt-3 border-t border-[#f1f5f9]">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#0f172a]">{eqCount}</p>
                    <p className="text-xs text-[#64748b]">Equipos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#0f172a]">{reacCount}</p>
                    <p className="text-xs text-[#64748b]">Reactivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
