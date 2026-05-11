'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProgressBar } from '@/components/dashboard/kpi-card';

interface Estudiante {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  cedula: string;
  activo: boolean;
}

export default function EstudiantesMatriculadosPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const { data: roles } = await supabase
          .from('roles')
          .select('id')
          .eq('nombre', 'estudiante')
          .single();

        if (!roles) return;

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('rol_id', roles.id)
          .order('apellidos', { ascending: true });

        if (data) {
          setEstudiantes(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching estudiantes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);

  const filteredEstudiantes = estudiantes.filter((est) =>
    `${est.nombres} ${est.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.cedula.includes(searchTerm)
  );

  const activosCount = estudiantes.filter((e) => e.activo).length;

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estudiantes Matriculados</h1>
        <p className="text-muted-foreground mt-2">Total: {estudiantes.length} estudiantes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Tasa de Actividad</p>
            <ProgressBar value={activosCount} max={estudiantes.length} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold">{activosCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Inactivos</p>
              <p className="text-2xl font-bold">{estudiantes.length - activosCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Input
          placeholder="Buscar por nombre, email o cédula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4">
        {filteredEstudiantes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay estudiantes que coincidan</p>
            </CardContent>
          </Card>
        ) : (
          filteredEstudiantes.map((estudiante) => (
            <Card key={estudiante.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {estudiante.nombres} {estudiante.apellidos}
                    </p>
                    <p className="text-sm text-muted-foreground">{estudiante.email}</p>
                    <p className="text-sm text-muted-foreground">Cédula: {estudiante.cedula}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      estudiante.activo
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}
                  >
                    {estudiante.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
