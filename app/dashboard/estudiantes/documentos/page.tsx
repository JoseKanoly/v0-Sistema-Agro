'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/dashboard/kpi-card';
import { Upload, Trash2, Eye } from 'lucide-react';

interface Documento {
  id: string;
  tipo: string;
  nombre_archivo: string;
  estado: string;
  observaciones: string;
  created_at: string;
}

export default function EstudianteDocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const supabase = createClient();

  const documentTypes = [
    { value: 'cedula', label: 'Cédula de Identidad' },
    { value: 'matricula', label: 'Certificado de Matrícula' },
    { value: 'certificado', label: 'Certificado de Estudios' },
    { value: 'foto', label: 'Fotografía' },
    { value: 'otro', label: 'Otro Documento' },
  ];

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: periodos } = await supabase
          .from('periodos_academicos')
          .select('id')
          .eq('activo', true)
          .single();

        if (!periodos) return;

        const { data } = await supabase
          .from('documentos_estudiante')
          .select('*')
          .eq('estudiante_id', session.user.id)
          .eq('periodo_id', periodos.id)
          .order('created_at', { ascending: false });

        if (data) {
          setDocumentos(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching documentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentos();
  }, []);

  const handleUpload = async (type: string) => {
    // Mock upload implementation
    console.log('[v0] Upload started for type:', type);
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('documentos_estudiante').delete().eq('id', id);
      setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('[v0] Error deleting document:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Documentos</h1>
        <p className="text-muted-foreground mt-2">Carga y gestiona tus documentos requeridos</p>
      </div>

      {/* Document Upload Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Requeridos</CardTitle>
          <CardDescription>Sube los documentos solicitados por la institución</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentTypes.map((type) => {
              const doc = documentos.find((d) => d.tipo === type.value);
              return (
                <Card key={type.value} className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">{type.label}</h4>
                      {doc ? (
                        <div className="space-y-2">
                          <StatusBadge status={doc.estado as any} />
                          <p className="text-sm text-muted-foreground">{doc.nombre_archivo}</p>
                          {doc.observaciones && (
                            <p className="text-sm text-destructive">Obs: {doc.observaciones}</p>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-2">
                              <Eye className="w-4 h-4" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive gap-2"
                              onClick={() => handleDelete(doc.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => {
                            setUploadingType(type.value);
                            handleUpload(type.value);
                          }}
                        >
                          <Upload className="w-4 h-4" />
                          Subir Documento
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {documentos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{doc.nombre_archivo}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <StatusBadge status={doc.estado as any} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
