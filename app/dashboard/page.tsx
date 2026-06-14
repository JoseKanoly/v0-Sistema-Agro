import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BookOpen, Bell, GraduationCap, LogOut } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/auth/login")

  const menuItems = [
    { name: "Mi Perfil", href: "/dashboard/perfil", icon: GraduationCap },
    { name: "Mis Asistencias", href: "/dashboard/mis-asistencias", icon: BookOpen },
    { name: "Notificaciones", href: "/dashboard/notificaciones", icon: Bell },
    { name: "Mis Documentos", href: "/dashboard/mis-documentos", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0f172a]">
            Bienvenido, {session.user.name}! 👋
          </h1>
          <p className="text-[#64748b] mt-2">
            Sistema Académico de Gestión Integral
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8 border-[#e2e8f0] bg-gradient-to-r from-[#0f2419] to-[#1a3d27]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="text-white">
                <p className="text-sm text-[#a7f3d0] font-medium">CUENTA ACTIVA</p>
                <h2 className="text-2xl font-bold mt-2">{session.user.email}</h2>
                <p className="text-[#6b9a7f] text-sm mt-1">Tu sesión está activa y lista para usar</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#22c55e] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#0f2419]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="border-[#e2e8f0] hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1a6b3c]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#1a6b3c]" />
                      </div>
                      <p className="font-medium text-[#0f172a] text-sm">{item.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Info Section */}
        <Card className="border-[#e2e8f0]">
          <CardHeader>
            <CardTitle className="text-[#0f172a]">Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-[#64748b]">ID de Usuario</p>
                <p className="text-[#0f172a] font-mono text-sm mt-1">{session.user.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#64748b]">Estado</p>
                <p className="text-[#0f172a] text-sm mt-1">
                  {session.user.emailVerified ? "✅ Verificado" : "⏳ Pendiente de verificación"}
                </p>
              </div>
            </div>
            <hr className="border-[#e2e8f0]" />
            <p className="text-xs text-[#94a3b8]">
              Sistema de Gestión Académica - SISPAA © 2026
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
