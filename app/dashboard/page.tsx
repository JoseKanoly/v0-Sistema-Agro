'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { DashboardFilters } from '@/components/dashboard/filters';
import type { PeriodoAcademico, Carrera } from '@/lib/types/database';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface KPIData {
  docencia: { cumplimiento: number; cumplidos: number; pendientes: number; incumplidos: number };
  investigacion: { activos: number; avanzados: number; revision: number };
  estudiantes: { matriculados: number; activos: number; retirados: number; faltas: number };
  practicas: { realizadas: number };
  vinculacion: { actividades: number; ejecutadas: number; pendientes: number; empresas: number };
  titulacion: { temas: number; graduados: number; pendientes: number };
}

export default function DashboardPage() {
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [selectedCarrera, setSelectedCarrera] = useState('all');
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch periodos and carreras on mount
  useEffect(() => {
    const fetchFilters = async () => {
      const [periodosRes, carrerasRes] = await Promise.all([
        supabase.from('periodos_academicos').select('*').order('fecha_inicio', { ascending: false }),
        supabase.from('carreras').select('*').eq('activa', true)
      ]);
      
      if (periodosRes.data) {
        setPeriodos(periodosRes.data);
        // Set default to active period or first period
        const activePeriodo = periodosRes.data.find(p => p.activo) || periodosRes.data[0];
        if (activePeriodo) setSelectedPeriodo(activePeriodo.id);
      }
      if (carrerasRes.data) setCarreras(carrerasRes.data);
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    if (!selectedPeriodo) return;
    
    const fetchKPIs = async () => {
      try {
        const periodoId = selectedPeriodo;

        // Fetch docencia KPIs
        const { data: silabos } = await supabase
          .from('silabos')
          .select('estado')
          .eq('periodo_id', periodoId);

        const docentiaKPIs = {
          cumplidos: silabos?.filter(s => s.estado === 'aprobado').length || 0,
          pendientes: silabos?.filter(s => s.estado === 'pendiente').length || 0,
          incumplidos: silabos?.filter(s => s.estado === 'rechazado').length || 0,
          cumplimiento: silabos ? Math.round((silabos.filter(s => s.estado === 'aprobado').length / silabos.length) * 100) : 0,
        };

        // Fetch investigacion KPIs
        const { data: investigaciones } = await supabase
          .from('investigaciones')
          .select('estado')
          .eq('periodo_id', periodoId);

        const investigacionKPIs = {
          activos: investigaciones?.filter(i => i.estado === 'en_progreso').length || 0,
          avanzados: investigaciones?.length || 0,
          revision: investigaciones?.filter(i => i.estado === 'completado').length || 0,
        };

        // Fetch estudiantes KPIs
        const { data: students } = await supabase
          .from('profiles')
          .select('*')
          .eq('rol_id', 'estudiante');

        const estudiantesKPIs = {
          matriculados: students?.length || 0,
          activos: students?.filter(s => s.activo).length || 0,
          retirados: students?.filter(s => !s.activo).length || 0,
          faltas: 0,
        };

        // Fetch practicas KPIs
        const { data: practicas } = await supabase
          .from('practicas_laboratorio')
          .select('*')
          .eq('periodo_id', periodoId);

        const practicasKPIs = {
          realizadas: practicas?.length || 0,
        };

        // Fetch vinculacion KPIs
        const { data: vinculacion } = await supabase
          .from('vinculacion_actividades')
          .select('*')
          .eq('periodo_id', periodoId);

        const vinculacionKPIs = {
          actividades: vinculacion?.length || 0,
          ejecutadas: vinculacion?.filter(v => v.estado === 'ejecutada').length || 0,
          pendientes: vinculacion?.filter(v => v.estado === 'pendiente').length || 0,
          empresas: 0,
        };

        // Fetch titulacion KPIs
        const { data: titulacion } = await supabase
          .from('titulacion_temas')
          .select('estado')
          .eq('periodo_id', periodoId);

        const titulacionKPIs = {
          temas: titulacion?.length || 0,
          graduados: titulacion?.filter(t => t.estado === 'graduado').length || 0,
          pendientes: titulacion?.filter(t => t.estado === 'en_desarrollo').length || 0,
        };

        setKpiData({
          docencia: docentiaKPIs,
          investigacion: investigacionKPIs,
          estudiantes: estudiantesKPIs,
          practicas: practicasKPIs,
          vinculacion: vinculacionKPIs,
          titulacion: titulacionKPIs,
        });
      } catch (error) {
        console.error('[v0] Error fetching KPIs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, [selectedPeriodo, selectedCarrera]);

  const chartData = [
    { name: 'Docencia', cumplimiento: kpiData?.docencia.cumplimiento || 0 },
    { name: 'Investigacion', cumplimiento: kpiData?.investigacion.activos || 0 },
    { name: 'Estudiantes', cumplimiento: Math.round((kpiData?.estudiantes.activos || 0) / (kpiData?.estudiantes.matriculados || 1) * 100) },
    { name: 'Vinculacion', cumplimiento: Math.round((kpiData?.vinculacion.ejecutadas || 0) / (kpiData?.vinculacion.actividades || 1) * 100) },
    { name: 'Titulacion', cumplimiento: Math.round((kpiData?.titulacion.graduados || 0) / (kpiData?.titulacion.temas || 1) * 100) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Filters */}
        <DashboardFilters
          periodos={periodos}
          carreras={carreras}
          selectedPeriodo={selectedPeriodo}
          selectedCarrera={selectedCarrera}
          onPeriodoChange={setSelectedPeriodo}
          onCarreraChange={setSelectedCarrera}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiData && (
            <>
              <KpiCard
                title="Docencia"
                value={`${kpiData.docencia.cumplimiento}%`}
                subtitle="Cumplimiento"
                icon="📚"
                stats={[
                  { label: 'Cumplidos', value: kpiData.docencia.cumplidos },
                  { label: 'Pendientes', value: kpiData.docencia.pendientes },
                  { label: 'Incumplidos', value: kpiData.docencia.incumplidos },
                ]}
              />
              <KpiCard
                title="Investigación"
                value={kpiData.investigacion.activos.toString()}
                subtitle="Proyectos Activos"
                icon="🔬"
                stats={[
                  { label: 'Activos', value: kpiData.investigacion.activos },
                  { label: 'Avanzados', value: kpiData.investigacion.avanzados },
                  { label: 'En Revisión', value: kpiData.investigacion.revision },
                ]}
              />
              <KpiCard
                title="Estudiantes"
                value={kpiData.estudiantes.matriculados.toString()}
                subtitle="Matriculados"
                icon="👥"
                stats={[
                  { label: 'Activos', value: kpiData.estudiantes.activos },
                  { label: 'Retirados', value: kpiData.estudiantes.retirados },
                ]}
              />
              <KpiCard
                title="Prácticas Lab"
                value={kpiData.practicas.realizadas.toString()}
                subtitle="Realizadas"
                icon="🧪"
              />
              <KpiCard
                title="Vinculación"
                value={kpiData.vinculacion.actividades.toString()}
                subtitle="Actividades"
                icon="🤝"
                stats={[
                  { label: 'Ejecutadas', value: kpiData.vinculacion.ejecutadas },
                  { label: 'Pendientes', value: kpiData.vinculacion.pendientes },
                ]}
              />
              <KpiCard
                title="Titulación"
                value={kpiData.titulacion.temas.toString()}
                subtitle="Temas en Proceso"
                icon="🎓"
                stats={[
                  { label: 'Graduados', value: kpiData.titulacion.graduados },
                  { label: 'Pendientes', value: kpiData.titulacion.pendientes },
                ]}
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cumplimiento por Área</CardTitle>
              <CardDescription>Porcentaje de cumplimiento del período {selectedPeriodo}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cumplimiento" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencia Temporal</CardTitle>
              <CardDescription>Evolución de indicadores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cumplimiento" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
