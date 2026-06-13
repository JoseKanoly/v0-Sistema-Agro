import type { LiderVinculacion, ActividadVinculacion, EmpresaVinculacion } from "@/lib/types/database"

export const lideresVinculacionMock: LiderVinculacion[] = [
  { id: 1, nombres: "Carlos", apellidos: "Macias", correo: "carlos.macias@uleam.edu.ec", carreraId: 1, proyectosActivos: 3 },
  { id: 2, nombres: "Mercedes", apellidos: "Chavez", correo: "mercedes.chavez@uleam.edu.ec", carreraId: 2, proyectosActivos: 2 },
  { id: 3, nombres: "Gabriela", apellidos: "Moreira", correo: "gabriela.moreira@uleam.edu.ec", carreraId: 3, proyectosActivos: 4 },
  { id: 4, nombres: "Roberto", apellidos: "Loor", correo: "roberto.loor@uleam.edu.ec", carreraId: 1, proyectosActivos: 1 },
  { id: 5, nombres: "Jorge", apellidos: "Cevallos", correo: "jorge.cevallos@uleam.edu.ec", carreraId: 2, proyectosActivos: 2 },
  { id: 6, nombres: "Fernando", apellidos: "Rivas", correo: "fernando.rivas@uleam.edu.ec", carreraId: 3, proyectosActivos: 3 },
]

export const empresasVinculacionMock: EmpresaVinculacion[] = [
  { id: 1, nombre: "Agroexportadora del Pacífico S.A.", ruc: "1390011001001", sector: "Exportación", contacto: "Luis Andrade", telefono: "052610001", convenios: 3 },
  { id: 2, nombre: "Lácteos Manabí Cía. Ltda.", ruc: "1390011002001", sector: "Industria Láctea", contacto: "Rosa Vélez", telefono: "052610002", convenios: 2 },
  { id: 3, nombre: "Cacao Fino de Aroma", ruc: "1390011003001", sector: "Agroindustria", contacto: "Pedro Cedeño", telefono: "052610003", convenios: 4 },
  { id: 4, nombre: "Hortícola Santa Ana", ruc: "1390011004001", sector: "Producción Agrícola", contacto: "María Pico", telefono: "052610004", convenios: 1 },
  { id: 5, nombre: "Camaronera El Estero", ruc: "1390011005001", sector: "Acuicultura", contacto: "Hugo Bravo", telefono: "052610005", convenios: 2 },
  { id: 6, nombre: "Frutícola Tropical", ruc: "1390011006001", sector: "Frutas y Hortalizas", contacto: "Ana Loor", telefono: "052610006", convenios: 3 },
  { id: 7, nombre: "Cooperativa Agraria San José", ruc: "1390011007001", sector: "Cooperativa", contacto: "José Mero", telefono: "052610007", convenios: 2 },
]

const actNombres = [
  "Capacitación en buenas prácticas agrícolas",
  "Asesoría técnica a productores rurales",
  "Programa de educación alimentaria comunitaria",
  "Transferencia de tecnología en riego",
  "Feria agroproductiva universitaria",
  "Diagnóstico de suelos en comunidades",
  "Taller de emprendimiento agroindustrial",
  "Campaña de manejo postcosecha",
  "Mejoramiento genético de cultivos locales",
  "Asistencia en sanidad animal",
]
const estadosAct: ActividadVinculacion["estado"][] = ["programada", "en_progreso", "completado", "cancelada"]

export const actividadesVinculacionMock: ActividadVinculacion[] = actNombres.map((nombre, i) => ({
  id: i + 1,
  nombre,
  liderId: (i % 6) + 1,
  empresaId: (i % 7) + 1,
  carreraId: (i % 3) + 1,
  fechaInicio: `2026-0${(i % 5) + 1}-01`,
  fechaFin: `2026-0${(i % 5) + 3}-30`,
  beneficiarios: 20 + i * 15,
  estado: estadosAct[i % 4],
}))
