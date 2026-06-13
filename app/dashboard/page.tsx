import { redirect } from "next/navigation"
import { getCurrentPerfil } from "@/app/actions/auth"
import { db } from "@/lib/db"
import {
  silabos, informes, documentosEstudiante, justificaciones,
  proyectosVinculacion, proyectosInvestigacion, hitosInvestigacion,
  temasTitulacion, notificaciones, user, perfiles, carreras, materias,
  matriculas, faltas, laboratorios
} from "@/lib/db/schema"
import { eq, count, and } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts"
import { FileText, BookOpen, Users, Award, Microscope, Bell, ClipboardCheck, FlaskConical, GraduationCap, Calendar } from "lucide-react"

const C = ["#1a6b3c", "#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"]

function StatCard({ label, value, sub, icon: Icon, color = "#1a6b3c" }: {
  label: string; value: string | number; sub?: string
  icon: React.ComponentType<{ className?: string }>; color?: string
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
  const rol = perfil?.rol ?? "estudiante"

  // Fetch counts based on role
  const [totalSilabos, totalInformes, totalDocs, totalJust, totalVinc, totalInv, totalHitos, totalTit, totalLabs] =
    await Promise.all([
      db.select({ c: count() }).from(silabos),
      db.select({ c: count() }).from(informes),
      db.select({ c: count() }).from(documentosEstudiante),
      db.select({ c: count() }).from(justificaciones),
      db.select({ c: count() }).from(proyectosVinculacion),
      db.select({ c: count() }).from(proyectosInvestigacion),
      db.select({ c: count() }).from(hitosInvestigacion),
      db.select({ c: count() }).from(temasTitulacion),
      db.select({ c: count() }).from(laboratorios),
    ])

  const n = (r: { c: number }[]) => r[0]?.c ?? 0

  // Pending counts
  const [pendSil, pendInf, pendDocs, pendJust] = await Promise.all([
    db.select({ c: count() }).from(silabos).where(eq(silabos.estado, "pendiente")),
    db.select({ c: count() }).from(informes).where(eq(informes.estado, "pendiente")),
    db.select({ c: count() }).from(documentosEstudiante).where(eq(documentosEstudiante.estado, "pendiente")),
    db.select({ c: count() }).from(justificaciones).where(eq(justificaciones.estado, "pendiente")),
  ])

  // Per-user counts
  const [mySil, myInf, myDocs, myJust, myTit, myNotif] = await Promise.all([
    db.select({ c: count() }).from(silabos).where(eq(silabos.docenteId, u.id)),
    db.select({ c: count() }).from(informes).where(eq(informes.docenteId, u.id)),
    db.select({ c: count() }).from(documentosEstudiante).where(eq(documentosEstudiante.estudianteId, u.id)),
    db.select({ c: count() }).from(justificaciones).where(eq(justificaciones.solicitanteId, u.id)),
    db.select({ c: count() }).from(temasTitulacion).where(eq(temasTitulacion.estudianteId, u.id)),
    db.select({ c: count() }).from(notificaciones).where(and(eq(notificaciones.destinatarioId, u.id), eq(notificaciones.leida, false))),
  ])

  const allCarreras = await db.select().from(carreras).where(eq(carreras.activa, true))
  const allPerfiles = await db.select().from(perfiles)

  const carreraStats = allCarreras.map((c) => ({
    name: c.nombre.replace("Ingenieria en ", "Ing. ").replace("Ingenieria ", "Ing. "),
    docentes: allPerfiles.filter((p) => p.rol === "docente" && p.carreraId === c.id).length,
    estudiantes: allPerfiles.filter((p) => p.rol === "estudiante" && p.carreraId === c.id).length,
  }))

  const pieData = [
    { name: "Silabos", value: n(totalSilabos), fill: C[0] },
    { name: "Informes", value: n(totalInformes), fill: C[1] },
    { name: "Vinculacion", value: n(totalVinc), fill: C[2] },
    { name: "Investigacion", value: n(totalInv), fill: C[3] },
    { name: "Titulacion", value: n(totalTit), fill: C[4] },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">
              Bienvenido, {u.name.split(" ")[0]}
            </h1>
            <p className="text-[#64748b] mt-1">
              {new Date().toLocaleDateString("es-EC", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f5ee] text-[#1a6b3c]">
              {rol.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards - Role based */}
      {(rol === "super_admin" || rol === "secretaria") && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Silabos" value={n(totalSilabos)} sub={`${n(pendSil)} pendientes`} icon={BookOpen} color="#1a6b3c" />
          <StatCard label="Informes" value={n(totalInformes)} sub={`${n(pendInf)} pendientes`} icon={FileText} color="#3b82f6" />
          <StatCard label="Docs. Estudiantes" value={n(totalDocs)} sub={`${n(pendDocs)} pendientes`} icon={GraduationCap} color="#f59e0b" />
          <StatCard label="Justificaciones" value={n(totalJust)} sub={`${n(pendJust)} pendientes`} icon={ClipboardCheck} color="#8b5cf6" />
        </div>
      )}
      {(rol === "super_admin" || rol === "secretaria") && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Proyectos Vinculacion" value={n(totalVinc)} icon={Award} color="#22c55e" />
          <StatCard label="Proyectos Investigacion" value={n(totalInv)} icon={Microscope} color="#ef4444" />
          <StatCard label="Temas Titulacion" value={n(totalTit)} icon={GraduationCap} color="#1a6b3c" />
          <StatCard label="Laboratorios" value={n(totalLabs)} icon={FlaskConical} color="#f59e0b" />
        </div>
      )}

      {rol === "docente" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Mis Silabos" value={n(mySil)} icon={BookOpen} color="#1a6b3c" />
          <StatCard label="Mis Informes" value={n(myInf)} icon={FileText} color="#3b82f6" />
          <StatCard label="Notificaciones" value={n(myNotif)} sub="sin leer" icon={Bell} color="#f59e0b" />
          <StatCard label="Total Entregas" value={n(mySil) + n(myInf)} icon={ClipboardCheck} color="#8b5cf6" />
        </div>
      )}

      {rol === "estudiante" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Mis Documentos" value={n(myDocs)} icon={FileText} color="#1a6b3c" />
          <StatCard label="Justificaciones" value={n(myJust)} icon={ClipboardCheck} color="#3b82f6" />
          <StatCard label="Tema Titulacion" value={n(myTit) > 0 ? "Asignado" : "Pendiente"} icon={GraduationCap} color={n(myTit) > 0 ? "#22c55e" : "#f59e0b"} />
          <StatCard label="Notificaciones" value={n(myNotif)} sub="sin leer" icon={Bell} color="#8b5cf6" />
        </div>
      )}

      {(rol === "coordinador_carrera" || rol === "coordinador_investigacion") && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Silabos" value={n(totalSilabos)} sub={`${n(pendSil)} pendientes`} icon={BookOpen} color="#1a6b3c" />
          <StatCard label="Proyectos" value={n(totalInv) + n(totalVinc)} icon={Microscope} color="#3b82f6" />
          <StatCard label="Titulacion" value={n(totalTit)} icon={GraduationCap} color="#f59e0b" />
          <StatCard label="Laboratorios" value={n(totalLabs)} icon={FlaskConical} color="#22c55e" />
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
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} paddingAngle={3} label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}>
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

      {/* Pending review summary for secretaria / admin */}
      {(rol === "super_admin" || rol === "secretaria") && (
        <Card className="border-[#e2e8f0]">
          <CardHeader>
            <CardTitle className="text-[#0f172a]">Elementos pendientes de revision</CardTitle>
            <CardDescription>Acciones requeridas agrupadas por modulo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { name: "Silabos", value: n(pendSil) },
                { name: "Informes", value: n(pendInf) },
                { name: "Documentos", value: n(pendDocs) },
                { name: "Justificaciones", value: n(pendJust) },
              ]} layout="vertical">
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
