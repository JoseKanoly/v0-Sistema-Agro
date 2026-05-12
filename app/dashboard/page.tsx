"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useData } from "@/lib/mock/store"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLE_LABELS } from "@/lib/navigation"
import { CARRERAS } from "@/lib/mock/carreras"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { FileText, BookOpen, CheckSquare, Users, Award, Microscope, Handshake, Bell } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"

const CHART_COLORS = ["oklch(0.646 0.222 41.116)", "oklch(0.6 0.118 184.704)", "oklch(0.769 0.188 70.08)"]

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string | number
  hint?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 pt-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const {
    documentos,
    asistencias,
    justificaciones,
    silabos,
    informes,
    vinculacion,
    titulacion,
    proyectos,
    hitos,
    usuarios,
    notificaciones,
  } = useData()

  if (!user) return null

  const noLeidas = notificaciones.filter((n) => n.destinatario_id === user.id && !n.leida).length

  // ===== VISTA POR ROL =====

  if (user.rol === "estudiante") {
    const misDocs = documentos.filter((d) => d.estudiante_id === user.id)
    const misAsist = asistencias.filter((a) => a.estudiante_id === user.id)
    const misJust = justificaciones.filter((j) => j.solicitante_id === user.id)
    const miTit = titulacion.find((t) => t.estudiante_id === user.id)
    const aprobados = misDocs.filter((d) => d.estado === "aprobado").length
    const pendientes = misDocs.filter((d) => d.estado === "pendiente").length
    const rechazados = misDocs.filter((d) => d.estado === "rechazado").length
    const data = [
      { name: "Aprobados", value: aprobados },
      { name: "Pendientes", value: pendientes },
      { name: "Rechazados", value: rechazados },
    ]

    return (
      <div className="space-y-6">
        <PageHeader
          title={`Bienvenido, ${user.nombres.split(" ")[0]}`}
          description={`Resumen de tu actividad como ${ROLE_LABELS[user.rol]}.`}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Documentos" value={`${misDocs.length}/5`} hint="Subidos al SGA" icon={FileText} />
          <StatCard label="Faltas" value={misAsist.length} hint="Registradas este periodo" icon={CheckSquare} />
          <StatCard label="Justificaciones" value={misJust.length} icon={BookOpen} />
          <StatCard label="Notificaciones" value={noLeidas} hint="Sin leer" icon={Bell} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Estado de tus documentos</CardTitle>
              <CardDescription>Distribucion por estado de revision</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
                    {data.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mi titulacion</CardTitle>
              <CardDescription>Tema asignado por la secretaria</CardDescription>
            </CardHeader>
            <CardContent>
              {miTit ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">{miTit.tema}</p>
                  <p className="text-xs text-muted-foreground">{miTit.descripcion}</p>
                  <p className="text-xs">
                    Tutor:{" "}
                    <span className="font-medium">
                      {usuarios.find((u) => u.id === miTit.docente_id)?.nombres}{" "}
                      {usuarios.find((u) => u.id === miTit.docente_id)?.apellidos}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aun no se te ha asignado tema de titulacion.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (user.rol === "docente") {
    const misSil = silabos.filter((s) => s.docente_id === user.id)
    const misInf = informes.filter((i) => i.docente_id === user.id)
    const misVinc = vinculacion.filter((v) => v.docente_id === user.id)
    const misProy = proyectos.filter((p) => p.docente_id === user.id)
    const misTit = titulacion.filter((t) => t.docente_id === user.id)

    const data = [
      { name: "Silabos", aprobados: misSil.filter((s) => s.estado === "aprobado").length, pendientes: misSil.filter((s) => s.estado === "pendiente").length },
      { name: "Informes", aprobados: misInf.filter((s) => s.estado === "aprobado").length, pendientes: misInf.filter((s) => s.estado === "pendiente").length },
      { name: "Vinculacion", aprobados: misVinc.filter((s) => s.estado === "aprobado").length, pendientes: misVinc.filter((s) => s.estado === "pendiente").length },
    ]

    return (
      <div className="space-y-6">
        <PageHeader
          title={`Hola, ${user.nombres.split(" ")[0]}`}
          description={`${ROLE_LABELS[user.rol]} - ${CARRERAS.find((c) => c.id === user.carrera_id)?.nombre ?? ""}`}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Silabos" value={misSil.length} icon={BookOpen} />
          <StatCard label="Informes" value={misInf.length} icon={FileText} />
          <StatCard label="Tutorias" value={misTit.length} icon={Award} />
          <StatCard
            label="Asignaciones"
            value={[user.tiene_vinculacion && "Vinc", user.tiene_investigacion && "Inv"].filter(Boolean).join(" + ") || "Ninguna"}
            icon={Handshake}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estado de mis entregas</CardTitle>
            <CardDescription>Resumen de aprobaciones por modulo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="aprobados" fill={CHART_COLORS[1]} name="Aprobados" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pendientes" fill={CHART_COLORS[2]} name="Pendientes" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user.rol === "secretaria") {
    const docsPend = documentos.filter((d) => d.estado === "pendiente").length
    const justPend = justificaciones.filter((j) => j.estado === "pendiente").length
    const silPend = silabos.filter((s) => s.estado === "pendiente").length
    const infPend = informes.filter((i) => i.estado === "pendiente").length

    return (
      <div className="space-y-6">
        <PageHeader
          title="Panel de secretaria"
          description="Items en revision agrupados por modulo. Acciona en cada seccion para aprobar o rechazar."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Documentos estudiantes" value={docsPend} hint="En revision" icon={FileText} />
          <StatCard label="Justificaciones" value={justPend} hint="En revision" icon={CheckSquare} />
          <StatCard label="Silabos" value={silPend} hint="En revision" icon={BookOpen} />
          <StatCard label="Informes" value={infPend} hint="En revision" icon={FileText} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Distribucion de revisiones pendientes</CardTitle>
            <CardDescription>Volumen por modulo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={[
                  { name: "Documentos", value: docsPend },
                  { name: "Justificaciones", value: justPend },
                  { name: "Silabos", value: silPend },
                  { name: "Informes", value: infPend },
                  { name: "Vinculacion", value: vinculacion.filter((v) => v.estado === "pendiente").length },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user.rol === "coordinador_carrera") {
    const carrera = CARRERAS.find((c) => c.id === user.carrera_id)
    const docentesCarrera = usuarios.filter((u) => u.rol === "docente" && u.carrera_id === user.carrera_id)
    const estudiantesCarrera = usuarios.filter((u) => u.rol === "estudiante" && u.carrera_id === user.carrera_id)
    const silCar = silabos.filter((s) => s.carrera_id === user.carrera_id)
    const titCar = titulacion.filter((t) => t.carrera_id === user.carrera_id)

    return (
      <div className="space-y-6">
        <PageHeader
          title="Coordinacion de carrera"
          description={`Indicadores generales de ${carrera?.nombre ?? ""}.`}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Docentes" value={docentesCarrera.length} icon={Users} />
          <StatCard label="Estudiantes" value={estudiantesCarrera.length} icon={Users} />
          <StatCard label="Silabos entregados" value={silCar.length} icon={BookOpen} />
          <StatCard label="Temas titulacion" value={titCar.length} icon={Award} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Silabos por estado</CardTitle>
            <CardDescription>Estado de revision de silabos en tu carrera</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Aprobados", value: silCar.filter((s) => s.estado === "aprobado").length },
                    { name: "Pendientes", value: silCar.filter((s) => s.estado === "pendiente").length },
                    { name: "Rechazados", value: silCar.filter((s) => s.estado === "rechazado").length },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {CHART_COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user.rol === "coordinador_investigacion") {
    const totalHitos = hitos.length
    const completados = hitos.filter((h) => h.completado).length
    return (
      <div className="space-y-6">
        <PageHeader
          title="Coordinacion de investigacion"
          description="Avance general de los proyectos de investigacion de la facultad."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Proyectos activos" value={proyectos.length} icon={Microscope} />
          <StatCard label="Total hitos" value={totalHitos} icon={CheckSquare} />
          <StatCard label="Hitos completados" value={completados} icon={BookOpen} />
          <StatCard
            label="Avance promedio"
            value={`${totalHitos ? Math.round((completados / totalHitos) * 100) : 0}%`}
            icon={Award}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Avance por proyecto</CardTitle>
            <CardDescription>Hitos completados vs pendientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={proyectos.map((p) => {
                  const proyHitos = hitos.filter((h) => h.proyecto_id === p.id)
                  return {
                    name: p.titulo.slice(0, 22) + (p.titulo.length > 22 ? "..." : ""),
                    completados: proyHitos.filter((h) => h.completado).length,
                    pendientes: proyHitos.filter((h) => !h.completado).length,
                  }
                })}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completados" stackId="a" fill={CHART_COLORS[1]} name="Completados" />
                <Bar dataKey="pendientes" stackId="a" fill={CHART_COLORS[2]} name="Pendientes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  // SUPER ADMIN
  const data = CARRERAS.map((c) => ({
    name: c.nombre.replace("Ingenieria en ", "").replace("Ingenieria ", ""),
    estudiantes: usuarios.filter((u) => u.rol === "estudiante" && u.carrera_id === c.id).length,
    docentes: usuarios.filter((u) => u.rol === "docente" && u.carrera_id === c.id).length,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel del super administrador"
        description="Indicadores institucionales completos."
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Usuarios activos" value={usuarios.filter((u) => u.activo).length} icon={Users} />
        <StatCard label="Docentes" value={usuarios.filter((u) => u.rol === "docente").length} icon={Users} />
        <StatCard label="Estudiantes" value={usuarios.filter((u) => u.rol === "estudiante").length} icon={Users} />
        <StatCard label="Proyectos investigacion" value={proyectos.length} icon={Microscope} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribucion por carrera</CardTitle>
            <CardDescription>Estudiantes y docentes por carrera</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="estudiantes" fill={CHART_COLORS[1]} name="Estudiantes" radius={[4, 4, 0, 0]} />
                <Bar dataKey="docentes" fill={CHART_COLORS[0]} name="Docentes" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado global de entregas</CardTitle>
            <CardDescription>Silabos, informes y documentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-semibold">{silabos.length}</p>
                <p className="text-xs text-muted-foreground">Silabos</p>
                <StatusBadge estado="aprobado" className="mt-2" />
                <p className="mt-1 text-xs">{silabos.filter((s) => s.estado === "aprobado").length} aprobados</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{informes.length}</p>
                <p className="text-xs text-muted-foreground">Informes</p>
                <StatusBadge estado="pendiente" className="mt-2" />
                <p className="mt-1 text-xs">{informes.filter((i) => i.estado === "pendiente").length} en revision</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{documentos.length}</p>
                <p className="text-xs text-muted-foreground">Documentos</p>
                <StatusBadge estado="rechazado" className="mt-2" />
                <p className="mt-1 text-xs">{documentos.filter((d) => d.estado === "rechazado").length} rechazados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
