import { NextRequest, NextResponse } from "next/server"
import { periodosMock } from "@/lib/mock/periodos"
import type { PeriodoAcademico } from "@/lib/types/database"

let periodos: PeriodoAcademico[] = [...periodosMock]

export async function GET() {
  return NextResponse.json(periodos)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, fechaInicio, fechaFin, estado } = body

    if (!nombre || !fechaInicio || !fechaFin || !estado) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newPeriodo: PeriodoAcademico = {
      id: Math.max(...periodos.map((p) => p.id), 0) + 1,
      nombre,
      fechaInicio,
      fechaFin,
      estado,
    }

    periodos.push(newPeriodo)
    return NextResponse.json(newPeriodo, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
