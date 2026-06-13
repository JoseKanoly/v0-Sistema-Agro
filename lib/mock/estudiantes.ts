import type { Estudiante, EstadoEstudiante } from "@/lib/types/database"

interface Raw {
  nombres: string
  apellidos: string
  carreraId: number
  nivel: number
  estado: EstadoEstudiante
  promedio: number
}

const raw: Raw[] = [
  { nombres: "Andrés Felipe", apellidos: "Mero García", carreraId: 1, nivel: 3, estado: "activo", promedio: 8.7 },
  { nombres: "Belén Estefanía", apellidos: "Vera Loor", carreraId: 1, nivel: 3, estado: "activo", promedio: 9.1 },
  { nombres: "Carlos Daniel", apellidos: "Cedeño Pico", carreraId: 1, nivel: 2, estado: "activo", promedio: 7.8 },
  { nombres: "Daniela Sofía", apellidos: "Zambrano Macías", carreraId: 1, nivel: 5, estado: "activo", promedio: 8.4 },
  { nombres: "Eduardo José", apellidos: "Bravo Intriago", carreraId: 1, nivel: 4, estado: "retirado", promedio: 6.2 },
  { nombres: "Fernanda María", apellidos: "Quijije Vera", carreraId: 1, nivel: 6, estado: "activo", promedio: 9.4 },
  { nombres: "Gabriel Antonio", apellidos: "Loor Moreira", carreraId: 1, nivel: 8, estado: "egresado", promedio: 8.9 },
  { nombres: "Helen Patricia", apellidos: "Andrade Solórzano", carreraId: 2, nivel: 2, estado: "activo", promedio: 8.0 },
  { nombres: "Iván Sebastián", apellidos: "Pico Cevallos", carreraId: 2, nivel: 3, estado: "activo", promedio: 7.5 },
  { nombres: "Jhuliana Carolina", apellidos: "Moreira Ferrín", carreraId: 2, nivel: 4, estado: "activo", promedio: 8.8 },
  { nombres: "Kevin Alejandro", apellidos: "García Cantos", carreraId: 2, nivel: 1, estado: "activo", promedio: 7.2 },
  { nombres: "Lucía Belén", apellidos: "Álava Pinargote", carreraId: 2, nivel: 5, estado: "retirado", promedio: 5.9 },
  { nombres: "Mateo Nicolás", apellidos: "Vinces Vélez", carreraId: 2, nivel: 6, estado: "activo", promedio: 9.0 },
  { nombres: "Natalia Isabel", apellidos: "Chávez Loor", carreraId: 2, nivel: 7, estado: "activo", promedio: 8.6 },
  { nombres: "Omar Alexander", apellidos: "Rivas Cedeño", carreraId: 3, nivel: 2, estado: "activo", promedio: 7.9 },
  { nombres: "Paula Andrea", apellidos: "Solórzano Mero", carreraId: 3, nivel: 3, estado: "activo", promedio: 8.3 },
  { nombres: "Ricardo Esteban", apellidos: "Cantos Zambrano", carreraId: 3, nivel: 4, estado: "activo", promedio: 7.6 },
  { nombres: "Sara Valentina", apellidos: "Ponce Bravo", carreraId: 3, nivel: 5, estado: "egresado", promedio: 9.2 },
  { nombres: "Tomás Adrián", apellidos: "Pinargote Pico", carreraId: 3, nivel: 1, estado: "activo", promedio: 6.8 },
  { nombres: "Valeria Renata", apellidos: "Cevallos Mendoza", carreraId: 3, nivel: 6, estado: "activo", promedio: 8.5 },
  { nombres: "William David", apellidos: "Mendoza Alava", carreraId: 1, nivel: 7, estado: "activo", promedio: 8.1 },
  { nombres: "Ximena Antonella", apellidos: "Loor Bravo", carreraId: 2, nivel: 8, estado: "egresado", promedio: 9.3 },
]

export const estudiantesMock: Estudiante[] = raw.map((e, i) => ({
  id: i + 1,
  nombres: e.nombres,
  apellidos: e.apellidos,
  cedula: `1360${(606010 + i).toString()}`,
  correo: `e${(1360606010 + i).toString()}@live.uleam.edu.ec`,
  carreraId: e.carreraId,
  nivel: e.nivel,
  estado: e.estado,
  promedio: e.promedio,
}))
