import { NextRequest, NextResponse } from "next/server"
import { usuariosMock } from "@/lib/mock/users"
import type { Usuario } from "@/lib/types/database"

let usuarios: Usuario[] = [...usuariosMock]

export async function GET() {
  const docentes = usuarios.filter((u) => u.rol === "DOCENTE")
  return NextResponse.json(docentes)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombres, apellidos, correo, cedula, telefono, carreraId, estado } = body

    if (!nombres || !apellidos || !correo || !cedula) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newDocente: Usuario = {
      id: Math.max(...usuarios.map((u) => u.id), 0) + 1,
      nombres,
      apellidos,
      correo,
      cedula,
      telefono: telefono || "",
      rol: "DOCENTE",
      carreraId: carreraId || null,
      estado: estado || "activo",
      createdAt: new Date().toISOString(),
    }

    usuarios.push(newDocente)
    return NextResponse.json(newDocente, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
