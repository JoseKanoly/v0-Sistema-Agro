import type { Carrera } from "@/lib/types/database"

export const carrerasMock: Carrera[] = [
  {
    id: 1,
    nombre: "Ingeniería Agroindustrial",
    siglas: "AGRIND",
    facultad: "Ciencias Agropecuarias",
    coordinador: "Ing. Marco Cedeño",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Ingeniería Agropecuaria",
    siglas: "AGROP",
    facultad: "Ciencias Agropecuarias",
    coordinador: "Ing. Lucía Vera",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Ingeniería en Agronegocios",
    siglas: "AGRONEG",
    facultad: "Ciencias Administrativas",
    coordinador: "Econ. Pablo Mendoza",
    estado: "activo",
  },
]
