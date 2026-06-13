import { NextRequest, NextResponse } from "next/server"
import { carrerasMock } from "@/lib/mock/carreras"
import type { Carrera } from "@/lib/types/database"

let carreras: Carrera[] = [...carrerasMock]

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const carrera = carreras.find((c) => c.id === id)

  if (!carrera) {
    return NextResponse.json({ error: "Carrera not found" }, { status: 404 })
  }

  return NextResponse.json(carrera)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { nombre, siglas, facultad, coordinador, estado } = body

    const carreraIndex = carreras.findIndex((c) => c.id === id)
    if (carreraIndex === -1) {
      return NextResponse.json({ error: "Carrera not found" }, { status: 404 })
    }

    carreras[carreraIndex] = {
      ...carreras[carreraIndex],
      nombre: nombre || carreras[carreraIndex].nombre,
      siglas: siglas || carreras[carreraIndex].siglas,
      facultad: facultad || carreras[carreraIndex].facultad,
      coordinador: coordinador || carreras[carreraIndex].coordinador,
      estado: estado || carreras[carreraIndex].estado,
    }

    return NextResponse.json(carreras[carreraIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const carreraIndex = carreras.findIndex((c) => c.id === id)

  if (carreraIndex === -1) {
    return NextResponse.json({ error: "Carrera not found" }, { status: 404 })
  }

  const deletedCarrera = carreras.splice(carreraIndex, 1)[0]
  return NextResponse.json(deletedCarrera)
}
