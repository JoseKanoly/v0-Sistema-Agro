'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ProgressIcon } from 'lucide-react';
import { ProgressBar } from '@/components/dashboard/kpi-card';

interface Tema {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  created_at: string;
}

export default function TitulacionTemasPage() {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
          .from('titulacion_temas')
          .select('*')
          .eq('tutor_id', session.user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setTemas(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching temas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemas();
  }, []);

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'graduado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'aprobado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'en_revision':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Temas en Desarrollo</h1>
          <p className="text-muted-foreground mt-2">Tutorías de temas de titulación</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Tema
        </Button>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{temas.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">En Desarrollo</p>
              <p className="text-2xl font-bold">{temas.filter(t => t.estado === 'en_desarrollo').length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">En Revisión</p>
              <p className="text-2xl font-bold">{temas.filter(t => t.estado === 'en_revision').length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Graduados</p>
              <p className="text-2xl font-bold">{temas.filter(t => t.estado === 'graduado').length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {temas.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay temas registrados</p>
            </CardContent>
          </Card>
        ) : (
          temas.map((tema) => (
            <Card key={tema.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{tema.titulo}</CardTitle>
                    <CardDescription>{tema.descripcion}</CardDescription>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${estadoColor(tema.estado)}`}>
                    {tema.estado.replace('_', ' ')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Avance General</p>
                  <ProgressBar value={tema.estado === 'graduado' ? 100 : tema.estado === 'en_revision' ? 75 : 40} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Avances
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
