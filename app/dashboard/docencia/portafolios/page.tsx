'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  FolderOpen, 
  Search, 
  Plus, 
  FileText, 
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Portafolio {
  id: string
  asignatura: string
  docente: string
  periodo: string
  estado: 'completo' | 'en_progreso' | 'pendiente'
  progreso: number
  fecha_actualizacion: string
}

// Datos de ejemplo
const portafoliosEjemplo: Portafolio[] = [
  {
    id: '1',
    asignatura: 'Programacion I',
    docente: 'Dr. Juan Perez',
    periodo: '2026-1',
    estado: 'completo',
    progreso: 100,
    fecha_actualizacion: '2026-05-10'
  },
  {
    id: '2',
    asignatura: 'Base de Datos',
    docente: 'Ing. Maria Garcia',
    periodo: '2026-1',
    estado: 'en_progreso',
    progreso: 75,
    fecha_actualizacion: '2026-05-09'
  },
  {
    id: '3',
    asignatura: 'Redes de Computadores',
    docente: 'Msc. Carlos Lopez',
    periodo: '2026-1',
    estado: 'en_progreso',
    progreso: 50,
    fecha_actualizacion: '2026-05-08'
  },
  {
    id: '4',
    asignatura: 'Sistemas Operativos',
    docente: 'Dr. Ana Martinez',
    periodo: '2026-1',
    estado: 'pendiente',
    progreso: 25,
    fecha_actualizacion: '2026-05-05'
  },
  {
    id: '5',
    asignatura: 'Ingenieria de Software',
    docente: 'Ing. Roberto Sanchez',
    periodo: '2026-1',
    estado: 'pendiente',
    progreso: 10,
    fecha_actualizacion: '2026-05-01'
  }
]

function getEstadoBadge(estado: string) {
  switch (estado) {
    case 'completo':
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completo</Badge>
    case 'en_progreso':
      return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />En Progreso</Badge>
    case 'pendiente':
      return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pendiente</Badge>
    default:
      return <Badge variant="outline">{estado}</Badge>
  }
}

export default function PortafoliosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [portafolios, setPortafolios] = useState<Portafolio[]>(portafoliosEjemplo)
  
  const filteredPortafolios = portafolios.filter(p => 
    p.asignatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.docente.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: portafolios.length,
    completos: portafolios.filter(p => p.estado === 'completo').length,
    enProgreso: portafolios.filter(p => p.estado === 'en_progreso').length,
    pendientes: portafolios.filter(p => p.estado === 'pendiente').length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portafolios Docentes</h1>
            <p className="text-muted-foreground">Gestion y seguimiento de portafolios academicos</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Portafolio
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portafolios</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.enProgreso}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Portafolios</CardTitle>
                <CardDescription>Periodo academico 2026-1</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar portafolio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asignatura</TableHead>
                  <TableHead>Docente</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Actualizado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPortafolios.map((portafolio) => (
                  <TableRow key={portafolio.id}>
                    <TableCell className="font-medium">{portafolio.asignatura}</TableCell>
                    <TableCell>{portafolio.docente}</TableCell>
                    <TableCell>{portafolio.periodo}</TableCell>
                    <TableCell>{getEstadoBadge(portafolio.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              portafolio.progreso === 100 ? 'bg-green-500' :
                              portafolio.progreso >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${portafolio.progreso}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{portafolio.progreso}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{portafolio.fecha_actualizacion}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
