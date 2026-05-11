'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Estudiante {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  cedula: string;
}

export default function EstudiantesRetiradosPage() {
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
          .eq('activo', false)
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
        <h1 className="text-3xl font-bold tracking-tight">Estudiantes Retirados</h1>
        <p className="text-muted-foreground mt-2">Total: {estudiantes.length} estudiantes retirados</p>
      </div>

      <Card className="bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Estudiantes Desinscritos</p>
            <p className="text-3xl font-bold text-gray-600">{estudiantes.length}</p>
            <p className="text-xs text-muted-foreground mt-1">En este período académico</p>
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
              <p className="text-center text-muted-foreground">No hay estudiantes retirados</p>
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
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                      Retirado
                    </span>
                    <Button variant="outline" size="sm">
                      Reactivar
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
