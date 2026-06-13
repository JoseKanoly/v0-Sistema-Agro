import { redirect } from "next/navigation"
import { getCurrentPerfil } from "@/app/actions/auth"
import { db } from "@/lib/db"
import { laboratorios, equipos, reactivos, practicas } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Wrench, TestTube, BookOpenCheck, MapPin, User } from "lucide-react"

export default async function LaboratorioPage() {
  const data = await getCurrentPerfil()
  if (!data?.user) redirect("/auth/login")

  const [totalLabs, totalEquipos, totalReactivos, totalPracticas] = await Promise.all([
    db.select({ c: count() }).from(laboratorios),
    db.select({ c: count() }).from(equipos),
    db.select({ c: count() }).from(reactivos),
    db.select({ c: count() }).from(practicas),
  ])

  const labs = await db.select().from(laboratorios).limit(20)
  const labEquiposCount = await db.select({ c: count(), id: equipos.laboratorioId }).from(equipos).groupBy(equipos.laboratorioId)
  const labReactivosCount = await db.select({ c: count(), id: reactivos.laboratorioId }).from(reactivos).groupBy(reactivos.laboratorioId)

  const eqMap = Object.fromEntries(labEquiposCount.map((r) => [r.id, r.c]))
  const rxMap = Object.fromEntries(labReactivosCount.map((r) => [r.id, r.c]))

  const n = (r: { c: number }[]) => r[0]?.c ?? 0

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Laboratorios</h1>
        <p className="text-[#64748b] mt-1">Gestion de laboratorios, equipos y reactivos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Laboratorios", value: n(totalLabs), icon: FlaskConical, color: "#1a6b3c" },
          { label: "Equipos", value: n(totalEquipos), icon: Wrench, color: "#3b82f6" },
          { label: "Reactivos", value: n(totalReactivos), icon: TestTube, color: "#f59e0b" },
          { label: "Practicas", value: n(totalPracticas), icon: BookOpenCheck, color: "#8b5cf6" },
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
          <CardTitle className="text-[#0f172a]">Laboratorios Registrados</CardTitle>
          <CardDescription>Espacios de practica disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          {labs.length === 0 ? (
            <p className="text-[#64748b] text-sm py-8 text-center">No hay laboratorios registrados aun.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {labs.map((lab) => (
                <div key={lab.id} className="border border-[#e2e8f0] rounded-xl p-4 hover:shadow-sm transition-shadow bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                      <FlaskConical className="w-5 h-5 text-[#1a6b3c]" />
                    </div>
                    <Badge variant={lab.estado === "activo" ? "default" : "secondary"}>
                      {lab.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-[#0f172a] text-sm leading-tight mb-2">{lab.nombre}</h3>
                  {lab.ubicacion && (
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b] mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{lab.ubicacion}</span>
                    </div>
                  )}
                  {lab.responsable && (
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b] mb-2">
                      <User className="w-3 h-3" />
                      <span>{lab.responsable}</span>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2 border-t border-[#f1f5f9] text-xs text-[#64748b]">
                    <span>{eqMap[lab.id] ?? 0} equipos</span>
                    <span>{rxMap[lab.id] ?? 0} reactivos</span>
                    <span>Cap. {lab.capacidad}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
