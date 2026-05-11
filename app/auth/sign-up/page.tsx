"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sprout } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { CARRERAS } from "@/lib/mock/carreras"
import type { CarreraId } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SignUpPage() {
  const router = useRouter()
  const { registerEstudianteDocente } = useAuth()
  const [nombres, setNombres] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [cedula, setCedula] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [carrera, setCarrera] = useState<CarreraId>("agropecuaria")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const detectedRole = email.toLowerCase().endsWith("@live.uleam.edu.ec")
    ? "Estudiante"
    : email.toLowerCase().endsWith("@uleam.edu.ec")
      ? "Docente"
      : null

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.")
      setLoading(false)
      return
    }
    const res = await registerEstudianteDocente({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      cedula: cedula.trim(),
      email: email.trim(),
      password,
      carrera_id: carrera,
    })
    setLoading(false)
    if (res.ok) router.push("/dashboard")
    else setError(res.error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Registro institucional</CardTitle>
              <CardDescription>Crea tu cuenta SISPAA</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handle} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <Input id="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula">Cedula</Label>
              <Input id="cedula" value={cedula} onChange={(e) => setCedula(e.target.value)} maxLength={10} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo institucional</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@uleam.edu.ec"
                required
              />
              <p className="text-xs text-muted-foreground">
                Usa <code>@uleam.edu.ec</code> para docente o <code>@live.uleam.edu.ec</code> para estudiante.
                {detectedRole ? <span className="ml-2 font-medium text-primary">Rol detectado: {detectedRole}</span> : null}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera</Label>
              <Select value={carrera} onValueChange={(v) => setCarrera(v as CarreraId)}>
                <SelectTrigger id="carrera">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARRERAS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            {error ? (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="ml-1 font-medium text-primary hover:underline">
            Inicia sesion
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
