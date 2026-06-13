import { NextRequest, NextResponse } from "next/server"
import { periodosMock } from "@/lib/mock/periodos"
import type { PeriodoAcademico } from "@/lib/types/database"

let periodos: PeriodoAcademico[] = [...periodosMock]

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const periodo = periodos.find((p) => p.id === id)

  if (!periodo) {
    return NextResponse.json({ error: "Periodo not found" }, { status: 404 })
  }

  return NextResponse.json(periodo)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { nombre, fechaInicio, fechaFin, estado } = body

    const periodoIndex = periodos.findIndex((p) => p.id === id)
    if (periodoIndex === -1) {
      return NextResponse.json({ error: "Periodo not found" }, { status: 404 })
    }

    periodos[periodoIndex] = {
      ...periodos[periodoIndex],
      nombre: nombre || periodos[periodoIndex].nombre,
      fechaInicio: fechaInicio || periodos[periodoIndex].fechaInicio,
      fechaFin: fechaFin || periodos[periodoIndex].fechaFin,
      estado: estado || periodos[periodoIndex].estado,
    }

    return NextResponse.json(periodos[periodoIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const periodoIndex = periodos.findIndex((p) => p.id === id)

  if (periodoIndex === -1) {
    return NextResponse.json({ error: "Periodo not found" }, { status: 404 })
  }

  const deletedPeriodo = periodos.splice(periodoIndex, 1)[0]
  return NextResponse.json(deletedPeriodo)
}
