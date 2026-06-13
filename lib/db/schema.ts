import {
  pgTable,
  text,
  boolean,
  timestamp,
  serial,
  integer,
  numeric,
  date,
  time,
} from "drizzle-orm/pg-core"

// ─── Better Auth tables (exact column names required) ───────────────────────
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
})

// ─── App tables ──────────────────────────────────────────────────────────────
export const perfiles = pgTable("perfiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  rol: text("rol").notNull().default("estudiante"),
  carreraId: integer("carrera_id"),
  cedula: text("cedula"),
  telefono: text("telefono"),
  direccion: text("direccion"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const carreras = pgTable("carreras", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  codigo: text("codigo").notNull().unique(),
  coordinadorId: text("coordinador_id"),
  activa: boolean("activa").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const periodos = pgTable("periodos", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  fechaInicio: date("fecha_inicio").notNull(),
  fechaFin: date("fecha_fin").notNull(),
  activo: boolean("activo").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const materias = pgTable("materias", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  codigo: text("codigo").notNull().unique(),
  creditos: integer("creditos").notNull().default(3),
  carreraId: integer("carrera_id").notNull(),
  periodoId: integer("periodo_id"),
  docenteId: text("docente_id"),
  activa: boolean("activa").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const matriculas = pgTable("matriculas", {
  id: serial("id").primaryKey(),
  estudianteId: text("estudiante_id").notNull(),
  materiaId: integer("materia_id").notNull(),
  periodoId: integer("periodo_id").notNull(),
  estado: text("estado").notNull().default("activo"),
  notaFinal: numeric("nota_final", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const faltas = pgTable("faltas", {
  id: serial("id").primaryKey(),
  estudianteId: text("estudiante_id").notNull(),
  materiaId: integer("materia_id").notNull(),
  fecha: date("fecha").notNull(),
  justificada: boolean("justificada").notNull().default(false),
  observacion: text("observacion"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const convocatorias = pgTable("convocatorias", {
  id: serial("id").primaryKey(),
  tipo: text("tipo").notNull(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  fechaApertura: date("fecha_apertura").notNull(),
  fechaLimite: date("fecha_limite").notNull(),
  audiencia: text("audiencia").notNull().default("docentes"),
  carreraId: integer("carrera_id"),
  creadaPor: text("creada_por").notNull(),
  activa: boolean("activa").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const silabos = pgTable("silabos", {
  id: serial("id").primaryKey(),
  materiaId: integer("materia_id").notNull(),
  docenteId: text("docente_id").notNull(),
  periodoId: integer("periodo_id").notNull(),
  archivonombre: text("archivo_nombre").notNull(),
  archivoUrl: text("archivo_url").notNull(),
  estado: text("estado").notNull().default("pendiente"),
  observacion: text("observacion"),
  revisadoPor: text("revisado_por"),
  revisadoAt: timestamp("revisado_at"),
  convocatoriaId: integer("convocatoria_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const informes = pgTable("informes", {
  id: serial("id").primaryKey(),
  materiaId: integer("materia_id").notNull(),
  docenteId: text("docente_id").notNull(),
  periodoId: integer("periodo_id").notNull(),
  tipo: text("tipo").notNull().default("asignatura"),
  titulo: text("titulo").notNull(),
  archivonombre: text("archivo_nombre").notNull(),
  archivoUrl: text("archivo_url").notNull(),
  estado: text("estado").notNull().default("pendiente"),
  observacion: text("observacion"),
  revisadoPor: text("revisado_por"),
  revisadoAt: timestamp("revisado_at"),
  convocatoriaId: integer("convocatoria_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const documentosEstudiante = pgTable("documentos_estudiante", {
  id: serial("id").primaryKey(),
  estudianteId: text("estudiante_id").notNull(),
  tipo: text("tipo").notNull(),
  titulo: text("titulo").notNull(),
  archivonombre: text("archivo_nombre").notNull(),
  archivoUrl: text("archivo_url").notNull(),
  estado: text("estado").notNull().default("pendiente"),
  observacion: text("observacion"),
  revisadoPor: text("revisado_por"),
  revisadoAt: timestamp("revisado_at"),
  convocatoriaId: integer("convocatoria_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const justificaciones = pgTable("justificaciones", {
  id: serial("id").primaryKey(),
  solicitanteId: text("solicitante_id").notNull(),
  tipoSolicitante: text("tipo_solicitante").notNull().default("estudiante"),
  materiaId: integer("materia_id"),
  fechaFalta: date("fecha_falta").notNull(),
  motivo: text("motivo").notNull(),
  archivonombre: text("archivo_nombre"),
  archivoUrl: text("archivo_url"),
  estado: text("estado").notNull().default("pendiente"),
  observacion: text("observacion"),
  revisadoPor: text("revisado_por"),
  revisadoAt: timestamp("revisado_at"),
  convocatoriaId: integer("convocatoria_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const notificaciones = pgTable("notificaciones", {
  id: serial("id").primaryKey(),
  destinatarioId: text("destinatario_id").notNull(),
  titulo: text("titulo").notNull(),
  mensaje: text("mensaje").notNull(),
  tipo: text("tipo").notNull().default("info"),
  leida: boolean("leida").notNull().default(false),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const proyectosVinculacion = pgTable("proyectos_vinculacion", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  docenteId: text("docente_id").notNull(),
  carreraId: integer("carrera_id").notNull(),
  periodoId: integer("periodo_id").notNull(),
  estado: text("estado").notNull().default("activo"),
  fechaInicio: date("fecha_inicio"),
  fechaFin: date("fecha_fin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const reportesVinculacion = pgTable("reportes_vinculacion", {
  id: serial("id").primaryKey(),
  proyectoId: integer("proyecto_id").notNull(),
  docenteId: text("docente_id").notNull(),
  tipo: text("tipo").notNull().default("mensual"),
  titulo: text("titulo").notNull(),
  archivonombre: text("archivo_nombre").notNull(),
  archivoUrl: text("archivo_url").notNull(),
  estado: text("estado").notNull().default("pendiente"),
  observacion: text("observacion"),
  revisadoPor: text("revisado_por"),
  revisadoAt: timestamp("revisado_at"),
  convocatoriaId: integer("convocatoria_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const proyectosInvestigacion = pgTable("proyectos_investigacion", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  investigadorPrincipalId: text("investigador_principal_id").notNull(),
  carreraId: integer("carrera_id").notNull(),
  periodoId: integer("periodo_id").notNull(),
  estado: text("estado").notNull().default("en_progreso"),
  fechaInicio: date("fecha_inicio"),
  fechaFin: date("fecha_fin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const hitosInvestigacion = pgTable("hitos_investigacion", {
  id: serial("id").primaryKey(),
  proyectoId: integer("proyecto_id").notNull(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  fechaProgramada: date("fecha_programada"),
  archivonombre: text("archivo_nombre"),
  archivoUrl: text("archivo_url"),
  estado: text("estado").notNull().default("pendiente"),
  observacion: text("observacion"),
  revisadoPor: text("revisado_por"),
  revisadoAt: timestamp("revisado_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const temasTitulacion = pgTable("temas_titulacion", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  estudianteId: text("estudiante_id").notNull(),
  tutorId: text("tutor_id"),
  carreraId: integer("carrera_id").notNull(),
  estado: text("estado").notNull().default("propuesto"),
  fechaAprobacion: date("fecha_aprobacion"),
  archivonombre: text("archivo_nombre"),
  archivoUrl: text("archivo_url"),
  observacion: text("observacion"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const laboratorios = pgTable("laboratorios", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  codigo: text("codigo").notNull().unique(),
  carreraId: integer("carrera_id").notNull(),
  capacidad: integer("capacidad").notNull().default(20),
  ubicacion: text("ubicacion"),
  activo: boolean("activo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const equiposLaboratorio = pgTable("equipos_laboratorio", {
  id: serial("id").primaryKey(),
  laboratorioId: integer("laboratorio_id").notNull(),
  nombre: text("nombre").notNull(),
  codigo: text("codigo").notNull().unique(),
  tipo: text("tipo").notNull().default("computadora"),
  estado: text("estado").notNull().default("operativo"),
  observacion: text("observacion"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const reactivos = pgTable("reactivos", {
  id: serial("id").primaryKey(),
  laboratorioId: integer("laboratorio_id").notNull(),
  nombre: text("nombre").notNull(),
  codigo: text("codigo").notNull().unique(),
  cantidad: numeric("cantidad", { precision: 10, scale: 2 }).notNull().default("0"),
  unidad: text("unidad").notNull().default("unidades"),
  stockMinimo: numeric("stock_minimo", { precision: 10, scale: 2 }).notNull().default("5"),
  estado: text("estado").notNull().default("disponible"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const practicasLaboratorio = pgTable("practicas_laboratorio", {
  id: serial("id").primaryKey(),
  laboratorioId: integer("laboratorio_id").notNull(),
  materiaId: integer("materia_id").notNull(),
  docenteId: text("docente_id").notNull(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  fecha: date("fecha").notNull(),
  horaInicio: time("hora_inicio").notNull(),
  horaFin: time("hora_fin").notNull(),
  estado: text("estado").notNull().default("programada"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const asistenciaPractica = pgTable("asistencia_practica", {
  id: serial("id").primaryKey(),
  practicaId: integer("practica_id").notNull(),
  estudianteId: text("estudiante_id").notNull(),
  asistio: boolean("asistio").notNull().default(false),
  observacion: text("observacion"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
