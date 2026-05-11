"use client"

import { useAuth } from "@/lib/auth/auth-context"
import type { UserRole } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

interface AccessGuardProps {
  roles: UserRole[]
  children: React.ReactNode
}

export function AccessGuard({ roles, children }: AccessGuardProps) {
  const { user } = useAuth()
  if (!user) return null
  if (!roles.includes(user.rol)) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <CardTitle>Acceso restringido</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta seccion no esta disponible para tu rol actual.
          </p>
        </CardContent>
      </Card>
    )
  }
  return <>{children}</>
}
