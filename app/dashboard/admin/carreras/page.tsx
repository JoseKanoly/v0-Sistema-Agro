'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Carrera {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  activa: boolean;
}

export default function AdminCarrerasPage() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const { data } = await supabase
          .from('carreras')
          .select('*')
          .order('nombre', { ascending: true });

        if (data) {
          setCarreras(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching carreras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarreras();
  }, []);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Carreras</h1>
          <p className="text-muted-foreground mt-2">Total: {carreras.length} carreras</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Carrera
        </Button>
      </div>

      <div className="grid gap-4">
        {carreras.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay carreras registradas</p>
            </CardContent>
          </Card>
        ) : (
          carreras.map((carrera) => (
            <Card key={carrera.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{carrera.nombre}</CardTitle>
                    <CardDescription>Código: {carrera.codigo}</CardDescription>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      carrera.activa
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}
                  >
                    {carrera.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {carrera.descripcion && (
                    <p className="text-sm text-muted-foreground">{carrera.descripcion}</p>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Editar
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
