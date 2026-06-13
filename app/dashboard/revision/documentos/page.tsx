"use client"

import { useState } from "react"
import { estudiantesMock } from "@/lib/mock/estudiantes"
import { carrerasMock } from "@/lib/mock/carreras"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, CheckCircle2, XCircle, Clock, Eye } from "lucide-react"
import { toast } from "sonner"

type EstadoDoc = "pendiente" | "aprobado" | "rechazado"

interface Documento {
  id: number
  estudianteId: number
  tipo: string
  fechaEntrega: string
  estado: EstadoDoc
}

const TIPOS = ["Matricula", "Cedula de identidad", "Foto tamano carnet", "Certificado medico", "Record academico", "Titulo de bachiller"]

const initialDocs: Documento[] = estudiantesMock.slice(0, 18).map((e, i) => ({
  id: i + 1,
  estudianteId: e.id,
  tipo: TIPOS[i % TIPOS.length],
  fechaEntrega: `2026-04-${((i % 28) + 1).toString().padStart(2, "0")}`,
  estado: (["pendiente", "aprobado", "rechazado"] as EstadoDoc[])[i % 3],
}))

const ESTADO_STYLES: Record<EstadoDoc, { badge: string; icon: React.ElementType }> = {
  pendiente: { badge: "bg-amber-50 text-amber-700", icon: Clock },
  aprobado: { badge: "bg-[#e8f5ee] text-[#1a6b3c]", icon: CheckCircle2 },
  rechazado: { badge: "bg-red-50 text-red-700", icon: XCircle },
}

export default function RevisionDocumentosPage() {
  const [docs, setDocs] = useState<Documento[]>(initialDocs)
  const [search, setSearch] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("todos")

  const carreraMap = Object.fromEntries(carrerasMock.map((c) => [c.id, c.siglas]))
  const estudianteMap = Object.fromEntries(estudiantesMock.map((e) => [e.id, e]))

  const filtered = docs.filter((d) => {
    const est = estudianteMap[d.estudianteId]
    const matchSearch = est
      ? `${est.nombres} ${est.apellidos} ${est.cedula} ${d.tipo}`.toLowerCase().includes(search.toLowerCase())
      : false
    const matchEstado = estadoFilter === "todos" || d.estado === estadoFilter
    return matchSearch && matchEstado
  })

  const cambiarEstado = (id: number, estado: EstadoDoc) => {
    setDocs((p) => p.map((d) => d.id === id ? { ...d, estado } : d))
    toast.success(`Documento marcado como ${estado}`)
  }

  const pendientes = docs.filter((d) => d.estado === "pendiente").length
  const aprobados = docs.filter((d) => d.estado === "aprobado").length
  const rechazados = docs.filter((d) => d.estado === "rechazado").length

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Revision de Documentos</h1>
        <p className="text-[#64748b] mt-1">Documentacion presentada por los estudiantes</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pendientes", value: pendientes, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Aprobados", value: aprobados, color: "text-[#1a6b3c]", bg: "bg-[#e8f5ee]" },
          { label: "Rechazados", value: rechazados, color: "text-red-700", bg: "bg-red-50" },
        ].map((s) => (
          <Card key={s.label} className="border-[#e2e8f0]">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-[#0f172a]">{s.value}</p>
              <p className={`text-sm font-medium mt-0.5 ${s.color}`}>{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
            <FileText className="w-4 h-4 text-[#1a6b3c]" />
            Documentos ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <Input placeholder="Buscar por nombre, cedula o tipo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-[#e2e8f0]" />
            </div>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-full sm:w-44 border-[#e2e8f0]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {filtered.map((d) => {
              const est = estudianteMap[d.estudianteId]
              if (!est) return null
              const { badge, icon: Icon } = ESTADO_STYLES[d.estado]
              return (
                <div key={d.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#1a6b3c]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1a6b3c] text-xs font-bold">{est.nombres.charAt(0)}{est.apellidos.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0f172a] truncate">{est.nombres} {est.apellidos}</p>
                      <p className="text-xs text-[#64748b]">CI: {est.cedula} · {carreraMap[est.carreraId] ?? "—"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-[#475569] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1 rounded-full text-xs">{d.tipo}</span>
                    <span className="text-xs text-[#94a3b8]">{d.fechaEntrega}</span>
                    <Badge className={`text-xs border-0 flex items-center gap-1 ${badge}`}>
                      <Icon className="w-3 h-3" />{d.estado}
                    </Badge>
                    {d.estado === "pendiente" && (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => cambiarEstado(d.id, "aprobado")} className="h-7 text-xs bg-[#1a6b3c] hover:bg-[#155730] text-white px-2">
                          <CheckCircle2 className="w-3 h-3 mr-1" />Aprobar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => cambiarEstado(d.id, "rechazado")} className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 px-2">
                          <XCircle className="w-3 h-3 mr-1" />Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-[#94a3b8]">No se encontraron documentos.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
