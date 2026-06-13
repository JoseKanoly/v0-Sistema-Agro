import { NextRequest, NextResponse } from "next/server"
import { matriculasMock } from "@/lib/mock/academico"
import type { Matricula } from "@/lib/types/database"

let matriculas: Matricula[] = [...matriculasMock]

export async function GET() {
  return NextResponse.json(matriculas)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { estudianteId, materiaId, periodoId, estado, nota } = body

    if (!estudianteId || !materiaId || !periodoId || !estado || nota === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newMatricula: Matricula = {
      id: Math.max(...matriculas.map((m) => m.id), 0) + 1,
      estudianteId,
      materiaId,
      periodoId,
      estado,
      nota,
    }

    matriculas.push(newMatricula)
    return NextResponse.json(newMatricula, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
