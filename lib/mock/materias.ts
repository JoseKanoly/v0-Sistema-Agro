import type { Materia } from "@/lib/types/database"

const docentes = [
  "Carlos Macias",
  "Patricia Intriago",
  "Roberto Loor",
  "Mercedes Chavez",
  "Jorge Cevallos",
  "Gabriela Moreira",
  "Fernando Rivas",
  "Isabel Garcia",
]

interface Raw {
  nombre: string
  codigo: string
  carreraId: number
  nivel: number
  creditos: number
}

// Derivado del volcado materias.sql (subconjunto representativo de las 3 carreras)
const raw: Raw[] = [
  // Agroindustrial (carreraId 1)
  { nombre: "Química Inorgánica", codigo: "AGRIND-101", carreraId: 1, nivel: 1, creditos: 3 },
  { nombre: "Introducción a la Agroindustria", codigo: "AGRIND-104", carreraId: 1, nivel: 1, creditos: 3 },
  { nombre: "Fundamentos de Física", codigo: "AGRIND-103", carreraId: 1, nivel: 1, creditos: 3 },
  { nombre: "Cálculo Diferencial", codigo: "PAM-1202", carreraId: 1, nivel: 1, creditos: 3 },
  { nombre: "Química Orgánica", codigo: "PAM-2501", carreraId: 1, nivel: 2, creditos: 3 },
  { nombre: "Estadística", codigo: "PAM-1209", carreraId: 1, nivel: 2, creditos: 3 },
  { nombre: "Microbiología", codigo: "PAM-2414", carreraId: 1, nivel: 3, creditos: 3 },
  { nombre: "Química Analítica", codigo: "AGRIND-303", carreraId: 1, nivel: 3, creditos: 3 },
  { nombre: "Análisis Instrumental", codigo: "AGRIND-305", carreraId: 1, nivel: 4, creditos: 3 },
  { nombre: "Bromatología", codigo: "AGRIND-401", carreraId: 1, nivel: 4, creditos: 3 },
  { nombre: "Química de los Alimentos", codigo: "AGRIND-401A", carreraId: 1, nivel: 4, creditos: 3 },
  { nombre: "Análisis Sensorial", codigo: "AGRIND-803A", carreraId: 1, nivel: 5, creditos: 3 },
  { nombre: "Operaciones Unitarias", codigo: "AGRIND-801", carreraId: 1, nivel: 6, creditos: 3 },
  { nombre: "Industrias Lácteas", codigo: "AGRIND-703", carreraId: 1, nivel: 7, creditos: 3 },
  { nombre: "Gestión de la Calidad", codigo: "AGRIND-804A", carreraId: 1, nivel: 9, creditos: 3 },
  // Agropecuaria (carreraId 2)
  { nombre: "Biología", codigo: "AGRN-101", carreraId: 2, nivel: 1, creditos: 3 },
  { nombre: "Matemática", codigo: "AGRN-102", carreraId: 2, nivel: 1, creditos: 3 },
  { nombre: "Química", codigo: "AGRN-103", carreraId: 2, nivel: 1, creditos: 3 },
  { nombre: "Botánica", codigo: "AGRN-201", carreraId: 2, nivel: 2, creditos: 3 },
  { nombre: "Ciencias del Suelo", codigo: "AGRN-206", carreraId: 2, nivel: 2, creditos: 3 },
  { nombre: "Contabilidad Agropecuaria", codigo: "AGRN-301", carreraId: 2, nivel: 3, creditos: 3 },
  { nombre: "Sistemas de Producción Agrícola", codigo: "AGRN-305", carreraId: 2, nivel: 3, creditos: 3 },
  { nombre: "Biotecnologías Agropecuarias", codigo: "AGRN-404", carreraId: 2, nivel: 4, creditos: 3 },
  { nombre: "Manejo Postcosecha", codigo: "AGRN-405", carreraId: 2, nivel: 4, creditos: 3 },
  { nombre: "Agricultura de Precisión", codigo: "AGRN-506", carreraId: 2, nivel: 5, creditos: 3 },
  { nombre: "Formulación y Evaluación de Proyectos", codigo: "AGRN-602", carreraId: 2, nivel: 6, creditos: 3 },
  // Agronegocios (carreraId 3)
  { nombre: "Biología", codigo: "AGR-101", carreraId: 3, nivel: 1, creditos: 3 },
  { nombre: "Química General", codigo: "AGR-102", carreraId: 3, nivel: 1, creditos: 3 },
  { nombre: "Matemática", codigo: "AGR-103", carreraId: 3, nivel: 1, creditos: 3 },
  { nombre: "Metodología de la Investigación", codigo: "AGR-104", carreraId: 3, nivel: 1, creditos: 3 },
  { nombre: "Química Orgánica", codigo: "AGR-202", carreraId: 3, nivel: 2, creditos: 3 },
  { nombre: "Microbiología", codigo: "AGR-204", carreraId: 3, nivel: 2, creditos: 3 },
  { nombre: "Ciencias del Suelo", codigo: "AGR-302", carreraId: 3, nivel: 3, creditos: 3 },
  { nombre: "Topografía", codigo: "AGR-303", carreraId: 3, nivel: 3, creditos: 3 },
  { nombre: "Sanidad Vegetal", codigo: "AGR-304", carreraId: 3, nivel: 3, creditos: 3 },
  { nombre: "Anatomía y Fisiología Animal", codigo: "AGR-305", carreraId: 3, nivel: 3, creditos: 3 },
]

export const materiasMock: Materia[] = raw.map((m, i) => ({
  id: i + 1,
  carreraId: m.carreraId,
  nombre: m.nombre,
  codigo: m.codigo,
  creditos: m.creditos,
  nivel: m.nivel,
  docente: docentes[i % docentes.length],
  activa: true,
}))
