import type { DocumentoRevision } from "@/lib/types/database"

const estudiantes = [
  { nombre: "Andres Mero", cedula: "1350505010", carreraId: 1 },
  { nombre: "Belen Vera", cedula: "1350505011", carreraId: 1 },
  { nombre: "Daniela Zambrano", cedula: "1350505012", carreraId: 2 },
  { nombre: "Eduardo Bravo", cedula: "1350505013", carreraId: 2 },
  { nombre: "Helen Andrade", cedula: "1350505014", carreraId: 3 },
  { nombre: "Kevin Garcia", cedula: "1350505015", carreraId: 3 },
  { nombre: "Mateo Vinces", cedula: "1350505016", carreraId: 1 },
]

const tipos = ["Cédula", "Certificado de votación", "Título de bachiller", "Foto carnet", "Récord académico"]
const estados: DocumentoRevision["estado"][] = ["pendiente", "aprobado", "rechazado"]

export const documentosRevisionMock: DocumentoRevision[] = Array.from({ length: 18 }, (_, i) => {
  const est = estudiantes[i % estudiantes.length]
  const tipo = tipos[i % tipos.length]
  return {
    id: i + 1,
    estudiante: est.nombre,
    cedula: est.cedula,
    carreraId: est.carreraId,
    tipo,
    nombre: `${tipo} - ${est.nombre}`,
    fecha: `2026-02-${((i % 27) + 1).toString().padStart(2, "0")}`,
    estado: estados[i % 3],
  }
})
