import { NextRequest, NextResponse } from "next/server"
import { estudiantesMock } from "@/lib/mock/estudiantes"
import type { Estudiante } from "@/lib/types/database"

let estudiantes: Estudiante[] = [...estudiantesMock]

export async function GET() {
  return NextResponse.json(estudiantes)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombres, apellidos, cedula, correo, carreraId, nivel, estado, promedio } = body

    if (!nombres || !apellidos || !cedula || !correo || !carreraId || nivel === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newEstudiante: Estudiante = {
      id: Math.max(...estudiantes.map((e) => e.id), 0) + 1,
      nombres,
      apellidos,
      cedula,
      correo,
      carreraId,
      nivel,
      estado: estado || "activo",
      promedio: promedio || 0,
    }

    estudiantes.push(newEstudiante)
    return NextResponse.json(newEstudiante, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
