"use client"

import { Sidebar } from "./sidebar"

type Rol = "super_admin" | "coordinador_carrera" | "coordinador_investigacion" | "docente" | "secretaria" | "estudiante"

interface DashboardShellProps {
  children: React.ReactNode
  rol: Rol
  userName: string
  userEmail: string
}

export function DashboardShell({ children, rol, userName, userEmail }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <Sidebar rol={rol} userName={userName} userEmail={userEmail} />
      <main className="lg:pl-60">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
