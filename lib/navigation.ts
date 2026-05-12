import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Calendar,
  Bell,
  User,
  Users,
  School,
  ClipboardCheck,
  Handshake,
  Award,
  Microscope,
  CalendarClock,
  Send,
  UserCheck,
  CheckSquare,
  type LucideIcon,
} from "lucide-react"
import type { UserRole, Usuario } from "@/lib/types/database"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface NavSection {
  title: string
  items: NavItem[]
}

// Construye el menu segun el usuario (incluye banderas tiene_vinculacion / tiene_investigacion)
export function buildNavigation(user: Usuario | null): NavSection[] {
  if (!user) return []

  const sections: NavSection[] = []
  const rol = user.rol

  // ---- Principal (todos) ----
  sections.push({
    title: "Principal",
    items: [
      { title: "Vista general", url: "/dashboard", icon: LayoutDashboard },
      { title: "Notificaciones", url: "/dashboard/notificaciones", icon: Bell },
      { title: "Mi perfil", url: "/dashboard/perfil", icon: User },
    ],
  })

  // ---- ESTUDIANTE ----
  if (rol === "estudiante") {
    sections.push({
      title: "Mi gestion",
      items: [
        { title: "Mis documentos", url: "/dashboard/mis-documentos", icon: FileText },
        { title: "Mis asistencias", url: "/dashboard/mis-asistencias", icon: ClipboardCheck },
        { title: "Mis justificaciones", url: "/dashboard/mis-justificaciones", icon: CheckSquare },
        { title: "Mi titulacion", url: "/dashboard/mi-titulacion", icon: Award },
      ],
    })
  }

  // ---- DOCENTE ----
  if (rol === "docente") {
    const items: NavItem[] = [
      { title: "Mis silabos", url: "/dashboard/silabos", icon: BookOpen },
      { title: "Mis informes", url: "/dashboard/informes", icon: FileText },
      { title: "Justificar falta", url: "/dashboard/mis-justificaciones", icon: CheckSquare },
      { title: "Mis temas de titulacion", url: "/dashboard/titulacion", icon: Award },
    ]
    if (user.tiene_vinculacion) {
      items.push({ title: "Vinculacion", url: "/dashboard/vinculacion", icon: Handshake })
    }
    if (user.tiene_investigacion) {
      items.push({ title: "Investigacion", url: "/dashboard/investigacion", icon: Microscope })
    }
    sections.push({ title: "Mi gestion docente", items })
  }

  // ---- SECRETARIA ----
  if (rol === "secretaria") {
    sections.push({
      title: "Revision de estudiantes",
      items: [
        { title: "Documentos de estudiantes", url: "/dashboard/revision/documentos", icon: FileText },
        { title: "Justificaciones", url: "/dashboard/revision/justificaciones", icon: CheckSquare },
      ],
    })
    sections.push({
      title: "Revision docente",
      items: [
        { title: "Silabos", url: "/dashboard/revision/silabos", icon: BookOpen },
        { title: "Informes de asignatura", url: "/dashboard/revision/informes", icon: FileText },
        { title: "Vinculacion", url: "/dashboard/revision/vinculacion", icon: Handshake },
        { title: "Titulacion", url: "/dashboard/titulacion", icon: Award },
      ],
    })
    sections.push({
      title: "Gestion",
      items: [
        { title: "Fechas limite", url: "/dashboard/fechas-limite", icon: CalendarClock },
        { title: "Notificaciones masivas", url: "/dashboard/notificaciones-masivas", icon: Send },
        { title: "Asignaciones de docentes", url: "/dashboard/asignaciones", icon: UserCheck },
      ],
    })
  }

  // ---- COORDINADOR DE CARRERA ----
  if (rol === "coordinador_carrera") {
    sections.push({
      title: "Mi carrera",
      items: [
        { title: "Docentes", url: "/dashboard/coordinacion/docentes", icon: Users },
        { title: "Estudiantes", url: "/dashboard/coordinacion/estudiantes", icon: School },
        { title: "Silabos", url: "/dashboard/revision/silabos", icon: BookOpen },
        { title: "Informes", url: "/dashboard/revision/informes", icon: FileText },
        { title: "Titulacion", url: "/dashboard/titulacion", icon: Award },
        { title: "Vinculacion", url: "/dashboard/revision/vinculacion", icon: Handshake },
        { title: "Asignaciones", url: "/dashboard/asignaciones", icon: UserCheck },
      ],
    })
  }

  // ---- COORDINADOR DE INVESTIGACION ----
  if (rol === "coordinador_investigacion") {
    sections.push({
      title: "Investigacion",
      items: [
        { title: "Proyectos", url: "/dashboard/investigacion", icon: Microscope },
        { title: "Avance de hitos", url: "/dashboard/investigacion/avances", icon: ClipboardCheck },
      ],
    })
  }

  // ---- SUPER ADMIN ----
  if (rol === "super_admin") {
    sections.push({
      title: "Operacion",
      items: [
        { title: "Documentos estudiantes", url: "/dashboard/revision/documentos", icon: FileText },
        { title: "Justificaciones", url: "/dashboard/revision/justificaciones", icon: CheckSquare },
        { title: "Silabos", url: "/dashboard/revision/silabos", icon: BookOpen },
        { title: "Informes", url: "/dashboard/revision/informes", icon: FileText },
        { title: "Vinculacion", url: "/dashboard/revision/vinculacion", icon: Handshake },
        { title: "Titulacion", url: "/dashboard/titulacion", icon: Award },
        { title: "Investigacion", url: "/dashboard/investigacion", icon: Microscope },
      ],
    })
    sections.push({
      title: "Administracion",
      items: [
        { title: "Usuarios", url: "/dashboard/admin/usuarios", icon: Users },
        { title: "Carreras", url: "/dashboard/admin/carreras", icon: School },
        { title: "Periodos academicos", url: "/dashboard/admin/periodos", icon: Calendar },
        { title: "Asignaciones docentes", url: "/dashboard/asignaciones", icon: UserCheck },
        { title: "Fechas limite", url: "/dashboard/fechas-limite", icon: CalendarClock },
      ],
    })
  }

  return sections
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super administrador",
  coordinador_carrera: "Coordinador de carrera",
  coordinador_investigacion: "Coordinador de investigacion",
  docente: "Docente",
  secretaria: "Secretaria",
  estudiante: "Estudiante",
}

export const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  super_admin: "bg-primary text-primary-foreground",
  coordinador_carrera: "bg-chart-1/15 text-chart-1",
  coordinador_investigacion: "bg-chart-2/15 text-chart-2",
  docente: "bg-chart-3/15 text-chart-3",
  secretaria: "bg-chart-4/15 text-chart-4",
  estudiante: "bg-chart-5/15 text-chart-5",
}
