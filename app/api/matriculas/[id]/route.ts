import { NextRequest, NextResponse } from "next/server"
import { matriculasMock } from "@/lib/mock/academico"
import type { Matricula } from "@/lib/types/database"

let matriculas: Matricula[] = [...matriculasMock]

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const matricula = matriculas.find((m) => m.id === id)

  if (!matricula) {
    return NextResponse.json({ error: "Matricula not found" }, { status: 404 })
  }

  return NextResponse.json(matricula)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { estudianteId, materiaId, periodoId, estado, nota } = body

    const matriculaIndex = matriculas.findIndex((m) => m.id === id)
    if (matriculaIndex === -1) {
      return NextResponse.json({ error: "Matricula not found" }, { status: 404 })
    }

    matriculas[matriculaIndex] = {
      ...matriculas[matriculaIndex],
      estudianteId: estudianteId || matriculas[matriculaIndex].estudianteId,
      materiaId: materiaId || matriculas[matriculaIndex].materiaId,
      periodoId: periodoId || matriculas[matriculaIndex].periodoId,
      estado: estado || matriculas[matriculaIndex].estado,
      nota: nota !== undefined ? nota : matriculas[matriculaIndex].nota,
    }

    return NextResponse.json(matriculas[matriculaIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const matriculaIndex = matriculas.findIndex((m) => m.id === id)

  if (matriculaIndex === -1) {
    return NextResponse.json({ error: "Matricula not found" }, { status: 404 })
  }

  const deletedMatricula = matriculas.splice(matriculaIndex, 1)[0]
  return NextResponse.json(deletedMatricula)
}
