import type { TemaTitulacion, EstadoTitulacion } from "@/lib/types/database"

const titulos = [
  "Optimización del proceso de secado de cacao mediante energía solar",
  "Evaluación de la calidad microbiológica de quesos artesanales",
  "Desarrollo de una bebida funcional a base de frutas tropicales",
  "Análisis de la cadena de valor del banano orgánico",
  "Implementación de riego por goteo en cultivos de hortalizas",
  "Estudio de factibilidad para una planta procesadora de lácteos",
  "Aprovechamiento de subproductos de la industria cervecera",
  "Modelo de negocio para comercialización de productos agroecológicos",
  "Caracterización fisicoquímica de aceites vegetales locales",
  "Propagación in vitro de variedades de plátano resistentes",
  "Plan de marketing para café especial de altura",
  "Evaluación del rendimiento de fertilizantes orgánicos",
  "Diseño de empaque biodegradable para frutas frescas",
  "Estudio de mercado para exportación de pitahaya",
  "Control biológico de plagas en cultivos de tomate",
  "Análisis sensorial de chocolates de origen único",
  "Sistema de trazabilidad para productos cárnicos",
  "Producción de bioplásticos a partir de almidón de yuca",
  "Gestión financiera en asociaciones de pequeños productores",
  "Evaluación de la huella hídrica en la producción de arroz",
]
const tutores = ["Carlos Macias", "Patricia Intriago", "Mercedes Chavez", "Gabriela Moreira", "Isabel Garcia"]
const modalidades: TemaTitulacion["modalidad"][] = ["proyecto", "tesis", "examen_complexivo"]
const estados: EstadoTitulacion[] = ["propuesto", "en_progreso", "completado"]
const estudiantesNombres = [
  "Andrés Mero", "Belén Vera", "Daniela Zambrano", "Eduardo Bravo", "Helen Andrade",
  "Kevin García", "Mateo Vinces", "Natalia Chávez", "Omar Rivas", "Paula Solórzano",
  "Ricardo Cantos", "Sara Ponce", "Tomás Pinargote", "Valeria Cevallos", "William Mendoza",
  "Ximena Loor", "Fernanda Quijije", "Gabriel Loor", "Lucía Álava", "Iván Pico",
]

export const temasTitulacionMock: TemaTitulacion[] = titulos.map((titulo, i) => ({
  id: i + 1,
  titulo,
  estudiante: estudiantesNombres[i % estudiantesNombres.length],
  tutor: tutores[i % tutores.length],
  carreraId: (i % 3) + 1,
  modalidad: modalidades[i % 3],
  estado: estados[i % 3],
  avance: estados[i % 3] === "completado" ? 100 : estados[i % 3] === "en_progreso" ? 30 + (i % 6) * 10 : 0,
}))
