"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sprout, KeyRound, Mail, User2 } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { CREDENCIALES_DEMO } from "@/lib/mock/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signIn(email, password)
    setLoading(false)
    if (result.ok) router.push("/dashboard")
    else setError(result.error)
  }

  const usarCuenta = (mail: string, pass: string) => {
    setEmail(mail)
    setPassword(pass)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel izquierdo - branding */}
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">SISPAA</p>
            <p className="text-xs opacity-80">Facultad de Agronomia - ULEAM</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-balance">
            Sistema Integral de Seguimiento de Procesos Academicos
          </h2>
          <p className="text-sm opacity-80 text-pretty">
            Gestion centralizada de docencia, vinculacion con la sociedad, investigacion y procesos de titulacion.
            Acceso por rol para super administrador, coordinadores, docentes, secretaria y estudiantes.
          </p>
        </div>

        <div className="space-y-3 rounded-lg bg-primary-foreground/5 p-4 text-xs">
          <p className="font-medium">Cuentas de demostracion</p>
          <div className="grid gap-2">
            {CREDENCIALES_DEMO.map((c) => (
              <button
                key={c.email}
                onClick={() => usarCuenta(c.email, c.password)}
                className="flex items-center justify-between gap-3 rounded-md bg-primary-foreground/5 px-3 py-2 text-left hover:bg-primary-foreground/10"
              >
                <span className="flex items-center gap-2">
                  <User2 className="h-3.5 w-3.5 opacity-70" />
                  <span className="font-medium">{c.rol}</span>
                </span>
                <span className="opacity-70">{c.email}</span>
              </button>
            ))}
          </div>
          <p className="opacity-70">Clave comun: <code className="font-mono">Sispaa2026!</code></p>
        </div>
      </div>

      {/* Panel derecho - login */}
      <div className="flex items-center justify-center bg-background p-6 md:p-10">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Iniciar sesion</CardTitle>
            <CardDescription>Ingresa tus credenciales institucionales para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo institucional</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu.correo@uleam.edu.ec"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contrasena</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9"
                  />
                </div>
              </div>
              {error ? (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
              ) : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>
              No tienes cuenta?{" "}
              <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
                Registrate
              </Link>
            </p>
            <p className="text-xs">
              Solo el super administrador puede crear cuentas de secretaria y coordinador.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
