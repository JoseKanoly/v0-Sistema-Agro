'use client'

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PeriodoAcademico, Carrera } from '@/lib/types/database'

interface PeriodoFilterProps {
  periodos: PeriodoAcademico[]
  selectedPeriodo: string
  onPeriodoChange: (value: string) => void
}

export function PeriodoFilter({ periodos, selectedPeriodo, onPeriodoChange }: PeriodoFilterProps) {
  return (
    <Select value={selectedPeriodo} onValueChange={onPeriodoChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccionar periodo" />
      </SelectTrigger>
      <SelectContent>
        {periodos.map((periodo) => (
          <SelectItem key={periodo.id} value={periodo.id}>
            {periodo.codigo} {periodo.activo && '(Activo)'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface CarreraFilterProps {
  carreras: Carrera[]
  selectedCarrera: string
  onCarreraChange: (value: string) => void
  showAll?: boolean
}

export function CarreraFilter({ carreras, selectedCarrera, onCarreraChange, showAll = true }: CarreraFilterProps) {
  return (
    <Select value={selectedCarrera} onValueChange={onCarreraChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Seleccionar carrera" />
      </SelectTrigger>
      <SelectContent>
        {showAll && <SelectItem value="all">Todas las carreras</SelectItem>}
        {carreras.map((carrera) => (
          <SelectItem key={carrera.id} value={carrera.id}>
            {carrera.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface DashboardFiltersProps {
  periodos: PeriodoAcademico[]
  carreras: Carrera[]
  selectedPeriodo: string
  selectedCarrera: string
  onPeriodoChange: (value: string) => void
  onCarreraChange: (value: string) => void
}

export function DashboardFilters({
  periodos,
  carreras,
  selectedPeriodo,
  selectedCarrera,
  onPeriodoChange,
  onCarreraChange
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Periodo:</span>
        <PeriodoFilter 
          periodos={periodos} 
          selectedPeriodo={selectedPeriodo} 
          onPeriodoChange={onPeriodoChange} 
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Carrera:</span>
        <CarreraFilter 
          carreras={carreras} 
          selectedCarrera={selectedCarrera} 
          onCarreraChange={onCarreraChange} 
        />
      </div>
    </div>
  )
}
