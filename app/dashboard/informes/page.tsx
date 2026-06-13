import { redirect } from "next/navigation"
import { getCurrentPerfil } from "@/app/actions/auth"
import { db } from "@/lib/db"
import { informes, materias, periodos } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

const estadoConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pendiente: { label: "Pendiente", variant: "secondary" },
  aprobado: { label: "Aprobado", variant: "default" },
  rechazado: { label: "Rechazado", variant: "destructive" },
}

const tipoLabel: Record<string, string> = {
  asignatura: "Asignatura",
  silabo: "Silabo",
}

export default async function InformesPage() {
  const data = await getCurrentPerfil()
  if (!data?.user) redirect("/auth/login")

  const rol = data.perfil?.rol ?? "docente"
  const isDocente = rol === "docente"

  const [total, pendientes, aprobados, rechazados] = await Promise.all([
    isDocente
      ? db.select({ c: count() }).from(informes).where(eq(informes.docenteId, data.user.id))
      : db.select({ c: count() }).from(informes),
    db.select({ c: count() }).from(informes).where(eq(informes.estado, "pendiente")),
    db.select({ c: count() }).from(informes).where(eq(informes.estado, "aprobado")),
    db.select({ c: count() }).from(informes).where(eq(informes.estado, "rechazado")),
  ])

  const rows = isDocente
    ? await db.select().from(informes).where(eq(informes.docenteId, data.user.id)).limit(50)
    : await db.select().from(informes).limit(50)

  const materiasList = await db.select().from(materias)
  const periodosList = await db.select().from(periodos)
  const materiaMap = Object.fromEntries(materiasList.map((m) => [m.id, m.nombre]))
  const periodoMap = Object.fromEntries(periodosList.map((p) => [p.id, p.nombre]))

  const n = (r: { c: number }[]) => r[0]?.c ?? 0

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Informes</h1>
        <p className="text-[#64748b] mt-1">{isDocente ? "Mis informes de asignatura" : "Revision de informes docentes"}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: n(total), icon: FileText, color: "#1a6b3c" },
          { label: "Pendientes", value: n(pendientes), icon: Clock, color: "#f59e0b" },
          { label: "Aprobados", value: n(aprobados), icon: CheckCircle, color: "#22c55e" },
          { label: "Rechazados", value: n(rechazados), icon: XCircle, color: "#ef4444" },
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
          <CardTitle className="text-[#0f172a]">Listado de Informes</CardTitle>
          <CardDescription>Informes de asignatura registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-[#64748b] text-sm py-8 text-center">No hay informes registrados aun.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Materia</th>
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Periodo</th>
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Tipo</th>
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Fecha</th>
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((inf) => {
                    const cfg = estadoConfig[inf.estado] ?? estadoConfig.pendiente
                    return (
                      <tr key={inf.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3 px-3 font-medium text-[#0f172a]">{materiaMap[inf.materiaId] ?? `Materia #${inf.materiaId}`}</td>
                        <td className="py-3 px-3 text-[#475569]">{periodoMap[inf.periodoId] ?? `Periodo #${inf.periodoId}`}</td>
                        <td className="py-3 px-3 text-[#475569]">{tipoLabel[inf.tipo] ?? inf.tipo}</td>
                        <td className="py-3 px-3 text-[#475569]">{new Date(inf.createdAt).toLocaleDateString("es-EC")}</td>
                        <td className="py-3 px-3">
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
