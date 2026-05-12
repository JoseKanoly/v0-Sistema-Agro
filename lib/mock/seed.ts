import type {
  DocumentoEstudiante,
  Asistencia,
  Justificacion,
  Silabo,
  InformeAsignatura,
  ReporteVinculacion,
  TemaTitulacion,
  ProyectoInvestigacion,
  HitoInvestigacion,
  FechaLimite,
  Notificacion,
} from "@/lib/types/database"
import { USUARIOS_SEED } from "./users"

const HOY = "2026-05-11"
const ESTUDIANTES = USUARIOS_SEED.filter((u) => u.rol === "estudiante")
const DOCENTES = USUARIOS_SEED.filter((u) => u.rol === "docente")
const DOCENTES_VINC = DOCENTES.filter((d) => d.tiene_vinculacion)
const DOCENTES_INV = DOCENTES.filter((d) => d.tiene_investigacion)

// === DOCUMENTOS DE ESTUDIANTES ===
// El primer estudiante tiene 5 documentos en distintos estados; los demas, algunos subidos.
export const DOCUMENTOS_SEED: DocumentoEstudiante[] = [
  // Estudiante 1 - cubre los 3 estados del semaforo
  {
    id: "doc-1",
    estudiante_id: ESTUDIANTES[0].id,
    tipo: "cedula",
    nombre_archivo: "cedula_andres_mero.pdf",
    fecha_subida: "2026-04-28",
    estado: "aprobado",
    observaciones: null,
    revisado_por: "u-secre-1",
    fecha_revision: "2026-04-29",
  },
  {
    id: "doc-2",
    estudiante_id: ESTUDIANTES[0].id,
    tipo: "matricula",
    nombre_archivo: "matricula_andres.pdf",
    fecha_subida: "2026-05-01",
    estado: "pendiente",
    observaciones: null,
    revisado_por: null,
    fecha_revision: null,
  },
  {
    id: "doc-3",
    estudiante_id: ESTUDIANTES[0].id,
    tipo: "certificado_votacion",
    nombre_archivo: "votacion_andres.pdf",
    fecha_subida: "2026-04-30",
    estado: "rechazado",
    observaciones: "El documento esta borroso, por favor escanealo de nuevo.",
    revisado_por: "u-secre-1",
    fecha_revision: "2026-05-02",
  },
  // Otros estudiantes - algunos documentos
  {
    id: "doc-4",
    estudiante_id: ESTUDIANTES[1].id,
    tipo: "cedula",
    nombre_archivo: "cedula_belen.pdf",
    fecha_subida: "2026-04-15",
    estado: "aprobado",
    observaciones: null,
    revisado_por: "u-secre-1",
    fecha_revision: "2026-04-16",
  },
  {
    id: "doc-5",
    estudiante_id: ESTUDIANTES[1].id,
    tipo: "matricula",
    nombre_archivo: "matricula_belen.pdf",
    fecha_subida: "2026-04-15",
    estado: "aprobado",
    observaciones: null,
    revisado_por: "u-secre-1",
    fecha_revision: "2026-04-16",
  },
  {
    id: "doc-6",
    estudiante_id: ESTUDIANTES[2].id,
    tipo: "cedula",
    nombre_archivo: "cedula_carlos.pdf",
    fecha_subida: "2026-05-08",
    estado: "pendiente",
    observaciones: null,
    revisado_por: null,
    fecha_revision: null,
  },
  {
    id: "doc-7",
    estudiante_id: ESTUDIANTES[7].id,
    tipo: "foto_carnet",
    nombre_archivo: "foto_helen.jpg",
    fecha_subida: "2026-05-03",
    estado: "rechazado",
    observaciones: "Fondo incorrecto, debe ser blanco.",
    revisado_por: "u-secre-2",
    fecha_revision: "2026-05-04",
  },
  {
    id: "doc-8",
    estudiante_id: ESTUDIANTES[14].id,
    tipo: "certificado_medico",
    nombre_archivo: "medico_omar.pdf",
    fecha_subida: "2026-05-07",
    estado: "pendiente",
    observaciones: null,
    revisado_por: null,
    fecha_revision: null,
  },
]

// === ASISTENCIAS (faltas registradas para el estudiante 1) ===
export const ASISTENCIAS_SEED: Asistencia[] = [
  {
    id: "as-1",
    estudiante_id: ESTUDIANTES[0].id,
    materia: "Suelos y fertilidad",
    fecha: "2026-04-22",
    horas_clase: 4,
    asistio: false,
  },
  {
    id: "as-2",
    estudiante_id: ESTUDIANTES[0].id,
    materia: "Sanidad animal",
    fecha: "2026-04-29",
    horas_clase: 2,
    asistio: false,
  },
  {
    id: "as-3",
    estudiante_id: ESTUDIANTES[0].id,
    materia: "Cultivos tropicales",
    fecha: "2026-05-06",
    horas_clase: 3,
    asistio: false,
  },
  {
    id: "as-4",
    estudiante_id: ESTUDIANTES[1].id,
    materia: "Suelos y fertilidad",
    fecha: "2026-04-22",
    horas_clase: 4,
    asistio: false,
  },
  {
    id: "as-5",
    estudiante_id: ESTUDIANTES[7].id,
    materia: "Marketing agroalimentario",
    fecha: "2026-05-04",
    horas_clase: 3,
    asistio: false,
  },
]

// === JUSTIFICACIONES ===
export const JUSTIFICACIONES_SEED: Justificacion[] = [
  {
    id: "jus-1",
    solicitante_id: ESTUDIANTES[0].id,
    rol_solicitante: "estudiante",
    fecha_inicio: "2026-04-22",
    fecha_fin: "2026-04-22",
    materia: "Suelos y fertilidad",
    horas_justificadas: 4,
    motivo: "Cita medica programada en hospital regional.",
    tipo: "enfermedad",
    archivo_adjunto: "certificado_medico.pdf",
    estado: "aprobado",
    observaciones: null,
    revisado_por: "u-secre-1",
    fecha_solicitud: "2026-04-23",
    fecha_revision: "2026-04-24",
  },
  {
    id: "jus-2",
    solicitante_id: ESTUDIANTES[0].id,
    rol_solicitante: "estudiante",
    fecha_inicio: "2026-04-29",
    fecha_fin: "2026-04-29",
    materia: "Sanidad animal",
    horas_justificadas: 2,
    motivo: "Calamidad domestica en la familia.",
    tipo: "calamidad_domestica",
    archivo_adjunto: "acta_defuncion.pdf",
    estado: "pendiente",
    observaciones: null,
    revisado_por: null,
    fecha_solicitud: "2026-04-30",
    fecha_revision: null,
  },
  {
    id: "jus-3",
    solicitante_id: ESTUDIANTES[1].id,
    rol_solicitante: "estudiante",
    fecha_inicio: "2026-04-22",
    fecha_fin: "2026-04-22",
    materia: "Suelos y fertilidad",
    horas_justificadas: 4,
    motivo: "Viaje academico a feria agropecuaria.",
    tipo: "viaje_academico",
    archivo_adjunto: null,
    estado: "rechazado",
    observaciones: "Faltan documentos de soporte del viaje.",
    revisado_por: "u-secre-2",
    fecha_solicitud: "2026-04-23",
    fecha_revision: "2026-04-25",
  },
  {
    id: "jus-4",
    solicitante_id: DOCENTES[0].id,
    rol_solicitante: "docente",
    fecha_inicio: "2026-05-05",
    fecha_fin: "2026-05-05",
    materia: "Suelos y fertilidad",
    horas_justificadas: 4,
    motivo: "Participacion en congreso nacional de agricultura.",
    tipo: "viaje_academico",
    archivo_adjunto: "invitacion_congreso.pdf",
    estado: "aprobado",
    observaciones: null,
    revisado_por: "u-secre-1",
    fecha_solicitud: "2026-04-28",
    fecha_revision: "2026-04-29",
  },
  {
    id: "jus-5",
    solicitante_id: DOCENTES[3].id,
    rol_solicitante: "docente",
    fecha_inicio: "2026-05-08",
    fecha_fin: "2026-05-08",
    materia: "Cultivos tropicales",
    horas_justificadas: 3,
    motivo: "Quebranto de salud.",
    tipo: "enfermedad",
    archivo_adjunto: "certificado_medico_doc.pdf",
    estado: "pendiente",
    observaciones: null,
    revisado_por: null,
    fecha_solicitud: "2026-05-09",
    fecha_revision: null,
  },
]

// === SILABOS ===
const MATERIAS_POR_CARRERA: Record<string, string[]> = {
  agropecuaria: ["Suelos y fertilidad", "Sanidad animal", "Cultivos tropicales", "Botanica general"],
  agronegocios: ["Marketing agroalimentario", "Comercio internacional", "Finanzas rurales"],
  agroindustria: ["Procesos industriales", "Microbiologia de alimentos", "Control de calidad"],
}

export const SILABOS_SEED: Silabo[] = DOCENTES.flatMap((d, i) => {
  const materias = MATERIAS_POR_CARRERA[d.carrera_id ?? "agropecuaria"]
  const materia = materias[i % materias.length]
  const estados: Array<"aprobado" | "pendiente" | "rechazado"> = ["aprobado", "pendiente", "rechazado"]
  const estado = estados[i % 3]
  return [
    {
      id: `sil-${i + 1}`,
      docente_id: d.id,
      carrera_id: d.carrera_id!,
      materia,
      archivo: `silabo_${materia.toLowerCase().replace(/\s/g, "_")}.pdf`,
      fecha_subida: `2026-04-${(15 + i).toString().padStart(2, "0")}`,
      fecha_limite: "2026-05-20",
      estado,
      observaciones: estado === "rechazado" ? "Revisar competencias del perfil de egreso." : null,
    },
  ]
})

// === INFORMES DE ASIGNATURA ===
export const INFORMES_SEED: InformeAsignatura[] = DOCENTES.slice(0, 10).map((d, i) => {
  const materias = MATERIAS_POR_CARRERA[d.carrera_id ?? "agropecuaria"]
  const materia = materias[i % materias.length]
  const estados: Array<"aprobado" | "pendiente" | "rechazado"> = ["aprobado", "pendiente", "aprobado", "rechazado", "aprobado"]
  return {
    id: `inf-${i + 1}`,
    docente_id: d.id,
    carrera_id: d.carrera_id!,
    materia,
    periodo: "2026-1",
    archivo: `informe_${materia.toLowerCase().replace(/\s/g, "_")}.pdf`,
    fecha_subida: `2026-05-${(1 + i).toString().padStart(2, "0")}`,
    fecha_limite: "2026-05-30",
    estado: estados[i % estados.length],
    observaciones: null,
  }
})

// === VINCULACION ===
export const VINCULACION_SEED: ReporteVinculacion[] = DOCENTES_VINC.flatMap((d, i) => [
  {
    id: `vin-m-${i}-1`,
    docente_id: d.id,
    tipo: "mensual" as const,
    mes: "Marzo 2026",
    titulo: "Reporte mensual de practicas - Marzo",
    archivo: "reporte_marzo.pdf",
    fecha_subida: "2026-04-05",
    fecha_limite: "2026-04-10",
    estado: "aprobado" as const,
    observaciones: null,
  },
  {
    id: `vin-m-${i}-2`,
    docente_id: d.id,
    tipo: "mensual" as const,
    mes: "Abril 2026",
    titulo: "Reporte mensual de practicas - Abril",
    archivo: "reporte_abril.pdf",
    fecha_subida: "2026-05-08",
    fecha_limite: "2026-05-10",
    estado: i % 2 === 0 ? ("pendiente" as const) : ("aprobado" as const),
    observaciones: null,
  },
])

// === TITULACION ===
export const TITULACION_SEED: TemaTitulacion[] = [
  {
    id: "tit-1",
    docente_id: DOCENTES[0].id,
    estudiante_id: ESTUDIANTES[0].id,
    carrera_id: "agropecuaria",
    tema: "Evaluacion del rendimiento de variedades de cacao en clima costero",
    descripcion: "Analisis comparativo de tres variedades de cacao bajo condiciones edafoclimaticas de Manabi.",
    fecha_asignacion: "2026-03-10",
    estado: "en_desarrollo",
  },
  {
    id: "tit-2",
    docente_id: DOCENTES[1].id,
    estudiante_id: ESTUDIANTES[1].id,
    carrera_id: "agropecuaria",
    tema: "Manejo integrado de plagas en cultivos de banano",
    descripcion: "Estrategias biologicas y quimicas para el control de Sigatoka negra.",
    fecha_asignacion: "2026-03-15",
    estado: "en_desarrollo",
  },
  {
    id: "tit-3",
    docente_id: DOCENTES[5].id,
    estudiante_id: ESTUDIANTES[7].id,
    carrera_id: "agronegocios",
    tema: "Modelo de negocio para exportacion de cafe especial",
    descripcion: "Estudio de mercado y plan financiero para cafe de origen.",
    fecha_asignacion: "2026-02-20",
    estado: "en_desarrollo",
  },
  {
    id: "tit-4",
    docente_id: DOCENTES[10].id,
    estudiante_id: ESTUDIANTES[14].id,
    carrera_id: "agroindustria",
    tema: "Aprovechamiento de subproductos de la industria del cacao",
    descripcion: "Desarrollo de prototipos a partir de cascarilla y mucilago.",
    fecha_asignacion: "2026-01-30",
    estado: "aprobado",
  },
]

// === INVESTIGACION ===
export const PROYECTOS_INV_SEED: ProyectoInvestigacion[] = DOCENTES_INV.map((d, i) => ({
  id: `proy-${i + 1}`,
  docente_id: d.id,
  carrera_id: d.carrera_id!,
  titulo: [
    "Resistencia a sequia en maiz nativo manabita",
    "Biofertilizantes a partir de residuos avicolas",
    "Trazabilidad blockchain en cadenas agroindustriales",
    "Indice de calidad de suelos en zonas de proteccion",
    "Bioplasticos a base de almidon de yuca",
  ][i] || `Proyecto de investigacion ${i + 1}`,
  descripcion: "Proyecto de investigacion aplicada con financiamiento institucional.",
  total_hitos: 4,
  fecha_inicio: "2026-01-15",
}))

export const HITOS_INV_SEED: HitoInvestigacion[] = PROYECTOS_INV_SEED.flatMap((p) =>
  [1, 2, 3, 4].map((n) => ({
    id: `hito-${p.id}-${n}`,
    proyecto_id: p.id,
    numero: n,
    titulo: `Hito ${n}: ${["Diseno del estudio", "Recoleccion de datos", "Analisis preliminar", "Informe final"][n - 1]}`,
    descripcion: "Descripcion detallada del avance esperado.",
    archivo: n <= 2 ? `hito_${n}.pdf` : null,
    fecha_subida: n <= 2 ? `2026-0${n + 1}-15` : null,
    completado: n <= 2,
  })),
)

// === FECHAS LIMITE ===
export const FECHAS_LIMITE_SEED: FechaLimite[] = [
  {
    id: "fl-1",
    tipo: "silabo",
    descripcion: "Entrega de silabos del periodo 2026-1",
    fecha_limite: "2026-05-20",
    carrera_id: null,
  },
  {
    id: "fl-2",
    tipo: "informe",
    descripcion: "Informes finales de asignatura",
    fecha_limite: "2026-05-30",
    carrera_id: null,
  },
  {
    id: "fl-3",
    tipo: "vinculacion_mensual",
    descripcion: "Reporte mensual de vinculacion - Mayo",
    fecha_limite: "2026-06-05",
    carrera_id: null,
  },
  {
    id: "fl-4",
    tipo: "vinculacion_final",
    descripcion: "Reporte final del proyecto de vinculacion",
    fecha_limite: "2026-07-15",
    carrera_id: null,
  },
  {
    id: "fl-5",
    tipo: "documento_estudiante",
    descripcion: "Documentos de matricula estudiantes",
    fecha_limite: "2026-05-25",
    carrera_id: null,
  },
]

// === NOTIFICACIONES ===
export const NOTIFICACIONES_SEED: Notificacion[] = [
  {
    id: "not-1",
    destinatario_id: ESTUDIANTES[0].id,
    titulo: "Documento aprobado",
    mensaje: "Tu copia de cedula fue aprobada por secretaria.",
    tipo: "exito",
    leida: false,
    fecha: "2026-04-29",
  },
  {
    id: "not-2",
    destinatario_id: ESTUDIANTES[0].id,
    titulo: "Documento rechazado",
    mensaje: "Tu certificado de votacion fue rechazado: documento borroso. Por favor subelo de nuevo.",
    tipo: "error",
    leida: false,
    fecha: "2026-05-02",
  },
  {
    id: "not-3",
    destinatario_id: ESTUDIANTES[0].id,
    titulo: "Justificacion aprobada",
    mensaje: "Tu justificacion del 22/04 en Suelos y fertilidad fue aprobada.",
    tipo: "exito",
    leida: true,
    fecha: "2026-04-24",
  },
  {
    id: "not-4",
    destinatario_id: DOCENTES[0].id,
    titulo: "Silabo aprobado",
    mensaje: "Tu silabo de Suelos y fertilidad fue aprobado.",
    tipo: "exito",
    leida: true,
    fecha: "2026-04-20",
  },
  {
    id: "not-5",
    destinatario_id: DOCENTES[0].id,
    titulo: "Recordatorio: fecha limite",
    mensaje: "El informe final vence el 30 de mayo.",
    tipo: "advertencia",
    leida: false,
    fecha: HOY,
  },
]
