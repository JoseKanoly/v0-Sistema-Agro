"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type {
  Usuario,
  DocumentoEstudiante,
  Asistencia,
  Justificacion,
  Silabo,
  InformeAsignatura,
  ReporteVinculacion,
  TemaTitulacion,
  ProyectoInvestigacion,
  HitoInvestigacion,
  FechaLimite,
  Notificacion,
} from "@/lib/types/database"
import { USUARIOS_SEED } from "./users"
import {
  DOCUMENTOS_SEED,
  ASISTENCIAS_SEED,
  JUSTIFICACIONES_SEED,
  SILABOS_SEED,
  INFORMES_SEED,
  VINCULACION_SEED,
  TITULACION_SEED,
  PROYECTOS_INV_SEED,
  HITOS_INV_SEED,
  FECHAS_LIMITE_SEED,
  NOTIFICACIONES_SEED,
} from "./seed"

// =========================================
// Store global en memoria con notificaciones de cambio (sin localStorage)
// =========================================

interface DataState {
  usuarios: Usuario[]
  documentos: DocumentoEstudiante[]
  asistencias: Asistencia[]
  justificaciones: Justificacion[]
  silabos: Silabo[]
  informes: InformeAsignatura[]
  vinculacion: ReporteVinculacion[]
  titulacion: TemaTitulacion[]
  proyectos: ProyectoInvestigacion[]
  hitos: HitoInvestigacion[]
  fechasLimite: FechaLimite[]
  notificaciones: Notificacion[]
}

type Updater<T> = (prev: T[]) => T[]

interface DataContextValue extends DataState {
  setUsuarios: (u: Updater<Usuario>) => void
  setDocumentos: (u: Updater<DocumentoEstudiante>) => void
  setAsistencias: (u: Updater<Asistencia>) => void
  setJustificaciones: (u: Updater<Justificacion>) => void
  setSilabos: (u: Updater<Silabo>) => void
  setInformes: (u: Updater<InformeAsignatura>) => void
  setVinculacion: (u: Updater<ReporteVinculacion>) => void
  setTitulacion: (u: Updater<TemaTitulacion>) => void
  setProyectos: (u: Updater<ProyectoInvestigacion>) => void
  setHitos: (u: Updater<HitoInvestigacion>) => void
  setFechasLimite: (u: Updater<FechaLimite>) => void
  setNotificaciones: (u: Updater<Notificacion>) => void
  agregarNotificacion: (n: Omit<Notificacion, "id" | "fecha" | "leida">) => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuariosRaw] = useState<Usuario[]>(USUARIOS_SEED)
  const [documentos, setDocumentosRaw] = useState<DocumentoEstudiante[]>(DOCUMENTOS_SEED)
  const [asistencias, setAsistenciasRaw] = useState<Asistencia[]>(ASISTENCIAS_SEED)
  const [justificaciones, setJustificacionesRaw] = useState<Justificacion[]>(JUSTIFICACIONES_SEED)
  const [silabos, setSilabosRaw] = useState<Silabo[]>(SILABOS_SEED)
  const [informes, setInformesRaw] = useState<InformeAsignatura[]>(INFORMES_SEED)
  const [vinculacion, setVinculacionRaw] = useState<ReporteVinculacion[]>(VINCULACION_SEED)
  const [titulacion, setTitulacionRaw] = useState<TemaTitulacion[]>(TITULACION_SEED)
  const [proyectos, setProyectosRaw] = useState<ProyectoInvestigacion[]>(PROYECTOS_INV_SEED)
  const [hitos, setHitosRaw] = useState<HitoInvestigacion[]>(HITOS_INV_SEED)
  const [fechasLimite, setFechasLimiteRaw] = useState<FechaLimite[]>(FECHAS_LIMITE_SEED)
  const [notificaciones, setNotificacionesRaw] = useState<Notificacion[]>(NOTIFICACIONES_SEED)

  const setUsuarios = useCallback((u: Updater<Usuario>) => setUsuariosRaw(u), [])
  const setDocumentos = useCallback((u: Updater<DocumentoEstudiante>) => setDocumentosRaw(u), [])
  const setAsistencias = useCallback((u: Updater<Asistencia>) => setAsistenciasRaw(u), [])
  const setJustificaciones = useCallback((u: Updater<Justificacion>) => setJustificacionesRaw(u), [])
  const setSilabos = useCallback((u: Updater<Silabo>) => setSilabosRaw(u), [])
  const setInformes = useCallback((u: Updater<InformeAsignatura>) => setInformesRaw(u), [])
  const setVinculacion = useCallback((u: Updater<ReporteVinculacion>) => setVinculacionRaw(u), [])
  const setTitulacion = useCallback((u: Updater<TemaTitulacion>) => setTitulacionRaw(u), [])
  const setProyectos = useCallback((u: Updater<ProyectoInvestigacion>) => setProyectosRaw(u), [])
  const setHitos = useCallback((u: Updater<HitoInvestigacion>) => setHitosRaw(u), [])
  const setFechasLimite = useCallback((u: Updater<FechaLimite>) => setFechasLimiteRaw(u), [])
  const setNotificaciones = useCallback((u: Updater<Notificacion>) => setNotificacionesRaw(u), [])

  const agregarNotificacion = useCallback(
    (n: Omit<Notificacion, "id" | "fecha" | "leida">) => {
      setNotificacionesRaw((prev) => [
        {
          ...n,
          id: `not-${Date.now()}`,
          fecha: new Date().toISOString().slice(0, 10),
          leida: false,
        },
        ...prev,
      ])
    },
    [],
  )

  return (
    <DataContext.Provider
      value={{
        usuarios,
        documentos,
        asistencias,
        justificaciones,
        silabos,
        informes,
        vinculacion,
        titulacion,
        proyectos,
        hitos,
        fechasLimite,
        notificaciones,
        setUsuarios,
        setDocumentos,
        setAsistencias,
        setJustificaciones,
        setSilabos,
        setInformes,
        setVinculacion,
        setTitulacion,
        setProyectos,
        setHitos,
        setFechasLimite,
        setNotificaciones,
        agregarNotificacion,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData debe usarse dentro de DataProvider")
  return ctx
}
