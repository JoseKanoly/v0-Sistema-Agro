// SISPAA - tipos base del sistema

export type UserRole =
  | "super_admin"
  | "coordinador_carrera"
  | "coordinador_investigacion"
  | "docente"
  | "secretaria"
  | "estudiante"

export type CarreraId = "agropecuaria" | "agronegocios" | "agroindustria"

// Semaforo unificado: pendiente (amarillo), aprobado (verde), rechazado (rojo)
export type EstadoRevision = "pendiente" | "aprobado" | "rechazado"

// Tipos de documentos del estudiante (5 apartados)
export type TipoDocumentoEstudiante =
  | "cedula"
  | "matricula"
  | "certificado_votacion"
  | "foto_carnet"
  | "certificado_medico"

export const TIPOS_DOCUMENTO_ESTUDIANTE: { id: TipoDocumentoEstudiante; label: string }[] = [
  { id: "cedula", label: "Copia de cedula" },
  { id: "matricula", label: "Comprobante de matricula" },
  { id: "certificado_votacion", label: "Certificado de votacion" },
  { id: "foto_carnet", label: "Foto tamano carnet" },
  { id: "certificado_medico", label: "Certificado medico" },
]

export type TipoFalta = "calamidad_domestica" | "enfermedad" | "viaje_academico" | "trabajo" | "otro"

export const TIPOS_FALTA: { id: TipoFalta; label: string }[] = [
  { id: "calamidad_domestica", label: "Calamidad domestica" },
  { id: "enfermedad", label: "Enfermedad" },
  { id: "viaje_academico", label: "Viaje academico" },
  { id: "trabajo", label: "Trabajo" },
  { id: "otro", label: "Otro" },
]

export interface Carrera {
  id: CarreraId
  nombre: string
  descripcion: string
}

export interface Usuario {
  id: string
  cedula: string
  nombres: string
  apellidos: string
  email: string
  password: string
  rol: UserRole
  carrera_id: CarreraId | null
  // Asignaciones especiales del docente (las da secretaria/coordinador)
  tiene_vinculacion?: boolean
  tiene_investigacion?: boolean
  activo: boolean
}

export interface DocumentoEstudiante {
  id: string
  estudiante_id: string
  tipo: TipoDocumentoEstudiante
  nombre_archivo: string
  fecha_subida: string
  estado: EstadoRevision
  observaciones: string | null
  revisado_por: string | null
  fecha_revision: string | null
}

export interface Asistencia {
  id: string
  estudiante_id: string
  materia: string
  fecha: string
  horas_clase: number
  asistio: boolean
}

export interface Justificacion {
  id: string
  // Quien la solicita (estudiante o docente)
  solicitante_id: string
  rol_solicitante: "estudiante" | "docente"
  fecha_inicio: string
  fecha_fin: string
  materia: string
  horas_justificadas: number
  motivo: string
  tipo: TipoFalta
  archivo_adjunto: string | null
  estado: EstadoRevision
  observaciones: string | null
  revisado_por: string | null
  fecha_solicitud: string
  fecha_revision: string | null
}

export interface Silabo {
  id: string
  docente_id: string
  carrera_id: CarreraId
  materia: string
  archivo: string
  fecha_subida: string
  fecha_limite: string
  estado: EstadoRevision
  observaciones: string | null
}

export interface InformeAsignatura {
  id: string
  docente_id: string
  carrera_id: CarreraId
  materia: string
  periodo: string
  archivo: string
  fecha_subida: string
  fecha_limite: string
  estado: EstadoRevision
  observaciones: string | null
}

export interface ReporteVinculacion {
  id: string
  docente_id: string
  tipo: "mensual" | "final"
  mes: string | null
  titulo: string
  archivo: string
  fecha_subida: string
  fecha_limite: string
  estado: EstadoRevision
  observaciones: string | null
}

export interface TemaTitulacion {
  id: string
  docente_id: string
  estudiante_id: string
  carrera_id: CarreraId
  tema: string
  descripcion: string
  fecha_asignacion: string
  estado: "en_desarrollo" | "aprobado" | "graduado"
}

export interface ProyectoInvestigacion {
  id: string
  docente_id: string
  carrera_id: CarreraId
  titulo: string
  descripcion: string
  total_hitos: number
  fecha_inicio: string
}

export interface HitoInvestigacion {
  id: string
  proyecto_id: string
  numero: number
  titulo: string
  descripcion: string
  archivo: string | null
  fecha_subida: string | null
  completado: boolean
}

export interface FechaLimite {
  id: string
  tipo: "silabo" | "informe" | "vinculacion_mensual" | "vinculacion_final" | "documento_estudiante"
  descripcion: string
  fecha_limite: string
  carrera_id: CarreraId | null
}

export interface Notificacion {
  id: string
  destinatario_id: string
  titulo: string
  mensaje: string
  tipo: "info" | "exito" | "advertencia" | "error"
  leida: boolean
  fecha: string
}
