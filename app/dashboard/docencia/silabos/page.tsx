'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, DeadlineIndicator } from '@/components/dashboard/kpi-card';
import { Upload, Trash2 } from 'lucide-react';

interface Silabo {
  id: string;
  materia_id: string;
  periodo_id: string;
  estado: string;
  fecha_limite: string;
  nombre_archivo: string;
  observaciones: string;
  created_at: string;
}

export default function DocenteSilaboPage() {
  const [silabos, setSilabos] = useState<Silabo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSilabos = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
          .from('silabos')
          .select('*')
          .eq('docente_id', session.user.id)
          .order('fecha_limite', { ascending: true });

        if (data) {
          setSilabos(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching silabos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSilabos();
  }, []);

  const calculateDaysRemaining = (fecha: string) => {
    const today = new Date();
    const deadline = new Date(fecha);
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sílabos</h1>
          <p className="text-muted-foreground mt-2">Gestiona los sílabos de tus asignaturas</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Subir Sílabo
        </Button>
      </div>

      <div className="grid gap-4">
        {silabos.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay sílabos registrados</p>
            </CardContent>
          </Card>
        ) : (
          silabos.map((silabo) => (
            <Card key={silabo.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Sílabo</CardTitle>
                    <CardDescription>{silabo.nombre_archivo || 'Sin archivo'}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={silabo.estado as any} />
                    {silabo.fecha_limite && (
                      <DeadlineIndicator daysRemaining={calculateDaysRemaining(silabo.fecha_limite)} />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {silabo.observaciones && (
                    <div className="text-sm">
                      <p className="font-medium text-muted-foreground">Observaciones:</p>
                      <p className="text-destructive">{silabo.observaciones}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Creado: {new Date(silabo.created_at).toLocaleDateString('es-ES')}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Actualizar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive gap-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
