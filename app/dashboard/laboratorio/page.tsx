'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Practica {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  estudiantes_asistentes: number;
}

export default function LaboratorioPage() {
  const [practicas, setPracticas] = useState<Practica[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPracticas = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
          .from('practicas_laboratorio')
          .select('*')
          .eq('docente_id', session.user.id)
          .order('fecha', { ascending: false });

        if (data) {
          setPracticas(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching practicas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticas();
  }, []);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prácticas de Laboratorio</h1>
          <p className="text-muted-foreground mt-2">Registra y gestiona tus prácticas de laboratorio</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Práctica
        </Button>
      </div>

      <div className="grid gap-4">
        {practicas.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay prácticas registradas</p>
            </CardContent>
          </Card>
        ) : (
          practicas.map((practica) => (
            <Card key={practica.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{practica.titulo}</CardTitle>
                <CardDescription>{practica.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Fecha: {new Date(practica.fecha).toLocaleDateString('es-ES')}</p>
                <p className="text-sm">Ubicación: {practica.ubicacion}</p>
                <p className="text-sm">Asistentes: {practica.estudiantes_asistentes}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
