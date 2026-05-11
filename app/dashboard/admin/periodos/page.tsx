'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';

interface Periodo {
  id: string;
  codigo: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export default function AdminPeriodosPage() {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const { data } = await supabase
          .from('periodos_academicos')
          .select('*')
          .order('codigo', { ascending: false });

        if (data) {
          setPeriodos(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching periodos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodos();
  }, []);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Períodos</h1>
          <p className="text-muted-foreground mt-2">Total: {periodos.length} períodos</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Período
        </Button>
      </div>

      <div className="grid gap-4">
        {periodos.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay períodos registrados</p>
            </CardContent>
          </Card>
        ) : (
          periodos.map((periodo) => (
            <Card key={periodo.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {periodo.codigo}
                    </CardTitle>
                    <CardDescription>{periodo.nombre}</CardDescription>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      periodo.activo
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}
                  >
                    {periodo.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Inicio:</span> {new Date(periodo.fecha_inicio).toLocaleDateString('es-ES')}
                  </p>
                  <p>
                    <span className="font-medium">Fin:</span> {new Date(periodo.fecha_fin).toLocaleDateString('es-ES')}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    {!periodo.activo && (
                      <Button variant="outline" size="sm">
                        Activar
                      </Button>
                    )}
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
