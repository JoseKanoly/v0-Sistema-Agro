import { NextRequest, NextResponse } from "next/server"
import { materiasMock } from "@/lib/mock/materias"
import type { Materia } from "@/lib/types/database"

let materias: Materia[] = [...materiasMock]

export async function GET() {
  return NextResponse.json(materias)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { carreraId, nombre, codigo, creditos, nivel, docente, activa } = body

    if (!carreraId || !nombre || !codigo || creditos === undefined || nivel === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newMateria: Materia = {
      id: Math.max(...materias.map((m) => m.id), 0) + 1,
      carreraId,
      nombre,
      codigo,
      creditos,
      nivel,
      docente: docente || "",
      activa: activa ?? true,
    }

    materias.push(newMateria)
    return NextResponse.json(newMateria, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
