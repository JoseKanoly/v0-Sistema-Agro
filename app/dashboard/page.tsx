import { redirect } from "next/navigation"
import { getCurrentPerfil } from "@/app/actions/auth"
import { carrerasMock } from "@/lib/mock/carreras"
import { usuariosMock } from "@/lib/mock/users"
import { informesDocenciaMock } from "@/lib/mock/docencia"
import { temasTitulacionMock } from "@/lib/mock/titulacion"
import { laboratoriosMock } from "@/lib/mock/laboratorio"
import { actividadesVinculacionMock } from "@/lib/mock/vinculacion"
import { informesInvestigacionMock } from "@/lib/mock/docencia"
import { justificacionesMock } from "@/lib/mock/academico"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"
import { FileText, BookOpen, Users, Award, Microscope, Bell, ClipboardCheck, FlaskConical, GraduationCap } from "lucide-react"

const C = ["#1a6b3c", "#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"]

function StatCard({ label, value, sub, icon: Icon, color = "#1a6b3c" }: {
  label: string; value: string | number; sub?: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color?: string
}) {
  return (
    <Card className="border-[#e2e8f0]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold text-[#0f172a] mt-1">{value}</p>
            {sub && <p className="text-xs text-[#64748b] mt-1">{sub}</p>}
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function DashboardPage() {
  const data = await getCurrentPerfil()
  if (!data?.user) redirect("/auth/login")
  const { user: u, perfil } = data
  const rawRol = (perfil?.rol ?? "estudiante").toLowerCase()

  const totalSilabos = informesDocenciaMock.filter((i) => i.tipo === "silabo").length
  const totalInformes = informesDocenciaMock.filter((i) => i.tipo === "asignatura").length
  const pendSil = informesDocenciaMock.filter((i) => i.tipo === "silabo" && i.estado === "pendiente").length
  const pendInf = informesDocenciaMock.filter((i) => i.tipo === "asignatura" && i.estado === "pendiente").length
  const pendJust = justificacionesMock.filter((j) => j.estado === "pendiente").length
  const totalVinc = actividadesVinculacionMock.length
  const totalInv = informesInvestigacionMock.length
  const totalTit = temasTitulacionMock.length
  const totalLabs = laboratoriosMock.length
  const totalDocentes = usuariosMock.filter((u) => u.rol === "DOCENTE").length
  const totalEstudiantes = usuariosMock.filter((u) => u.rol === "ESTUDIANTE").length

  const carreraStats = carrerasMock.map((c) => ({
    name: c.siglas,
    docentes: usuariosMock.filter((u) => u.rol === "DOCENTE" && u.carreraId === c.id).length,
    estudiantes: usuariosMock.filter((u) => u.rol === "ESTUDIANTE" && u.carreraId === c.id).length,
  }))

  const pieData = [
    { name: "Silabos", value: totalSilabos, fill: C[0] },
    { name: "Informes", value: totalInformes, fill: C[1] },
    { name: "Vinculacion", value: totalVinc, fill: C[2] },
    { name: "Investigacion", value: totalInv, fill: C[3] },
    { name: "Titulacion", value: totalTit, fill: C[4] },
  ]

  const nombreDisplay = u.name.split(" ")[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">
              Bienvenido, {nombreDisplay}
            </h1>
            <p className="text-[#64748b] mt-1">
              {new Date().toLocaleDateString("es-EC", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f5ee] text-[#1a6b3c]">
              {rawRol.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
          </div>
        </div>
      </div>

      {/* KPIs - Admin / Super Admin */}
      {(rawRol === "super_admin" || rawRol === "administrador" || rawRol === "secretaria") && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Silabos" value={totalSilabos} sub={`${pendSil} pendientes`} icon={BookOpen} color="#1a6b3c" />
            <StatCard label="Informes" value={totalInformes} sub={`${pendInf} pendientes`} icon={FileText} color="#3b82f6" />
            <StatCard label="Justificaciones" value={justificacionesMock.length} sub={`${pendJust} pendientes`} icon={ClipboardCheck} color="#8b5cf6" />
            <StatCard label="Usuarios" value={usuariosMock.length} sub={`${totalDocentes} docentes`} icon={Users} color="#f59e0b" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Proyectos Vinculacion" value={totalVinc} icon={Award} color="#22c55e" />
            <StatCard label="Investigacion" value={totalInv} icon={Microscope} color="#ef4444" />
            <StatCard label="Temas Titulacion" value={totalTit} icon={GraduationCap} color="#1a6b3c" />
            <StatCard label="Laboratorios" value={totalLabs} icon={FlaskConical} color="#f59e0b" />
          </div>
        </>
      )}

      {rawRol === "coordinador" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Silabos" value={totalSilabos} sub={`${pendSil} pendientes`} icon={BookOpen} color="#1a6b3c" />
          <StatCard label="Proyectos" value={totalInv + totalVinc} icon={Microscope} color="#3b82f6" />
          <StatCard label="Titulacion" value={totalTit} icon={GraduationCap} color="#f59e0b" />
          <StatCard label="Laboratorios" value={totalLabs} icon={FlaskConical} color="#22c55e" />
        </div>
      )}

      {rawRol === "docente" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Mis Silabos" value={informesDocenciaMock.filter((i) => i.tipo === "silabo").length} icon={BookOpen} color="#1a6b3c" />
          <StatCard label="Mis Informes" value={informesDocenciaMock.filter((i) => i.tipo === "asignatura").length} icon={FileText} color="#3b82f6" />
          <StatCard label="Titulacion" value={totalTit} icon={Award} color="#f59e0b" />
          <StatCard label="Laboratorios" value={totalLabs} icon={FlaskConical} color="#8b5cf6" />
        </div>
      )}

      {rawRol === "estudiante" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Justificaciones" value={justificacionesMock.length} icon={ClipboardCheck} color="#1a6b3c" />
          <StatCard label="Titulacion" value={temasTitulacionMock.filter((t) => t.estado === "en_progreso").length} sub="en progreso" icon={GraduationCap} color="#3b82f6" />
          <StatCard label="Docentes" value={totalDocentes} icon={Users} color="#f59e0b" />
          <StatCard label="Laboratorios" value={totalLabs} icon={FlaskConical} color="#22c55e" />
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[#e2e8f0]">
          <CardHeader>
            <CardTitle className="text-[#0f172a]">Distribucion por modulo</CardTitle>
            <CardDescription>Total de registros en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} paddingAngle={3}
                  label={({ name, value }: { name: string; value: number }) => value > 0 ? `${name}: ${value}` : ""}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0]">
          <CardHeader>
            <CardTitle className="text-[#0f172a]">Usuarios por carrera</CardTitle>
            <CardDescription>Docentes y estudiantes activos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={carreraStats} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                <Legend />
                <Bar dataKey="docentes" name="Docentes" fill="#1a6b3c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="estudiantes" name="Estudiantes" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending review */}
      {(rawRol === "super_admin" || rawRol === "administrador" || rawRol === "secretaria") && (
        <Card className="border-[#e2e8f0]">
          <CardHeader>
            <CardTitle className="text-[#0f172a]">Elementos pendientes de revision</CardTitle>
            <CardDescription>Acciones requeridas agrupadas por modulo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[
                  { name: "Silabos", value: pendSil },
                  { name: "Informes", value: pendInf },
                  { name: "Justificaciones", value: pendJust },
                  { name: "Investigacion", value: informesInvestigacionMock.filter((i) => i.estado === "pendiente").length },
                ]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" name="Pendientes" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
