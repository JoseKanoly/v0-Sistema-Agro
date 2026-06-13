"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInAction } from "@/app/actions/auth"
import { GraduationCap, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { credencialesDemo } from "@/lib/mock/users"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error("Ingrese su correo institucional"); return }
    setLoading(true)
    try {
      const res = await signInAction(email, password)
      if (!res.ok) {
        toast.error(res.error)
      } else {
        toast.success("Sesion iniciada correctamente")
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      toast.error("Error inesperado. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const loginAs = (correo: string) => {
    setEmail(correo)
    setPassword("demo1234")
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f2419] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#22c55e] flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-[#0f2419]" />
          </div>
          <div>
            <p className="text-[#d1fae5] font-bold text-lg leading-tight">SISPAA</p>
            <p className="text-[#6b9a7f] text-xs">Sistema de Gestion Academica</p>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-[#d1fae5] leading-tight text-balance">
            Gestion academica integral para su institucion
          </h1>
          <p className="text-[#6b9a7f] text-lg leading-relaxed text-pretty">
            Plataforma unificada para docentes, estudiantes, coordinadores y secretaria.
          </p>
          <div className="space-y-2">
            <p className="text-[#4a6b56] text-xs uppercase tracking-wider font-semibold mb-3">Accesos rapidos demo</p>
            <div className="grid grid-cols-1 gap-2">
              {credencialesDemo.map((c) => (
                <button
                  key={c.correo}
                  onClick={() => loginAs(c.correo)}
                  className="flex items-center justify-between bg-[#1a3d27] hover:bg-[#22c55e]/10 rounded-xl p-3 border border-[#1e3a2a] transition-colors text-left"
                >
                  <span className="text-[#22c55e] font-semibold text-sm">{c.rol}</span>
                  <span className="text-[#4a6b56] text-xs truncate ml-2">{c.correo}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-[#4a6b56] text-sm">&copy; {new Date().getFullYear()} SISPAA. Todos los derechos reservados.</p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#1a6b3c] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-[#0f172a]">SISPAA</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0f172a]">Iniciar sesion</h2>
              <p className="text-sm text-[#64748b] mt-1">Ingrese su correo institucional</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-[#0f172a]">Correo institucional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@uleam.edu.ec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 border-[#e2e8f0]"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-[#0f172a]">Contrasena</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 border-[#e2e8f0] pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0f172a]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#1a6b3c] hover:bg-[#155730] text-white font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Ingresando...
                  </span>
                ) : "Ingresar al sistema"}
              </Button>
            </form>
          </div>
          <p className="text-center text-xs text-[#94a3b8] mt-4">
            Use cualquier acceso rapido del panel izquierdo para ingresar como demo.
          </p>
        </div>
      </div>
    </div>
  )
}
