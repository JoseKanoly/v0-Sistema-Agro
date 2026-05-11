'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/kpi-card';
import { Plus, Eye } from 'lucide-react';

interface Justificacion {
  id: string;
  falta_id: string;
  motivo: string;
  documento_url: string;
  estado: string;
  fecha_presentacion: string;
  observaciones: string;
}

export default function JustificacionesPage() {
  const [justificaciones, setJustificaciones] = useState<Justificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchJustificaciones = async () => {
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
          .from('justificaciones_falta')
          .select('*')
          .eq('periodo_id', periodos.id)
          .order('fecha_presentacion', { ascending: false });

        if (data) {
          setJustificaciones(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching justificaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJustificaciones();
  }, []);

  const stats = {
    pendiente: justificaciones.filter(j => j.estado === 'pendiente').length,
    aprobado: justificaciones.filter(j => j.estado === 'aprobado').length,
    rechazado: justificaciones.filter(j => j.estado === 'rechazado').length,
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Justificaciones de Faltas</h1>
          <p className="text-muted-foreground mt-2">Total: {justificaciones.length} justificaciones</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevaustificación
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendiente}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">Aprobadas</p>
            <p className="text-2xl font-bold text-green-600">{stats.aprobado}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">Rechazadas</p>
            <p className="text-2xl font-bold text-red-600">{stats.rechazado}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {justificaciones.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay justificaciones registradas</p>
            </CardContent>
          </Card>
        ) : (
          justificaciones.map((just) => (
            <Card key={just.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{just.motivo}</CardTitle>
                    <CardDescription>
                      Presentada: {new Date(just.fecha_presentacion).toLocaleDateString('es-ES')}
                    </CardDescription>
                  </div>
                  <StatusBadge status={just.estado as any} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {just.observaciones && (
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded text-sm">
                    <p className="text-muted-foreground font-medium">Observaciones:</p>
                    <p>{just.observaciones}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Ver Documento
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
