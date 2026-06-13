import { redirect } from "next/navigation"
import { getCurrentPerfil } from "@/app/actions/auth"
import { db } from "@/lib/db"
import { practicas, laboratorios, materias } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpenCheck, Clock, CheckCircle, XCircle, Calendar, User } from "lucide-react"

const estadoConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  programada: { label: "Programada", variant: "secondary" },
  realizada: { label: "Realizada", variant: "default" },
  cancelada: { label: "Cancelada", variant: "destructive" },
}

export default async function PracticasPage() {
  const data = await getCurrentPerfil()
  if (!data?.user) redirect("/auth/login")

  const [total, programadas, realizadas, canceladas] = await Promise.all([
    db.select({ c: count() }).from(practicas),
    db.select({ c: count() }).from(practicas).where(eq(practicas.estado, "programada")),
    db.select({ c: count() }).from(practicas).where(eq(practicas.estado, "realizada")),
    db.select({ c: count() }).from(practicas).where(eq(practicas.estado, "cancelada")),
  ])

  const rows = await db.select().from(practicas).limit(50)
  const labsList = await db.select().from(laboratorios)
  const materiasList = await db.select().from(materias)
  const labMap = Object.fromEntries(labsList.map((l) => [l.id, l.nombre]))
  const materiaMap = Object.fromEntries(materiasList.map((m) => [m.id, m.nombre]))

  const n = (r: { c: number }[]) => r[0]?.c ?? 0

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Practicas de Laboratorio</h1>
        <p className="text-[#64748b] mt-1">Registro y seguimiento de practicas por materia</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: n(total), icon: BookOpenCheck, color: "#1a6b3c" },
          { label: "Programadas", value: n(programadas), icon: Clock, color: "#3b82f6" },
          { label: "Realizadas", value: n(realizadas), icon: CheckCircle, color: "#22c55e" },
          { label: "Canceladas", value: n(canceladas), icon: XCircle, color: "#ef4444" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-[#e2e8f0]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">{label}</p>
                  <p className="text-3xl font-bold text-[#0f172a] mt-1">{value}</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#0f172a]">Listado de Practicas</CardTitle>
          <CardDescription>Todas las practicas registradas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-[#64748b] text-sm py-8 text-center">No hay practicas registradas aun.</p>
          ) : (
            <div className="space-y-3">
              {rows.map((p) => {
                const cfg = estadoConfig[p.estado] ?? estadoConfig.programada
                return (
                  <div key={p.id} className="border border-[#e2e8f0] rounded-xl p-4 hover:shadow-sm transition-shadow bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0f172a] text-sm">{p.tema}</p>
                        {p.objetivo && (
                          <p className="text-xs text-[#64748b] mt-0.5 line-clamp-1">{p.objetivo}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#64748b]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {p.fecha}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {p.docenteId.slice(0, 8)}…
                          </span>
                          <span>{labMap[p.laboratorioId] ?? `Lab #${p.laboratorioId}`}</span>
                          {p.materiaId && <span>{materiaMap[p.materiaId] ?? `Materia #${p.materiaId}`}</span>}
                        </div>
                      </div>
                      <Badge variant={cfg.variant} className="shrink-0">{cfg.label}</Badge>
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
