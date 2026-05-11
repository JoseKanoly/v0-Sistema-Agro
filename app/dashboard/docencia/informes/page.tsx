'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge, DeadlineIndicator } from '@/components/dashboard/kpi-card';
import { Plus, Upload, Trash2 } from 'lucide-react';

interface Informe {
  id: string;
  tipo: string;
  materia_id: string;
  estado: string;
  fecha_limite: string;
  nombre_archivo: string;
  created_at: string;
}

export default function DocenteInformesPage() {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
          .from('informes_docente')
          .select('*')
          .eq('docente_id', session.user.id)
          .order('fecha_limite', { ascending: true });

        if (data) {
          setInformes(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching informes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInformes();
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
          <h1 className="text-3xl font-bold tracking-tight">Informes de Asignatura</h1>
          <p className="text-muted-foreground mt-2">Gestiona tus informes docentes</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Subir Informe
        </Button>
      </div>

      <div className="grid gap-4">
        {informes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay informes registrados</p>
            </CardContent>
          </Card>
        ) : (
          informes.map((informe) => (
            <Card key={informe.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Informe {informe.tipo.charAt(0).toUpperCase() + informe.tipo.slice(1)}
                    </CardTitle>
                    <CardDescription>{informe.nombre_archivo || 'Sin archivo'}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={informe.estado as any} />
                    {informe.fecha_limite && (
                      <DeadlineIndicator daysRemaining={calculateDaysRemaining(informe.fecha_limite)} />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Creado: {new Date(informe.created_at).toLocaleDateString('es-ES')}</span>
                  </div>
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
