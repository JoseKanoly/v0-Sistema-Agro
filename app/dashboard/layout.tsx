import { redirect } from "next/navigation"
import { getCurrentPerfil } from "@/app/actions/auth"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const data = await getCurrentPerfil()
  if (!data?.user) redirect("/auth/login")

  const rol = (data.perfil?.rol ?? "estudiante") as
    | "super_admin" | "coordinador_carrera" | "coordinador_investigacion"
    | "docente" | "secretaria" | "estudiante"

  return (
    <DashboardShell rol={rol} userName={data.user.name} userEmail={data.user.email}>
      {children}
    </DashboardShell>
  )
}
