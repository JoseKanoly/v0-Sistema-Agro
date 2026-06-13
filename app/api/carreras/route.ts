import { NextRequest, NextResponse } from "next/server"
import { carrerasMock } from "@/lib/mock/carreras"
import type { Carrera } from "@/lib/types/database"

let carreras: Carrera[] = [...carrerasMock]

export async function GET() {
  return NextResponse.json(carreras)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, siglas, facultad, coordinador, estado } = body

    if (!nombre || !siglas || !facultad || !coordinador) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newCarrera: Carrera = {
      id: Math.max(...carreras.map((c) => c.id), 0) + 1,
      nombre,
      siglas,
      facultad,
      coordinador,
      estado: estado || "activo",
    }

    carreras.push(newCarrera)
    return NextResponse.json(newCarrera, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
