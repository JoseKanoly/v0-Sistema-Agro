import type { InformeDocencia, InformeInvestigacion } from "@/lib/types/database"

const docentes = ["Carlos Macias", "Patricia Intriago", "Roberto Loor", "Mercedes Chavez", "Jorge Cevallos", "Gabriela Moreira", "Fernando Rivas", "Isabel Garcia"]
const estadosInf: InformeDocencia["estado"][] = ["pendiente", "aprobado", "rechazado"]

export const informesDocenciaMock: InformeDocencia[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  docente: docentes[i % docentes.length],
  materiaId: (i % 35) + 1,
  periodoId: (i % 3) + 1,
  tipo: i % 2 === 0 ? "asignatura" : "silabo",
  fechaEntrega: `2026-0${(i % 5) + 1}-${((i % 27) + 1).toString().padStart(2, "0")}`,
  estado: estadosInf[i % 3],
}))

const lineas = [
  "Seguridad alimentaria y nutrición",
  "Producción agropecuaria sostenible",
  "Biotecnología aplicada",
  "Desarrollo agroindustrial",
  "Economía y mercados agrarios",
]
const titulosInv = [
  "Caracterización de variedades nativas de maíz",
  "Impacto del cambio climático en cultivos andinos",
  "Bioinsumos para agricultura sostenible",
  "Valorización de residuos agroindustriales",
  "Análisis de mercados de productos orgánicos",
  "Microorganismos benéficos en suelos agrícolas",
  "Tecnologías de conservación postcosecha",
  "Fermentación de cacao y calidad sensorial",
  "Eficiencia hídrica en sistemas de riego",
  "Trazabilidad digital en cadenas agroalimentarias",
  "Nutrición animal con insumos locales",
  "Resistencia genética a plagas en banano",
  "Producción de bioenergía a partir de biomasa",
  "Indicadores de sostenibilidad en fincas",
  "Innovación en empaques agroindustriales",
  "Diversificación productiva en zonas rurales",
  "Calidad del agua en sistemas acuícolas",
  "Modelos predictivos de rendimiento agrícola",
  "Cadenas cortas de comercialización",
  "Agricultura de precisión con sensores remotos",
]
const investigadores = ["Patricia Intriago", "Isabel Garcia", "Mercedes Chavez", "Fernando Rivas", "Jorge Cevallos"]
const estadosInv: InformeInvestigacion["estado"][] = ["pendiente", "aprobado", "rechazado"]

export const informesInvestigacionMock: InformeInvestigacion[] = titulosInv.map((titulo, i) => ({
  id: i + 1,
  titulo,
  investigador: investigadores[i % investigadores.length],
  carreraId: (i % 3) + 1,
  lineaInvestigacion: lineas[i % lineas.length],
  fecha: `2026-0${(i % 5) + 1}-${((i % 27) + 1).toString().padStart(2, "0")}`,
  estado: estadosInv[i % 3],
}))
