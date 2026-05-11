'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/dashboard/kpi-card';
import { Plus, Eye } from 'lucide-react';

interface Falta {
  id: string;
  estudiante_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  horas_justificadas: number;
  motivo: string;
  tipo_falta: string;
  estado: string;
}

export default function EstudianteFaltasPage() {
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchFaltas = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: periodos } = await supabase
          .from('periodos_academicos')
          .select('id')
          .eq('activo', true)
          .single();

        if (!periodos) return;

        const { data } = await supabase
          .from('faltas_estudiante')
          .select('*')
          .eq('periodo_id', periodos.id)
          .order('fecha_inicio', { ascending: false });

        if (data) {
          setFaltas(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching faltas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaltas();
  }, []);

  const faltasByStatus = {
    pendiente: faltas.filter(f => f.estado === 'pendiente').length,
    aprobado: faltas.filter(f => f.estado === 'aprobado').length,
    rechazado: faltas.filter(f => f.estado === 'rechazado').length,
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faltas Registradas</h1>
          <p className="text-muted-foreground mt-2">Total: {faltas.length} faltas</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Registrar Falta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Faltas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{faltasByStatus.pendiente}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600">{faltasByStatus.aprobado}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Rechazadas</p>
              <p className="text-2xl font-bold text-red-600">{faltasByStatus.rechazado}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Input
        placeholder="Buscar faltas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-4">
        {faltas.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay faltas registradas</p>
            </CardContent>
          </Card>
        ) : (
          faltas.map((falta) => (
            <Card key={falta.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base capitalize">
                      {falta.tipo_falta.replace('_', ' ')}
                    </CardTitle>
                    <CardDescription>{falta.motivo}</CardDescription>
                  </div>
                  <StatusBadge status={falta.estado as any} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Desde</p>
                    <p className="font-medium">{new Date(falta.fecha_inicio).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hasta</p>
                    <p className="font-medium">{new Date(falta.fecha_fin).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Horas</p>
                    <p className="font-medium">{falta.horas_justificadas}h</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
