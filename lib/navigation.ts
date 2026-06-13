import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarRange,
  BookOpen,
  GraduationCap,
  FlaskConical,
  Handshake,
  Award,
  FileText,
  Microscope,
  type LucideIcon,
} from "lucide-react"
import type { Rol } from "@/lib/types/database"

export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  label: string
  icon: LucideIcon
  href?: string
  children?: NavChild[]
  roles: Rol[]
}

const ALL: Rol[] = ["SUPER_ADMIN", "ADMINISTRADOR", "COORDINADOR", "DOCENTE", "SECRETARIA", "ESTUDIANTE"]
const ADMINS: Rol[] = ["SUPER_ADMIN", "ADMINISTRADOR"]
const GESTION: Rol[] = ["SUPER_ADMIN", "ADMINISTRADOR", "COORDINADOR"]

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", roles: ALL },

  {
    label: "Docencia",
    icon: BookOpen,
    roles: [...GESTION, "DOCENTE", "SECRETARIA"],
    children: [
      { label: "Informes de asignatura", href: "/dashboard/docencia" },
      { label: "Sílabos", href: "/dashboard/docencia/silabos" },
    ],
  },
  {
    label: "Investigación",
    icon: Microscope,
    roles: [...GESTION, "DOCENTE"],
    children: [
      { label: "Informes de investigación", href: "/dashboard/investigacion" },
      { label: "Líneas de investigación", href: "/dashboard/investigacion/lineas" },
    ],
  },
  {
    label: "Estudiantes",
    icon: GraduationCap,
    roles: [...GESTION, "DOCENTE", "SECRETARIA"],
    children: [
      { label: "Panel general", href: "/dashboard/estudiantes" },
      { label: "Matriculados", href: "/dashboard/estudiantes/matriculados" },
      { label: "Faltas", href: "/dashboard/estudiantes/faltas" },
      { label: "Justificaciones", href: "/dashboard/estudiantes/justificaciones" },
    ],
  },
  {
    label: "Laboratorio",
    icon: FlaskConical,
    roles: [...GESTION, "DOCENTE", "SECRETARIA"],
    children: [
      { label: "Dashboard", href: "/dashboard/laboratorio" },
      { label: "Registrar práctica", href: "/dashboard/laboratorio/registrar" },
      { label: "Prácticas", href: "/dashboard/laboratorio/practicas" },
      { label: "Por carrera", href: "/dashboard/laboratorio/por-carrera" },
      { label: "Ubicaciones", href: "/dashboard/laboratorio/ubicaciones" },
      { label: "Equipos", href: "/dashboard/laboratorio/equipos" },
      { label: "Reactivos", href: "/dashboard/laboratorio/reactivos" },
      { label: "Asistencia", href: "/dashboard/laboratorio/asistencia" },
    ],
  },
  {
    label: "Vinculación",
    icon: Handshake,
    roles: [...GESTION, "DOCENTE"],
    children: [
      { label: "Líderes", href: "/dashboard/vinculacion" },
      { label: "Actividades", href: "/dashboard/vinculacion/actividades" },
      { label: "Empresas", href: "/dashboard/vinculacion/empresas" },
    ],
  },
  {
    label: "Titulación",
    icon: Award,
    roles: [...GESTION, "DOCENTE", "ESTUDIANTE"],
    children: [
      { label: "Temas", href: "/dashboard/titulacion" },
      { label: "En proceso", href: "/dashboard/titulacion/en-proceso" },
      { label: "Titulados", href: "/dashboard/titulacion/titulados" },
    ],
  },

  { label: "Usuarios", icon: Users, href: "/dashboard/usuarios", roles: ADMINS },
  { label: "Carreras", icon: Building2, href: "/dashboard/carreras", roles: GESTION },
  { label: "Materias", icon: FileText, href: "/dashboard/materias", roles: GESTION },
  { label: "Periodos", icon: CalendarRange, href: "/dashboard/periodos", roles: ADMINS },
]

export const ROLE_LABELS: Record<Rol, string> = {
  SUPER_ADMIN: "Super Administrador",
  ADMINISTRADOR: "Administrador",
  COORDINADOR: "Coordinador",
  DOCENTE: "Docente",
  SECRETARIA: "Secretaría",
  ESTUDIANTE: "Estudiante",
}

export function navForRole(rol: Rol): NavItem[] {
  return navItems
    .filter((item) => item.roles.includes(rol))
    .map((item) => ({ ...item }))
}
