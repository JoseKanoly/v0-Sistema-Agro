// Database types for SISPAA
export type UserRole = 
  | 'super_admin' 
  | 'coordinador_carrera' 
  | 'coordinador_investigacion' 
  | 'docente' 
  | 'secretaria' 
  | 'estudiante'

export type DocumentStatus = 'pendiente' | 'aprobado' | 'rechazado'
export type InvestigacionStatus = 'en_progreso' | 'completado' | 'pausado'
export type VinculacionStatus = 'pendiente' | 'en_ejecucion' | 'ejecutada'
export type TitulacionStatus = 'en_desarrollo' | 'en_revision' | 'aprobado' | 'graduado'

export interface PeriodoAcademico {
  id: string
  codigo: string
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  activo: boolean
  created_at: string
}

export interface Carrera {
  id: string
  nombre: string
  codigo: string
  descripcion: string | null
  activa: boolean
  created_at: string
}

export interface Materia {
  id: string
  nombre: string
  codigo: string
  carrera_id: string
  semestre: number | null
  creditos: number
  activa: boolean
  carrera?: Carrera
}

export interface Role {
  id: string
  nombre: UserRole
  descripcion: string | null
}

export interface Permiso {
  id: string
  nombre: string
  modulo: string
  descripcion: string | null
}

export interface Profile {
  id: string
  cedula: string | null
  nombres: string
  apellidos: string
  email: string
  telefono: string | null
  rol_id: string | null
  carrera_id: string | null
  avatar_url: string | null
  activo: boolean
  created_at: string
  rol?: Role
  carrera?: Carrera
}

export interface DocumentoEstudiante {
  id: string
  estudiante_id: string
  periodo_id: string
  tipo: 'cedula' | 'matricula' | 'certificado' | 'foto' | 'otro'
  nombre_archivo: string
  archivo_url: string
  estado: DocumentStatus
  observaciones: string | null
  revisado_por: string | null
  fecha_revision: string | null
  created_at: string
  estudiante?: Profile
  periodo?: PeriodoAcademico
}

export interface FaltaEstudiante {
  id: string
  estudiante_id: string
  periodo_id: string
  materia_id: string
  fecha_inicio: string
  fecha_fin: string
  horas_justificadas: number
  motivo: string
  tipo_falta: 'calamidad_domestica' | 'enfermedad' | 'viaje' | 'otro'
  archivo_justificacion_url: string | null
  estado: DocumentStatus
  observaciones: string | null
  revisado_por: string | null
  created_at: string
  estudiante?: Profile
  materia?: Materia
}

export interface Silabo {
  id: string
  docente_id: string
  materia_id: string
  periodo_id: string
  archivo_url: string
  nombre_archivo: string
  estado: DocumentStatus
  fecha_limite: string | null
  observaciones: string | null
  revisado_por: string | null
  created_at: string
  docente?: Profile
  materia?: Materia
  periodo?: PeriodoAcademico
}

export interface InformeDocente {
  id: string
  docente_id: string
  materia_id: string
  periodo_id: string
  tipo: 'mensual' | 'parcial' | 'final'
  archivo_url: string
  nombre_archivo: string
  estado: DocumentStatus
  fecha_limite: string | null
  observaciones: string | null
  created_at: string
  docente?: Profile
  materia?: Materia
}

export interface Investigacion {
  id: string
  titulo: string
  descripcion: string | null
  docente_id: string
  periodo_id: string
  carrera_id: string
  fecha_inicio: string | null
  fecha_fin: string | null
  estado: InvestigacionStatus
  presupuesto_asignado: number
  presupuesto_ejecutado: number
  created_at: string
  docente?: Profile
  carrera?: Carrera
  hitos?: HitoInvestigacion[]
}

export interface HitoInvestigacion {
  id: string
  investigacion_id: string
  titulo: string
  descripcion: string | null
  fecha_limite: string | null
  fecha_completado: string | null
  archivo_url: string | null
  estado: 'pendiente' | 'en_revision' | 'completado'
  porcentaje_avance: number
  observaciones: string | null
}

export interface VinculacionActividad {
  id: string
  titulo: string
  descripcion: string | null
  docente_id: string
  periodo_id: string
  carrera_id: string
  fecha_inicio: string | null
  fecha_fin: string | null
  estado: VinculacionStatus
  beneficiarios: number
  created_at: string
  docente?: Profile
  empresas?: VinculacionEmpresa[]
}

export interface VinculacionEmpresa {
  id: string
  actividad_id: string
  nombre_empresa: string
  ruc: string | null
  contacto: string | null
  telefono: string | null
  direccion: string | null
}

export interface TitulacionTema {
  id: string
  titulo: string
  descripcion: string | null
  tutor_id: string
  periodo_id: string
  carrera_id: string
  estado: TitulacionStatus
  fecha_aprobacion: string | null
  created_at: string
  tutor?: Profile
  estudiantes?: TitulacionEstudiante[]
}

export interface TitulacionEstudiante {
  id: string
  tema_id: string
  estudiante_id: string
  estado: 'en_proceso' | 'graduado'
  fecha_graduacion: string | null
  estudiante?: Profile
}

export interface PracticaLaboratorio {
  id: string
  titulo: string
  descripcion: string | null
  docente_id: string
  materia_id: string
  carrera_id: string
  periodo_id: string
  fecha: string
  ubicacion: string | null
  duracion_horas: number
  estudiantes_asistentes: number
  archivo_evidencia_url: string | null
  created_at: string
  docente?: Profile
  carrera?: Carrera
}

export interface Notificacion {
  id: string
  usuario_id: string
  titulo: string
  mensaje: string
  tipo: 'documento_aprobado' | 'documento_rechazado' | 'fecha_limite' | 'recordatorio' | 'sistema'
  leida: boolean
  enlace: string | null
  created_at: string
}

export interface FechaLimite {
  id: string
  periodo_id: string
  carrera_id: string
  tipo: 'silabo' | 'informe_mensual' | 'informe_final' | 'documento_estudiante'
  descripcion: string | null
  fecha_limite: string
  periodo?: PeriodoAcademico
  carrera?: Carrera
}

// KPI Types
export interface DashboardKPIs {
  docencia: {
    porcentaje: number
    cumplidos: number
    pendientes: number
    incumplidos: number
  }
  investigacion: {
    porcentaje: number
    proyectosActivos: number
    hitosAvanzados: number
    enRevision: number
  }
  estudiantes: {
    matriculados: number
    activos: number
    retirados: number
    faltasRegistradas: number
  }
  practicasLaboratorio: {
    total: number
    porCarrera: { carrera: string; cantidad: number }[]
  }
  vinculacion: {
    actividades: number
    ejecutadas: number
    pendientes: number
    empresasBeneficiadas: number
  }
  titulacion: {
    enProgreso: number
    temasDesarrollo: number
    graduados: number
    pendientesRevision: number
  }
}
