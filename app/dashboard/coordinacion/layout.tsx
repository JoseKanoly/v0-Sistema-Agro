import React from "react"
import Link from "next/link"
import { LayoutDashboard, Users, BookOpen, BarChart3, AlertCircle } from "lucide-react"

const coordinacionMenu = [
  {
    category: "Académico",
    items: [
      { label: "Dashboard", href: "/dashboard/coordinacion/academica", icon: LayoutDashboard },
      { label: "Periodos", href: "/dashboard/coordinacion/academica/periodos", icon: BookOpen },
      { label: "Materias", href: "/dashboard/coordinacion/academica/materias", icon: BookOpen },
      { label: "Carreras", href: "/dashboard/coordinacion/academica/carreras", icon: BookOpen },
      { label: "Matriculas", href: "/dashboard/coordinacion/academica/matriculas", icon: Users },
      { label: "Calificaciones", href: "/dashboard/coordinacion/academica/calificaciones", icon: BarChart3 },
      { label: "Reportes", href: "/dashboard/coordinacion/academica/reportes", icon: BarChart3 },
    ],
  },
  {
    category: "Docentes",
    items: [
      { label: "Docentes", href: "/dashboard/coordinacion/docentes", icon: Users },
      { label: "Asistencias", href: "/dashboard/coordinacion/docentes/asistencias", icon: AlertCircle },
      { label: "Faltas", href: "/dashboard/coordinacion/docentes/faltas", icon: AlertCircle },
      { label: "Justificaciones", href: "/dashboard/coordinacion/docentes/justificaciones", icon: AlertCircle },
      { label: "Evaluaciones", href: "/dashboard/coordinacion/docentes/evaluaciones", icon: BarChart3 },
    ],
  },
  {
    category: "Estudiantes",
    items: [
      { label: "Estudiantes", href: "/dashboard/coordinacion/estudiantes", icon: Users },
      { label: "Desempeño", href: "/dashboard/coordinacion/estudiantes/desempen", icon: BarChart3 },
    ],
  },
]

export default function CoordinacionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full gap-6">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#e2e8f0] p-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-[#0f172a] mb-6">Coordinación</h2>
        {coordinacionMenu.map((group) => (
          <div key={group.category} className="mb-8">
            <h3 className="text-xs font-semibold text-[#64748b] uppercase mb-3">{group.category}</h3>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a] transition-colors text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
