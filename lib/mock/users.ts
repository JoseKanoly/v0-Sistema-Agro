import type { Usuario, Rol } from "@/lib/types/database"

// Regex de validación de correos institucionales
export const CORREO_DOCENTE_RE = /^[a-z]+\.[a-z]+@uleam\.edu\.ec$/
export const CORREO_ESTUDIANTE_RE = /^e\d{10}@live\.uleam\.edu\.ec$/

interface Raw {
  nombres: string
  apellidos: string
  correo: string
  rol: Rol
  carreraId: number | null
  telefono: string
}

const raw: Raw[] = [
  { nombres: "Administrador", apellidos: "General", correo: "super.admin@uleam.edu.ec", rol: "SUPER_ADMIN", carreraId: null, telefono: "0991000001" },
  { nombres: "Diana", apellidos: "Ronquillo", correo: "diana.ronquillo@uleam.edu.ec", rol: "ADMINISTRADOR", carreraId: null, telefono: "0991000002" },
  { nombres: "Marco", apellidos: "Cedeno", correo: "marco.cedeno@uleam.edu.ec", rol: "COORDINADOR", carreraId: 1, telefono: "0991000003" },
  { nombres: "Lucia", apellidos: "Vera", correo: "lucia.vera@uleam.edu.ec", rol: "COORDINADOR", carreraId: 2, telefono: "0991000004" },
  { nombres: "Pablo", apellidos: "Mendoza", correo: "pablo.mendoza@uleam.edu.ec", rol: "COORDINADOR", carreraId: 3, telefono: "0991000005" },
  { nombres: "Carmen", apellidos: "Velez", correo: "carmen.velez@uleam.edu.ec", rol: "SECRETARIA", carreraId: 1, telefono: "0991000006" },
  { nombres: "Rosa", apellidos: "Pico", correo: "rosa.pico@uleam.edu.ec", rol: "SECRETARIA", carreraId: 2, telefono: "0991000007" },
  { nombres: "Carlos", apellidos: "Macias", correo: "carlos.macias@uleam.edu.ec", rol: "DOCENTE", carreraId: 1, telefono: "0991000008" },
  { nombres: "Patricia", apellidos: "Intriago", correo: "patricia.intriago@uleam.edu.ec", rol: "DOCENTE", carreraId: 1, telefono: "0991000009" },
  { nombres: "Roberto", apellidos: "Loor", correo: "roberto.loor@uleam.edu.ec", rol: "DOCENTE", carreraId: 1, telefono: "0991000010" },
  { nombres: "Mercedes", apellidos: "Chavez", correo: "mercedes.chavez@uleam.edu.ec", rol: "DOCENTE", carreraId: 2, telefono: "0991000011" },
  { nombres: "Jorge", apellidos: "Cevallos", correo: "jorge.cevallos@uleam.edu.ec", rol: "DOCENTE", carreraId: 2, telefono: "0991000012" },
  { nombres: "Gabriela", apellidos: "Moreira", correo: "gabriela.moreira@uleam.edu.ec", rol: "DOCENTE", carreraId: 3, telefono: "0991000013" },
  { nombres: "Fernando", apellidos: "Rivas", correo: "fernando.rivas@uleam.edu.ec", rol: "DOCENTE", carreraId: 3, telefono: "0991000014" },
  { nombres: "Isabel", apellidos: "Garcia", correo: "isabel.garcia@uleam.edu.ec", rol: "DOCENTE", carreraId: 1, telefono: "0991000015" },
  { nombres: "Andres", apellidos: "Mero", correo: "e1350505010@live.uleam.edu.ec", rol: "ESTUDIANTE", carreraId: 1, telefono: "0991000016" },
  { nombres: "Belen", apellidos: "Vera", correo: "e1350505011@live.uleam.edu.ec", rol: "ESTUDIANTE", carreraId: 1, telefono: "0991000017" },
  { nombres: "Daniela", apellidos: "Zambrano", correo: "e1350505012@live.uleam.edu.ec", rol: "ESTUDIANTE", carreraId: 2, telefono: "0991000018" },
  { nombres: "Eduardo", apellidos: "Bravo", correo: "e1350505013@live.uleam.edu.ec", rol: "ESTUDIANTE", carreraId: 2, telefono: "0991000019" },
  { nombres: "Helen", apellidos: "Andrade", correo: "e1350505014@live.uleam.edu.ec", rol: "ESTUDIANTE", carreraId: 3, telefono: "0991000020" },
  { nombres: "Kevin", apellidos: "Garcia", correo: "e1350505015@live.uleam.edu.ec", rol: "ESTUDIANTE", carreraId: 3, telefono: "0991000021" },
  { nombres: "Mateo", apellidos: "Vinces", correo: "e1350505016@live.uleam.edu.ec", rol: "ESTUDIANTE", carreraId: 1, telefono: "0991000022" },
]

export const usuariosMock: Usuario[] = raw.map((u, i) => ({
  id: i + 1,
  nombres: u.nombres,
  apellidos: u.apellidos,
  correo: u.correo,
  cedula: `1350${(505010 + i).toString()}`,
  telefono: u.telefono,
  rol: u.rol,
  carreraId: u.carreraId,
  estado: "activo",
  createdAt: "2026-01-15",
}))

// Credenciales demo destacadas por rol (la contraseña es simbólica en modo mock)
export const credencialesDemo = [
  { correo: "super.admin@uleam.edu.ec", rol: "Super Administrador" },
  { correo: "diana.ronquillo@uleam.edu.ec", rol: "Administrador" },
  { correo: "marco.cedeno@uleam.edu.ec", rol: "Coordinador" },
  { correo: "carlos.macias@uleam.edu.ec", rol: "Docente" },
  { correo: "carmen.velez@uleam.edu.ec", rol: "Secretaría" },
  { correo: "e1350505010@live.uleam.edu.ec", rol: "Estudiante" },
]
