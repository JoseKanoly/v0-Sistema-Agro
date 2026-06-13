"use client"

import { useEffect, useState } from "react"
import { FaltaService, MateriaService } from "@/lib/services"
import type { Falta, Materia } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCheck, AlertTriangle, Clock, CheckCircle } from "lucide-react"

const TIPO_COLOR: Record<Falta["tipo"], string> = {
  injustificada: "bg-red-100 text-red-700",
  justificada: "bg-green-100 text-green-700",
  atraso: "bg-yellow-100 text-yellow-700",
}
const TIPO_ICON: Record<Falta["tipo"], React.ElementType> = {
  injustificada: AlertTriangle,
  justificada: CheckCircle,
  atraso: Clock,
}

export default function MisAsistenciasPage() {
  const [faltas, setFaltas] = useState<Falta[]>([])
  const [materias, setMaterias] = useState<Materia[]>([])
  const [filtroMateria, setFiltroMateria] = useState<string>("all")

  useEffect(() => {
    // Simulate student id = 1 (Andres Mero)
    FaltaService.getAll().then((all) => setFaltas(all.filter((f) => f.estudianteId === 1)))
    MateriaService.getAll().then(setMaterias)
  }, [])

  const misMaterias = [...new Set(faltas.map((f) => f.materiaId))]
  const filtered = filtroMateria === "all" ? faltas : faltas.filter((f) => f.materiaId === Number(filtroMateria))

  const injustificadas = faltas.filter((f) => f.tipo === "injustificada").length
  const justificadas = faltas.filter((f) => f.tipo === "justificada").length
  const atrasos = faltas.filter((f) => f.tipo === "atraso").length
  const MAX_FALTAS = 5

  const getMateriaName = (id: number) => materias.find((m) => m.id === id)?.nombre ?? `Materia #${id}`

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Mis Asistencias</h1>
            <p className="text-[#64748b] mt-1">Registro de faltas y atrasos por asignatura</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#64748b] mb-1">Limite de faltas</p>
            <p className="text-2xl font-bold" style={{ color: injustificadas >= MAX_FALTAS ? "#ef4444" : "#1a6b3c" }}>
              {injustificadas}/{MAX_FALTAS}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Injustificadas", value: injustificadas, color: "#ef4444", Icon: AlertTriangle },
          { label: "Justificadas", value: justificadas, color: "#22c55e", Icon: CheckCircle },
          { label: "Atrasos", value: atrasos, color: "#f59e0b", Icon: Clock },
        ].map((s) => (
          <Card key={s.label} className="border-[#e2e8f0]">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#64748b]">{s.label}</p>
                <p className="text-2xl font-bold text-[#0f172a]">{s.value}</p>
              </div>
              <s.Icon className="w-5 h-5" style={{ color: s.color }} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Asistencia por materia */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {misMaterias.map((materiaId) => {
          const faltasMateria = faltas.filter((f) => f.materiaId === materiaId)
          const inj = faltasMateria.filter((f) => f.tipo === "injustificada").length
          const pct = Math.max(0, Math.round((1 - inj / MAX_FALTAS) * 100))
          return (
            <Card key={materiaId} className="border-[#e2e8f0]">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-[#0f172a] truncate">{getMateriaName(materiaId)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-[#e2e8f0] rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444" }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#0f172a]">{pct}%</span>
                </div>
                <p className="text-xs text-[#64748b] mt-1">{faltasMateria.length} registros &middot; {inj} injustificada{inj !== 1 ? "s" : ""}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detalle */}
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-[#1a6b3c]" />
            <CardTitle className="text-[#0f172a]">Detalle de registros</CardTitle>
            <div className="ml-auto">
              <Select value={filtroMateria} onValueChange={setFiltroMateria}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todas las materias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {misMaterias.map((id) => (
                    <SelectItem key={id} value={String(id)}>{getMateriaName(id)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Materia</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Observacion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => {
                const Icon = TIPO_ICON[f.tipo]
                return (
                  <TableRow key={f.id}>
                    <TableCell className="text-sm font-medium max-w-[160px] truncate">{getMateriaName(f.materiaId)}</TableCell>
                    <TableCell className="text-sm text-[#64748b]">{f.fecha}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${TIPO_COLOR[f.tipo]}`}>
                        <Icon className="w-3 h-3" />{f.tipo}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-[#64748b]">{f.observacion}</TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-[#64748b] py-8">No hay registros</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
