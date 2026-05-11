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
  FolderOpen,
  LucideIcon
} from 'lucide-react'

// Roles del sistema
export type RoleName = 'administrador' | 'coordinador' | 'docente' | 'estudiante'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  roles?: RoleName[] // Si está vacío o undefined, todos pueden ver
  children?: NavItem[]
}

export interface NavSection {
  title: string
  items: NavItem[]
  roles?: RoleName[] // Si está vacío, todos pueden ver la sección
}

// Navegación basada en roles
export const navigationConfig: NavSection[] = [
  {
    title: 'Principal',
    items: [
      {
        title: 'Vista general',
        url: '/dashboard',
        icon: LayoutDashboard
        // Todos pueden ver el dashboard
      }
    ]
  },
  {
    title: 'Docencia',
    roles: ['administrador', 'coordinador', 'docente'],
    items: [
      {
        title: 'Informes de asignatura',
        url: '/dashboard/docencia/informes',
        icon: FileText,
        roles: ['administrador', 'coordinador', 'docente']
      },
      {
        title: 'Silabos',
        url: '/dashboard/docencia/silabos',
        icon: BookOpen,
        roles: ['administrador', 'coordinador', 'docente']
      },
      {
        title: 'Portafolios',
        url: '/dashboard/docencia/portafolios',
        icon: FolderOpen,
        roles: ['administrador', 'coordinador', 'docente']
      }
    ]
  },
  {
    title: 'Investigacion',
    roles: ['administrador', 'coordinador', 'docente'],
    items: [
      {
        title: 'Informes de investigacion',
        url: '/dashboard/investigacion/informes',
        icon: Microscope,
        roles: ['administrador', 'coordinador', 'docente']
      }
    ]
  },
  {
    title: 'Estudiantes',
    roles: ['administrador', 'coordinador', 'docente'],
    items: [
      {
        title: 'Matriculados',
        url: '/dashboard/estudiantes/matriculados',
        icon: UserCheck,
        roles: ['administrador', 'coordinador', 'docente']
      },
      {
        title: 'Activos',
        url: '/dashboard/estudiantes/activos',
        icon: Users,
        roles: ['administrador', 'coordinador', 'docente']
      },
      {
        title: 'Retirados',
        url: '/dashboard/estudiantes/retirados',
        icon: UserX,
        roles: ['administrador', 'coordinador']
      },
      {
        title: 'Documentos',
        url: '/dashboard/estudiantes/documentos',
        icon: FileText,
        roles: ['administrador', 'coordinador', 'docente']
      },
      {
        title: 'Faltas',
        url: '/dashboard/estudiantes/faltas',
        icon: AlertCircle,
        roles: ['administrador', 'coordinador', 'docente']
      },
      {
        title: 'Justificaciones',
        url: '/dashboard/estudiantes/justificaciones',
        icon: FileCheck,
        roles: ['administrador', 'coordinador', 'docente']
      }
    ]
  },
  {
    title: 'Laboratorio',
    roles: ['administrador', 'coordinador', 'docente'],
    items: [
      {
        title: 'Practicas',
        url: '/dashboard/laboratorio',
        icon: FlaskConical,
        roles: ['administrador', 'coordinador', 'docente']
      }
    ]
  },
  {
    title: 'Vinculacion',
    roles: ['administrador', 'coordinador'],
    items: [
      {
        title: 'Lideres de vinculacion',
        url: '/dashboard/vinculacion/lideres',
        icon: Handshake,
        roles: ['administrador', 'coordinador']
      }
    ]
  },
  {
    title: 'Titulacion',
    roles: ['administrador', 'coordinador', 'docente'],
    items: [
      {
        title: 'Temas en desarrollo',
        url: '/dashboard/titulacion/temas',
        icon: Award,
        roles: ['administrador', 'coordinador', 'docente']
      }
    ]
  },
  {
    title: 'Administracion',
    roles: ['administrador'],
    items: [
      {
        title: 'Usuarios',
        url: '/dashboard/admin/usuarios',
        icon: Users,
        roles: ['administrador']
      },
      {
        title: 'Carreras',
        url: '/dashboard/admin/carreras',
        icon: School,
        roles: ['administrador']
      },
      {
        title: 'Periodos',
        url: '/dashboard/admin/periodos',
        icon: Calendar,
        roles: ['administrador']
      },
      {
        title: 'Configuracion',
        url: '/dashboard/admin/configuracion',
        icon: Settings,
        roles: ['administrador']
      }
    ]
  }
]

// Filtrar navegación basada en rol del usuario
export function filterNavigation(
  config: NavSection[], 
  userRole: RoleName | null
): NavSection[] {
  if (!userRole) return []
  
  // Administrador ve todo
  if (userRole === 'administrador') return config

  return config
    .filter(section => {
      // Si la sección no tiene roles definidos, todos la ven
      if (!section.roles || section.roles.length === 0) return true
      return section.roles.includes(userRole)
    })
    .map(section => ({
      ...section,
      items: section.items.filter(item => {
        // Si el item no tiene roles definidos, todos lo ven
        if (!item.roles || item.roles.length === 0) return true
        return item.roles.includes(userRole)
      })
    }))
    .filter(section => section.items.length > 0)
}
