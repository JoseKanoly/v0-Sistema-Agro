import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  BookOpen, 
  FlaskConical, 
  Users, 
  UserCheck,
  UserX,
  AlertCircle,
  FileCheck,
  Microscope,
  ClipboardList,
  Handshake,
  Building2,
  Award,
  BookMarked,
  Settings,
  Calendar,
  School,
  LucideIcon
} from 'lucide-react'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  permission?: string
  children?: NavItem[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}

// Navigation configuration based on permissions
export const navigationConfig: NavSection[] = [
  {
    title: 'Platform',
    items: [
      {
        title: 'Vista general',
        url: '/dashboard',
        icon: LayoutDashboard,
        permission: 'dashboard.view'
      },
      {
        title: 'Docencia',
        url: '/dashboard/docencia',
        icon: GraduationCap,
        permission: 'silabos.view',
        children: [
          {
            title: 'Informes de asignatura',
            url: '/dashboard/docencia/informes',
            icon: FileText,
            permission: 'informes.view'
          },
          {
            title: 'Informes de silabo',
            url: '/dashboard/docencia/silabos',
            icon: BookOpen,
            permission: 'silabos.view'
          }
        ]
      },
      {
        title: 'Investigacion',
        url: '/dashboard/investigacion',
        icon: Microscope,
        permission: 'investigacion.view',
        children: [
          {
            title: 'Informes',
            url: '/dashboard/investigacion/informes',
            icon: ClipboardList,
            permission: 'investigacion.view'
          }
        ]
      },
      {
        title: 'Estudiantes',
        url: '/dashboard/estudiantes',
        icon: Users,
        permission: 'estudiantes.view',
        children: [
          {
            title: 'Estudiantes matriculados',
            url: '/dashboard/estudiantes/matriculados',
            icon: UserCheck,
            permission: 'estudiantes.view'
          },
          {
            title: 'Estudiantes activos',
            url: '/dashboard/estudiantes/activos',
            icon: Users,
            permission: 'estudiantes.view'
          },
          {
            title: 'Estudiantes retirados',
            url: '/dashboard/estudiantes/retirados',
            icon: UserX,
            permission: 'estudiantes.view'
          },
          {
            title: 'Faltas',
            url: '/dashboard/estudiantes/faltas',
            icon: AlertCircle,
            permission: 'estudiantes.faltas'
          },
          {
            title: 'Justificaciones de faltas',
            url: '/dashboard/estudiantes/justificaciones',
            icon: FileCheck,
            permission: 'estudiantes.faltas'
          }
        ]
      },
      {
        title: 'Practicas de Laboratorio',
        url: '/dashboard/laboratorio',
        icon: FlaskConical,
        permission: 'laboratorio.view'
      },
      {
        title: 'Vinculacion',
        url: '/dashboard/vinculacion',
        icon: Handshake,
        permission: 'vinculacion.view',
        children: [
          {
            title: 'Lideres de vinculacion',
            url: '/dashboard/vinculacion/lideres',
            icon: Building2,
            permission: 'vinculacion.view'
          }
        ]
      },
      {
        title: 'Titulacion',
        url: '/dashboard/titulacion',
        icon: Award,
        permission: 'titulacion.view',
        children: [
          {
            title: 'Temas en desarrollo',
            url: '/dashboard/titulacion/temas',
            icon: BookMarked,
            permission: 'titulacion.view'
          }
        ]
      }
    ]
  },
  {
    title: 'Administracion',
    items: [
      {
        title: 'Usuarios',
        url: '/dashboard/admin/usuarios',
        icon: Users,
        permission: 'users.manage'
      },
      {
        title: 'Carreras',
        url: '/dashboard/admin/carreras',
        icon: School,
        permission: 'careers.manage'
      },
      {
        title: 'Periodos',
        url: '/dashboard/admin/periodos',
        icon: Calendar,
        permission: 'periods.manage'
      },
      {
        title: 'Configuracion',
        url: '/dashboard/admin/configuracion',
        icon: Settings,
        permission: 'settings.manage'
      }
    ]
  }
]

// Filter navigation based on user permissions
export function filterNavigation(
  config: NavSection[], 
  permissions: string[], 
  isSuperAdmin: boolean
): NavSection[] {
  if (isSuperAdmin) return config

  return config.map(section => ({
    ...section,
    items: section.items
      .filter(item => !item.permission || permissions.includes(item.permission))
      .map(item => ({
        ...item,
        children: item.children?.filter(
          child => !child.permission || permissions.includes(child.permission)
        )
      }))
  })).filter(section => section.items.length > 0)
}
