import type { Usuario, CarreraId } from "@/lib/types/database"

// Helper para emails
const docenteEmail = (n: string, a: string) =>
  `${n.toLowerCase().replace(/\s/g, "")}.${a.toLowerCase().split(" ")[0]}@uleam.edu.ec`
const estudianteEmail = (n: string, a: string) =>
  `${n.toLowerCase().replace(/\s/g, "")}.${a.toLowerCase().split(" ")[0]}@live.uleam.edu.ec`

// Super admin - credenciales autogeneradas del sistema
const SUPER_ADMIN: Usuario = {
  id: "u-superadmin",
  cedula: "1300000001",
  nombres: "Administrador",
  apellidos: "Del Sistema",
  email: "admin@sispaa.uleam.edu.ec",
  password: "Sispaa2026!",
  rol: "super_admin",
  carrera_id: null,
  activo: true,
}

// Coordinadores
const COORDINADORES: Usuario[] = [
  {
    id: "u-coord-carrera-1",
    cedula: "1310101010",
    nombres: "Luis Eduardo",
    apellidos: "Mero Vera",
    email: "luis.mero@uleam.edu.ec",
    password: "Sispaa2026!",
    rol: "coordinador_carrera",
    carrera_id: "agropecuaria",
    activo: true,
  },
  {
    id: "u-coord-inv-1",
    cedula: "1320202020",
    nombres: "Ana Beatriz",
    apellidos: "Cedeno Loor",
    email: "ana.cedeno@uleam.edu.ec",
    password: "Sispaa2026!",
    rol: "coordinador_investigacion",
    carrera_id: null,
    activo: true,
  },
]

// Secretarias (2)
const SECRETARIAS: Usuario[] = [
  {
    id: "u-secre-1",
    cedula: "1330303030",
    nombres: "Maria Fernanda",
    apellidos: "Zambrano Pico",
    email: "maria.zambrano@uleam.edu.ec",
    password: "Sispaa2026!",
    rol: "secretaria",
    carrera_id: null,
    activo: true,
  },
  {
    id: "u-secre-2",
    cedula: "1330303031",
    nombres: "Carmen Liliana",
    apellidos: "Velez Moreira",
    email: "carmen.velez@uleam.edu.ec",
    password: "Sispaa2026!",
    rol: "secretaria",
    carrera_id: null,
    activo: true,
  },
]

// 14 Docentes (repartidos por carrera, algunos con vinculacion/investigacion)
const DOCENTES_RAW = [
  { n: "Carlos Andres", a: "Macias Bravo", c: "agropecuaria" as CarreraId, v: true, i: false },
  { n: "Patricia Elena", a: "Intriago Ponce", c: "agropecuaria" as CarreraId, v: false, i: true },
  { n: "Roberto Javier", a: "Loor Solorzano", c: "agropecuaria" as CarreraId, v: false, i: false },
  { n: "Mercedes Alicia", a: "Vera Chavez", c: "agropecuaria" as CarreraId, v: true, i: true },
  { n: "Jorge Antonio", a: "Cevallos Garcia", c: "agropecuaria" as CarreraId, v: false, i: false },
  { n: "Diana Carolina", a: "Pico Cedeno", c: "agronegocios" as CarreraId, v: true, i: false },
  { n: "Fernando Daniel", a: "Mendoza Rivas", c: "agronegocios" as CarreraId, v: false, i: true },
  { n: "Gabriela Estefania", a: "Moreira Zambrano", c: "agronegocios" as CarreraId, v: false, i: false },
  { n: "Hugo Sebastian", a: "Bravo Quijije", c: "agronegocios" as CarreraId, v: true, i: false },
  { n: "Isabel Cristina", a: "Garcia Alava", c: "agroindustria" as CarreraId, v: false, i: true },
  { n: "Jose Miguel", a: "Andrade Vinces", c: "agroindustria" as CarreraId, v: true, i: true },
  { n: "Karla Veronica", a: "Solorzano Pinargote", c: "agroindustria" as CarreraId, v: false, i: false },
  { n: "Luis Alberto", a: "Quijije Ferrin", c: "agroindustria" as CarreraId, v: true, i: false },
  { n: "Monica Pamela", a: "Alava Cantos", c: "agroindustria" as CarreraId, v: false, i: false },
]

const DOCENTES: Usuario[] = DOCENTES_RAW.map((d, i) => ({
  id: `u-doc-${i + 1}`,
  cedula: `13404040${(i + 10).toString().padStart(2, "0")}`,
  nombres: d.n,
  apellidos: d.a,
  email: docenteEmail(d.n.split(" ")[0], d.a),
  password: "Sispaa2026!",
  rol: "docente",
  carrera_id: d.c,
  tiene_vinculacion: d.v,
  tiene_investigacion: d.i,
  activo: true,
}))

// 20 estudiantes repartidos 7 / 7 / 6
const ESTUDIANTES_RAW = [
  // Agropecuaria (7)
  { n: "Andres Felipe", a: "Mero Garcia", c: "agropecuaria" as CarreraId },
  { n: "Belen Estefania", a: "Vera Loor", c: "agropecuaria" as CarreraId },
  { n: "Carlos Daniel", a: "Cedeno Pico", c: "agropecuaria" as CarreraId },
  { n: "Daniela Sofia", a: "Zambrano Macias", c: "agropecuaria" as CarreraId },
  { n: "Eduardo Jose", a: "Bravo Intriago", c: "agropecuaria" as CarreraId },
  { n: "Fernanda Maria", a: "Quijije Vera", c: "agropecuaria" as CarreraId },
  { n: "Gabriel Antonio", a: "Loor Moreira", c: "agropecuaria" as CarreraId },
  // Agronegocios (7)
  { n: "Helen Patricia", a: "Andrade Solorzano", c: "agronegocios" as CarreraId },
  { n: "Ivan Sebastian", a: "Pico Cevallos", c: "agronegocios" as CarreraId },
  { n: "Jhuliana Carolina", a: "Moreira Ferrin", c: "agronegocios" as CarreraId },
  { n: "Kevin Alejandro", a: "Garcia Cantos", c: "agronegocios" as CarreraId },
  { n: "Lucia Belen", a: "Alava Pinargote", c: "agronegocios" as CarreraId },
  { n: "Mateo Nicolas", a: "Vinces Velez", c: "agronegocios" as CarreraId },
  { n: "Natalia Isabel", a: "Chavez Loor", c: "agronegocios" as CarreraId },
  // Agroindustria (6)
  { n: "Omar Alexander", a: "Rivas Cedeno", c: "agroindustria" as CarreraId },
  { n: "Paula Andrea", a: "Solorzano Mero", c: "agroindustria" as CarreraId },
  { n: "Ricardo Esteban", a: "Cantos Zambrano", c: "agroindustria" as CarreraId },
  { n: "Sara Valentina", a: "Ponce Bravo", c: "agroindustria" as CarreraId },
  { n: "Tomas Adrian", a: "Pinargote Pico", c: "agroindustria" as CarreraId },
  { n: "Valeria Renata", a: "Cevallos Mendoza", c: "agroindustria" as CarreraId },
]

const ESTUDIANTES: Usuario[] = ESTUDIANTES_RAW.map((e, i) => ({
  id: `u-est-${i + 1}`,
  cedula: `13505050${(i + 10).toString().padStart(2, "0")}`,
  nombres: e.n,
  apellidos: e.a,
  email: estudianteEmail(e.n.split(" ")[0], e.a),
  password: "Sispaa2026!",
  rol: "estudiante",
  carrera_id: e.c,
  activo: true,
}))

export const USUARIOS_SEED: Usuario[] = [
  SUPER_ADMIN,
  ...COORDINADORES,
  ...SECRETARIAS,
  ...DOCENTES,
  ...ESTUDIANTES,
]

// Credenciales de demo destacadas para mostrar en login
export const CREDENCIALES_DEMO = [
  { email: SUPER_ADMIN.email, password: SUPER_ADMIN.password, rol: "Super Admin" },
  { email: COORDINADORES[0].email, password: COORDINADORES[0].password, rol: "Coordinador de Carrera" },
  { email: COORDINADORES[1].email, password: COORDINADORES[1].password, rol: "Coordinador de Investigacion" },
  { email: SECRETARIAS[0].email, password: SECRETARIAS[0].password, rol: "Secretaria" },
  { email: DOCENTES[0].email, password: DOCENTES[0].password, rol: "Docente (con vinculacion)" },
  { email: DOCENTES[10].email, password: DOCENTES[10].password, rol: "Docente (con vinc + inv)" },
  { email: ESTUDIANTES[0].email, password: ESTUDIANTES[0].password, rol: "Estudiante" },
]
