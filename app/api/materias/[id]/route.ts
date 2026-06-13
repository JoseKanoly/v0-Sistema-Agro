import { NextRequest, NextResponse } from "next/server"
import { materiasMock } from "@/lib/mock/materias"
import type { Materia } from "@/lib/types/database"

let materias: Materia[] = [...materiasMock]

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const materia = materias.find((m) => m.id === id)

  if (!materia) {
    return NextResponse.json({ error: "Materia not found" }, { status: 404 })
  }

  return NextResponse.json(materia)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { carreraId, nombre, codigo, creditos, nivel, docente, activa } = body

    const materiaIndex = materias.findIndex((m) => m.id === id)
    if (materiaIndex === -1) {
      return NextResponse.json({ error: "Materia not found" }, { status: 404 })
    }

    materias[materiaIndex] = {
      ...materias[materiaIndex],
      carreraId: carreraId || materias[materiaIndex].carreraId,
      nombre: nombre || materias[materiaIndex].nombre,
      codigo: codigo || materias[materiaIndex].codigo,
      creditos: creditos !== undefined ? creditos : materias[materiaIndex].creditos,
      nivel: nivel !== undefined ? nivel : materias[materiaIndex].nivel,
      docente: docente !== undefined ? docente : materias[materiaIndex].docente,
      activa: activa !== undefined ? activa : materias[materiaIndex].activa,
    }

    return NextResponse.json(materias[materiaIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const materiaIndex = materias.findIndex((m) => m.id === id)

  if (materiaIndex === -1) {
    return NextResponse.json({ error: "Materia not found" }, { status: 404 })
  }

  const deletedMateria = materias.splice(materiaIndex, 1)[0]
  return NextResponse.json(deletedMateria)
}
