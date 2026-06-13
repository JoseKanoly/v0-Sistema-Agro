"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { signOutAction } from "@/app/actions/auth"
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, FlaskConical,
  FileText, CalendarCheck, Bell, Settings, LogOut, ChevronDown,
  ChevronRight, Building2, ClipboardList, Microscope, Link2, Trophy,
  Menu, X, UserCheck, AlertCircle, FilePlus, BarChart3, Beaker,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Rol = "super_admin" | "coordinador_carrera" | "coordinador_investigacion" | "docente" | "secretaria" | "estudiante"

interface NavItem {
  label: string
  href?: string
  icon: React.ElementType
  children?: { label: string; href: string }[]
  roles: Rol[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["super_admin", "coordinador_carrera", "coordinador_investigacion", "docente", "secretaria", "estudiante"] },

  // Super admin
  { label: "Usuarios", href: "/dashboard/admin/usuarios", icon: Users, roles: ["super_admin"] },
  { label: "Carreras", href: "/dashboard/admin/carreras", icon: Building2, roles: ["super_admin"] },
  { label: "Periodos", href: "/dashboard/admin/periodos", icon: CalendarCheck, roles: ["super_admin"] },
  { label: "Materias", href: "/dashboard/admin/materias", icon: BookOpen, roles: ["super_admin", "coordinador_carrera"] },

  // Secretaria
  {
    label: "Convocatorias", icon: CalendarCheck, roles: ["super_admin", "secretaria"],
    children: [
      { label: "Gestionar Convocatorias", href: "/dashboard/fechas-limite" },
      { label: "Notif. Masivas", href: "/dashboard/notificaciones-masivas" },
    ],
  },
  {
    label: "Revision", icon: ClipboardList, roles: ["super_admin", "secretaria", "coordinador_carrera"],
    children: [
      { label: "Documentos Est.", href: "/dashboard/revision/documentos" },
      { label: "Justificaciones", href: "/dashboard/revision/justificaciones" },
      { label: "Silabos", href: "/dashboard/revision/silabos" },
      { label: "Informes", href: "/dashboard/revision/informes" },
      { label: "Vinculacion", href: "/dashboard/revision/vinculacion" },
    ],
  },

  // Coordinador carrera
  {
    label: "Coordinacion", icon: BarChart3, roles: ["coordinador_carrera"],
    children: [
      { label: "Estadisticas", href: "/dashboard/coordinacion/estadisticas" },
      { label: "Docentes", href: "/dashboard/coordinacion/docentes" },
      { label: "Estudiantes", href: "/dashboard/coordinacion/estudiantes" },
      { label: "Matriculas", href: "/dashboard/coordinacion/matriculas" },
      { label: "Titulacion", href: "/dashboard/titulacion" },
    ],
  },

  // Investigacion
  {
    label: "Investigacion", icon: Microscope, roles: ["super_admin", "coordinador_investigacion", "docente"],
    children: [
      { label: "Proyectos", href: "/dashboard/investigacion" },
      { label: "Mis Hitos", href: "/dashboard/investigacion/avances" },
    ],
  },

  // Vinculacion
  {
    label: "Vinculacion", icon: Link2, roles: ["super_admin", "secretaria", "coordinador_carrera", "docente"],
    children: [
      { label: "Proyectos", href: "/dashboard/vinculacion" },
    ],
  },

  // Titulacion
  { label: "Titulacion", href: "/dashboard/titulacion", icon: Trophy, roles: ["super_admin", "coordinador_investigacion"] },
  { label: "Mi Titulacion", href: "/dashboard/mi-titulacion", icon: Trophy, roles: ["estudiante"] },

  // Docente
  { label: "Mis Silabos", href: "/dashboard/silabos", icon: FilePlus, roles: ["docente"] },
  { label: "Mis Informes", href: "/dashboard/informes", icon: FileText, roles: ["docente"] },

  // Estudiante
  { label: "Mis Documentos", href: "/dashboard/mis-documentos", icon: FileText, roles: ["estudiante"] },
  { label: "Mis Asistencias", href: "/dashboard/mis-asistencias", icon: UserCheck, roles: ["estudiante"] },
  { label: "Justificaciones", href: "/dashboard/mis-justificaciones", icon: AlertCircle, roles: ["estudiante", "docente"] },

  // Laboratorio
  {
    label: "Laboratorios", icon: FlaskConical, roles: ["super_admin", "secretaria", "coordinador_carrera", "docente"],
    children: [
      { label: "Laboratorios", href: "/dashboard/laboratorios" },
      { label: "Equipos", href: "/dashboard/laboratorios/equipos" },
      { label: "Reactivos", href: "/dashboard/laboratorios/reactivos" },
      { label: "Practicas", href: "/dashboard/laboratorios/practicas" },
    ],
  },

  // Notificaciones
  { label: "Notificaciones", href: "/dashboard/notificaciones", icon: Bell, roles: ["super_admin", "coordinador_carrera", "coordinador_investigacion", "docente", "secretaria", "estudiante"] },
  { label: "Mi Perfil", href: "/dashboard/perfil", icon: Settings, roles: ["super_admin", "coordinador_carrera", "coordinador_investigacion", "docente", "secretaria", "estudiante"] },
]

interface SidebarProps {
  rol: Rol
  userName: string
  userEmail: string
}

export function Sidebar({ rol, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string[]>([])

  const visible = navItems.filter((item) => item.roles.includes(rol))

  const toggleGroup = (label: string) => {
    setExpanded((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label])
  }

  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href))

  const handleSignOut = async () => {
    await signOutAction()
    router.push("/auth/login")
    router.refresh()
  }

  const roleLabel: Record<Rol, string> = {
    super_admin: "Super Admin",
    coordinador_carrera: "Coord. Carrera",
    coordinador_investigacion: "Coord. Investigacion",
    docente: "Docente",
    secretaria: "Secretaria",
    estudiante: "Estudiante",
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0f2419]">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[#1e3a2a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#22c55e] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-[#0f2419]" />
          </div>
          <div className="min-w-0">
            <p className="text-[#d1fae5] font-bold text-sm leading-tight truncate">SISPAA</p>
            <p className="text-[#6b9a7f] text-xs truncate">Gestion Academica</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-[#1e3a2a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#22c55e] text-xs font-bold">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[#d1fae5] text-xs font-semibold truncate">{userName}</p>
            <span className="text-[10px] bg-[#22c55e]/20 text-[#22c55e] px-1.5 py-0.5 rounded-full font-medium">{roleLabel[rol]}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {visible.map((item) => {
          const Icon = item.icon
          if (item.children) {
            const isExpanded = expanded.includes(item.label)
            const hasActive = item.children.some((c) => isActive(c.href))
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                    hasActive ? "bg-[#1a3d27] text-[#d1fae5]" : "text-[#6b9a7f] hover:bg-[#1a3d27] hover:text-[#d1fae5]"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {isExpanded && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-[#1e3a2a] pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block px-3 py-1.5 rounded-lg text-xs transition-colors",
                          isActive(child.href)
                            ? "bg-[#22c55e] text-[#0f2419] font-semibold"
                            : "text-[#6b9a7f] hover:bg-[#1a3d27] hover:text-[#d1fae5]"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive(item.href!)
                  ? "bg-[#22c55e] text-[#0f2419] font-semibold"
                  : "text-[#6b9a7f] hover:bg-[#1a3d27] hover:text-[#d1fae5]"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-[#1e3a2a]">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#6b9a7f] hover:bg-red-900/30 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Cerrar sesion</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 p-2 bg-[#0f2419] rounded-lg text-[#d1fae5]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-64 flex flex-col z-50">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#1a3d27] text-[#d1fae5] z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
