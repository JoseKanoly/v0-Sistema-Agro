import { redirect } from "next/navigation"
import { getCurrentPerfil } from "@/app/actions/auth"
import { db } from "@/lib/db"
import { temasTitulacion, carreras } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, CheckCircle, Clock } from "lucide-react"

const estadoConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  propuesto: { label: "Propuesto", variant: "secondary" },
  en_progreso: { label: "En Progreso", variant: "default" },
  completado: { label: "Completado", variant: "outline" },
}

const modalidadLabel: Record<string, string> = {
  proyecto: "Proyecto",
  tesis: "Tesis",
  examen_complexivo: "Examen Complexivo",
}

export default async function TitulacionPage() {
  const data = await getCurrentPerfil()
  if (!data?.user) redirect("/auth/login")

  const [total, enProgreso, completados, propuestos] = await Promise.all([
    db.select({ c: count() }).from(temasTitulacion),
    db.select({ c: count() }).from(temasTitulacion).where(eq(temasTitulacion.estado, "en_progreso")),
    db.select({ c: count() }).from(temasTitulacion).where(eq(temasTitulacion.estado, "completado")),
    db.select({ c: count() }).from(temasTitulacion).where(eq(temasTitulacion.estado, "propuesto")),
  ])

  const temas = await db.select().from(temasTitulacion).limit(50)
  const carrerasList = await db.select().from(carreras)

  const carreraMap = Object.fromEntries(carrerasList.map((c) => [c.id, c.nombre]))

  const n = (r: { c: number }[]) => r[0]?.c ?? 0

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Titulacion</h1>
        <p className="text-[#64748b] mt-1">Gestion de temas de titulacion por modalidad</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Temas", value: n(total), icon: BookOpen, color: "#1a6b3c" },
          { label: "En Progreso", value: n(enProgreso), icon: Clock, color: "#3b82f6" },
          { label: "Completados", value: n(completados), icon: CheckCircle, color: "#22c55e" },
          { label: "Propuestos", value: n(propuestos), icon: Award, color: "#f59e0b" },
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
          <CardTitle className="text-[#0f172a]">Temas de Titulacion</CardTitle>
          <CardDescription>Listado completo de temas registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {temas.length === 0 ? (
            <p className="text-[#64748b] text-sm py-8 text-center">No hay temas registrados aun.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Titulo</th>
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Tutor</th>
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Carrera</th>
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Modalidad</th>
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Avance</th>
                    <th className="text-left py-3 px-3 text-[#64748b] font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {temas.map((t) => {
                    const cfg = estadoConfig[t.estado] ?? estadoConfig.propuesto
                    return (
                      <tr key={t.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3 px-3 font-medium text-[#0f172a] max-w-xs">
                          <span className="line-clamp-2">{t.titulo}</span>
                        </td>
                        <td className="py-3 px-3 text-[#475569]">{t.tutor ?? "—"}</td>
                        <td className="py-3 px-3 text-[#475569]">{t.carreraId ? (carreraMap[t.carreraId] ?? "—") : "—"}</td>
                        <td className="py-3 px-3 text-[#475569]">{modalidadLabel[t.modalidad] ?? t.modalidad}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#f1f5f9] rounded-full h-2 w-20">
                              <div
                                className="h-2 rounded-full bg-[#1a6b3c]"
                                style={{ width: `${t.avance}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#64748b]">{t.avance}%</span>
                          </div>
                        </td>
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
