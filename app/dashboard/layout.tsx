import { redirect } from "next/navigation"
import { getCurrentPerfil } from "@/app/actions/auth"
import { DashboardShell } from "@/components/layout/dashboard-shell"

type Rol = "super_admin" | "coordinador_carrera" | "coordinador_investigacion" | "docente" | "secretaria" | "estudiante"

const ROL_MAP: Record<string, Rol> = {
  super_admin: "super_admin",
  administrador: "super_admin",
  coordinador: "coordinador_carrera",
  docente: "docente",
  secretaria: "secretaria",
  estudiante: "estudiante",
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const data = await getCurrentPerfil()
  if (!data?.user) redirect("/auth/login")

  const rawRol = (data.perfil?.rol ?? "estudiante").toLowerCase()
  const rol: Rol = ROL_MAP[rawRol] ?? "estudiante"

  return (
    <DashboardShell rol={rol} userName={data.user.name} userEmail={data.user.email}>
      {children}
    </DashboardShell>
  )
}
