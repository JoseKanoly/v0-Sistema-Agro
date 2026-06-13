import { NextRequest, NextResponse } from "next/server"
import { usuariosMock } from "@/lib/mock/users"
import type { Usuario } from "@/lib/types/database"

let usuarios: Usuario[] = [...usuariosMock]

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const docente = usuarios.find((u) => u.id === id && u.rol === "DOCENTE")

  if (!docente) {
    return NextResponse.json({ error: "Docente not found" }, { status: 404 })
  }

  return NextResponse.json(docente)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { nombres, apellidos, correo, cedula, telefono, carreraId, estado } = body

    const usuarioIndex = usuarios.findIndex((u) => u.id === id && u.rol === "DOCENTE")
    if (usuarioIndex === -1) {
      return NextResponse.json({ error: "Docente not found" }, { status: 404 })
    }

    usuarios[usuarioIndex] = {
      ...usuarios[usuarioIndex],
      nombres: nombres || usuarios[usuarioIndex].nombres,
      apellidos: apellidos || usuarios[usuarioIndex].apellidos,
      correo: correo || usuarios[usuarioIndex].correo,
      cedula: cedula || usuarios[usuarioIndex].cedula,
      telefono: telefono !== undefined ? telefono : usuarios[usuarioIndex].telefono,
      carreraId: carreraId !== undefined ? carreraId : usuarios[usuarioIndex].carreraId,
      estado: estado || usuarios[usuarioIndex].estado,
    }

    return NextResponse.json(usuarios[usuarioIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const usuarioIndex = usuarios.findIndex((u) => u.id === id && u.rol === "DOCENTE")

  if (usuarioIndex === -1) {
    return NextResponse.json({ error: "Docente not found" }, { status: 404 })
  }

  const deletedDocente = usuarios.splice(usuarioIndex, 1)[0]
  return NextResponse.json(deletedDocente)
}
