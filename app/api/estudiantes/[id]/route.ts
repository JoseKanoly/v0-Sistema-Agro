import { NextRequest, NextResponse } from "next/server"
import { estudiantesMock } from "@/lib/mock/estudiantes"
import type { Estudiante } from "@/lib/types/database"

let estudiantes: Estudiante[] = [...estudiantesMock]

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const estudiante = estudiantes.find((e) => e.id === id)

  if (!estudiante) {
    return NextResponse.json({ error: "Estudiante not found" }, { status: 404 })
  }

  return NextResponse.json(estudiante)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { nombres, apellidos, cedula, correo, carreraId, nivel, estado, promedio } = body

    const estudianteIndex = estudiantes.findIndex((e) => e.id === id)
    if (estudianteIndex === -1) {
      return NextResponse.json({ error: "Estudiante not found" }, { status: 404 })
    }

    estudiantes[estudianteIndex] = {
      ...estudiantes[estudianteIndex],
      nombres: nombres || estudiantes[estudianteIndex].nombres,
      apellidos: apellidos || estudiantes[estudianteIndex].apellidos,
      cedula: cedula || estudiantes[estudianteIndex].cedula,
      correo: correo || estudiantes[estudianteIndex].correo,
      carreraId: carreraId || estudiantes[estudianteIndex].carreraId,
      nivel: nivel !== undefined ? nivel : estudiantes[estudianteIndex].nivel,
      estado: estado || estudiantes[estudianteIndex].estado,
      promedio: promedio !== undefined ? promedio : estudiantes[estudianteIndex].promedio,
    }

    return NextResponse.json(estudiantes[estudianteIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const estudianteIndex = estudiantes.findIndex((e) => e.id === id)

  if (estudianteIndex === -1) {
    return NextResponse.json({ error: "Estudiante not found" }, { status: 404 })
  }

  const deletedEstudiante = estudiantes.splice(estudianteIndex, 1)[0]
  return NextResponse.json(deletedEstudiante)
}
