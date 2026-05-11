'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Estudiante {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  cedula: string;
}

export default function EstudiantesActivosPage() {
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
          .eq('activo', true)
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

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estudiantes Activos</h1>
        <p className="text-muted-foreground mt-2">Total: {estudiantes.length} estudiantes</p>
      </div>

      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Tasa de Actividad</p>
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p className="text-xs text-muted-foreground mt-1">Estudiantes activos en el período actual</p>
          </div>
        </CardContent>
      </Card>

      <Input
        placeholder="Buscar por nombre, email o cédula..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-4">
        {filteredEstudiantes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No hay estudiantes activos</p>
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
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Activo
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
