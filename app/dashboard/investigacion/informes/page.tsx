'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/dashboard/kpi-card';
import { Plus } from 'lucide-react';

interface Investigacion {
  id: string;
  titulo: string;
  estado: string;
  presupuesto_asignado: number;
  presupuesto_ejecutado: number;
  created_at: string;
}

export default function InvestigacionPage() {
  const [investigaciones, setInvestigaciones] = useState<Investigacion[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInvestigaciones = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
          .from('investigaciones')
          .select('*')
          .eq('docente_id', session.user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setInvestigaciones(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching investigaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestigaciones();
  }, []);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investigaciones</h1>
          <p className="text-muted-foreground mt-2">Gestiona tus proyectos de investigación</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Investigación
        </Button>
      </div>

      <div className="grid gap-4">
        {investigaciones.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay investigaciones registradas</p>
            </CardContent>
          </Card>
        ) : (
          investigaciones.map((inv) => {
            const presupuetoUsage = inv.presupuesto_asignado > 0 
              ? (inv.presupuesto_ejecutado / inv.presupuesto_asignado) * 100 
              : 0;

            return (
              <Card key={inv.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{inv.titulo}</CardTitle>
                  <CardDescription>
                    Estado: <span className="capitalize font-medium">{inv.estado.replace('_', ' ')}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inv.presupuesto_asignado > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Presupuesto</p>
                      <ProgressBar value={presupuetoUsage} />
                      <p className="text-xs text-muted-foreground mt-1">
                        ${inv.presupuesto_ejecutado.toFixed(2)} / ${inv.presupuesto_asignado.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Creado: {new Date(inv.created_at).toLocaleDateString('es-ES')}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
