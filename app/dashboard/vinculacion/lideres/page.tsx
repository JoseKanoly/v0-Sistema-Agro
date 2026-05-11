'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Actividad {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  beneficiarios: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export default function VinculacionLideresPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
          .from('vinculacion_actividades')
          .select('*')
          .eq('docente_id', session.user.id)
          .order('fecha_inicio', { ascending: false });

        if (data) {
          setActividades(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching actividades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, []);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'ejecutada':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'en_ejecucion':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Líderes de Vinculación</h1>
          <p className="text-muted-foreground mt-2">Gestiona actividades de vinculación comunitaria</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Actividad
        </Button>
      </div>

      <div className="grid gap-4">
        {actividades.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay actividades registradas</p>
            </CardContent>
          </Card>
        ) : (
          actividades.map((actividad) => (
            <Card key={actividad.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{actividad.titulo}</CardTitle>
                    <CardDescription>{actividad.descripcion}</CardDescription>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${estadoColor(actividad.estado)}`}>
                    {actividad.estado.replace('_', ' ')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Inicio</p>
                    <p className="font-medium">{new Date(actividad.fecha_inicio).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fin</p>
                    <p className="font-medium">{new Date(actividad.fecha_fin).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Beneficiarios</p>
                    <p className="font-medium">{actividad.beneficiarios}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
