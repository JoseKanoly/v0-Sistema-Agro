import type { Laboratorio, Equipo, Reactivo, Practica, EstadoEquipo, EstadoReactivo } from "@/lib/types/database"

export const laboratoriosMock: Laboratorio[] = [
  { id: 1, nombre: "Laboratorio de Química Analítica", ubicacion: "Bloque A - Planta Baja", carreraId: 1, capacidad: 30, responsable: "Carlos Macias", estado: "activo" },
  { id: 2, nombre: "Laboratorio de Bromatología", ubicacion: "Bloque A - Primer Piso", carreraId: 1, capacidad: 25, responsable: "Patricia Intriago", estado: "activo" },
  { id: 3, nombre: "Laboratorio de Microbiología", ubicacion: "Bloque B - Planta Baja", carreraId: 1, capacidad: 20, responsable: "Isabel Garcia", estado: "activo" },
  { id: 4, nombre: "Laboratorio de Suelos", ubicacion: "Bloque C - Planta Baja", carreraId: 2, capacidad: 28, responsable: "Mercedes Chavez", estado: "activo" },
  { id: 5, nombre: "Laboratorio de Biotecnología", ubicacion: "Bloque C - Primer Piso", carreraId: 2, capacidad: 22, responsable: "Jorge Cevallos", estado: "activo" },
  { id: 6, nombre: "Laboratorio de Sanidad Vegetal", ubicacion: "Bloque D - Planta Baja", carreraId: 3, capacidad: 24, responsable: "Gabriela Moreira", estado: "activo" },
  { id: 7, nombre: "Laboratorio de Topografía", ubicacion: "Bloque D - Primer Piso", carreraId: 3, capacidad: 30, responsable: "Fernando Rivas", estado: "inactivo" },
]

const equiposEstados: EstadoEquipo[] = ["operativo", "mantenimiento", "dañado"]
const equiposNombres = [
  "Microscopio óptico", "Balanza analítica", "Centrífuga", "Espectrofotómetro", "pHmetro digital",
  "Autoclave", "Estufa de secado", "Campana de extracción", "Mufla", "Refractómetro",
  "Agitador magnético", "Destilador de agua", "Cromatógrafo HPLC", "Incubadora", "Baño maría",
  "Bomba de vacío", "Conductímetro", "Viscosímetro", "Texturómetro", "Liofilizador",
  "Microcentrífuga", "Termociclador",
]

export const equiposMock: Equipo[] = equiposNombres.map((nombre, i) => ({
  id: i + 1,
  nombre,
  codigo: `EQ-${(1001 + i).toString()}`,
  laboratorioId: (i % 7) + 1,
  cantidad: (i % 5) + 1,
  estado: equiposEstados[i % 3],
}))

const reactivosEstados: EstadoReactivo[] = ["disponible", "bajo_stock", "agotado"]
const reactivosData = [
  { n: "Ácido clorhídrico", f: "HCl", u: "mL" },
  { n: "Hidróxido de sodio", f: "NaOH", u: "g" },
  { n: "Ácido sulfúrico", f: "H₂SO₄", u: "mL" },
  { n: "Etanol", f: "C₂H₅OH", u: "mL" },
  { n: "Fenolftaleína", f: "C₂₀H₁₄O₄", u: "mL" },
  { n: "Cloruro de sodio", f: "NaCl", u: "g" },
  { n: "Sulfato de cobre", f: "CuSO₄", u: "g" },
  { n: "Permanganato de potasio", f: "KMnO₄", u: "g" },
  { n: "Acetona", f: "C₃H₆O", u: "mL" },
  { n: "Ácido acético", f: "CH₃COOH", u: "mL" },
  { n: "Nitrato de plata", f: "AgNO₃", u: "g" },
  { n: "Bicarbonato de sodio", f: "NaHCO₃", u: "g" },
  { n: "Glucosa", f: "C₆H₁₂O₆", u: "g" },
  { n: "Almidón soluble", f: "(C₆H₁₀O₅)ₙ", u: "g" },
  { n: "Yodo", f: "I₂", u: "g" },
  { n: "Agar nutritivo", f: "—", u: "g" },
  { n: "Peptona", f: "—", u: "g" },
  { n: "Ácido cítrico", f: "C₆H₈O₇", u: "g" },
  { n: "Metanol", f: "CH₃OH", u: "mL" },
  { n: "Cloroformo", f: "CHCl₃", u: "mL" },
  { n: "Carbonato de calcio", f: "CaCO₃", u: "g" },
  { n: "Sulfato de magnesio", f: "MgSO₄", u: "g" },
]

export const reactivosMock: Reactivo[] = reactivosData.map((r, i) => ({
  id: i + 1,
  nombre: r.n,
  formula: r.f,
  laboratorioId: (i % 7) + 1,
  cantidad: (i * 37) % 500,
  unidad: r.u,
  estado: reactivosEstados[i % 3],
}))

const temas = [
  "Determinación de pH en muestras de alimentos",
  "Análisis microbiológico de productos lácteos",
  "Titulación ácido-base",
  "Extracción de aceites esenciales",
  "Cultivo in vitro de tejidos vegetales",
  "Análisis de textura en frutas",
  "Determinación de humedad por gravimetría",
  "Identificación de carbohidratos",
  "Análisis sensorial de bebidas",
  "Medición de conductividad en suelos",
]
const estadosPractica: Practica["estado"][] = ["programada", "realizada", "cancelada"]

export const practicasMock: Practica[] = temas.map((tema, i) => ({
  id: i + 1,
  tema,
  carreraId: (i % 3) + 1,
  materiaId: (i % 35) + 1,
  periodoId: 1,
  laboratorioId: (i % 7) + 1,
  docente: ["Carlos Macias", "Patricia Intriago", "Isabel Garcia", "Mercedes Chavez"][i % 4],
  fecha: `2026-0${(i % 5) + 1}-${((i % 27) + 1).toString().padStart(2, "0")}`,
  objetivo: "Desarrollar competencias prácticas en el manejo de técnicas de laboratorio aplicadas.",
  fundamento: "La práctica se fundamenta en los principios teóricos revisados en clase.",
  procedimiento: "1. Preparar materiales. 2. Ejecutar el protocolo. 3. Registrar resultados.",
  observaciones: "Práctica realizada con normalidad siguiendo protocolos de bioseguridad.",
  equipos: [
    { nombre: "Balanza analítica", cantidad: 2 },
    { nombre: "pHmetro digital", cantidad: 1 },
  ],
  reactivos: [
    { nombre: "Hidróxido de sodio", cantidad: 50 },
    { nombre: "Fenolftaleína", cantidad: 10 },
  ],
  asistencia: [],
  estado: estadosPractica[i % 3],
}))
