"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FileText, Upload, Clock, CheckCircle, XCircle, Plus, Eye, Download } from "lucide-react"
import { toast } from "sonner"

type DocEstado = "pendiente" | "aprobado" | "rechazado"
type DocTipo = "matricula" | "cedula" | "titulo_bachiller" | "foto" | "certificado_medico" | "otros"

interface Documento {
  id: number
  nombre: string
  tipo: DocTipo
  estado: DocEstado
  fechaSubida: string
  observacion: string
}

const TIPO_LABEL: Record<DocTipo, string> = {
  matricula: "Comprobante matricula",
  cedula: "Cedula de identidad",
  titulo_bachiller: "Titulo bachillerato",
  foto: "Fotografia",
  certificado_medico: "Certificado medico",
  otros: "Otros",
}

const ESTADO_COLOR: Record<DocEstado, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
}
const ESTADO_ICON: Record<DocEstado, React.ElementType> = {
  pendiente: Clock,
  aprobado: CheckCircle,
  rechazado: XCircle,
}

const initialDocs: Documento[] = [
  { id: 1, nombre: "cedula_andres_mero.pdf", tipo: "cedula", estado: "aprobado", fechaSubida: "2026-01-10", observacion: "" },
  { id: 2, nombre: "titulo_bachiller_andres_mero.pdf", tipo: "titulo_bachiller", estado: "aprobado", fechaSubida: "2026-01-10", observacion: "" },
  { id: 3, nombre: "comprobante_matricula_2026A.pdf", tipo: "matricula", estado: "pendiente", fechaSubida: "2026-02-01", observacion: "En proceso de verificacion" },
  { id: 4, nombre: "foto_carnet.jpg", tipo: "foto", estado: "rechazado", fechaSubida: "2026-01-15", observacion: "La foto no cumple con los requisitos de tamano" },
]

export default function MisDocumentosPage() {
  const [docs, setDocs] = useState<Documento[]>(initialDocs)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: "", tipo: "cedula" as DocTipo })
  let nextId = docs.length + 1

  const handleUpload = () => {
    if (!form.nombre) { toast.error("Ingrese el nombre del archivo"); return }
    const newDoc: Documento = {
      id: nextId++,
      nombre: form.nombre,
      tipo: form.tipo,
      estado: "pendiente",
      fechaSubida: new Date().toISOString().split("T")[0],
      observacion: "",
    }
    setDocs((prev) => [newDoc, ...prev])
    setForm({ nombre: "", tipo: "cedula" })
    setOpen(false)
    toast.success("Documento subido, pendiente de revision")
  }

  const pendientes = docs.filter((d) => d.estado === "pendiente").length
  const aprobados = docs.filter((d) => d.estado === "aprobado").length
  const rechazados = docs.filter((d) => d.estado === "rechazado").length

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Mis Documentos</h1>
          <p className="text-[#64748b] mt-1">Documentos personales y academicos requeridos</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-[#1a6b3c] hover:bg-[#155730] text-white">
          <Upload className="w-4 h-4 mr-2" />Subir documento
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pendientes", value: pendientes, color: "#f59e0b", Icon: Clock },
          { label: "Aprobados", value: aprobados, color: "#22c55e", Icon: CheckCircle },
          { label: "Rechazados", value: rechazados, color: "#ef4444", Icon: XCircle },
        ].map((s) => (
          <Card key={s.label} className="border-[#e2e8f0]">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#64748b]">{s.label}</p>
                <p className="text-2xl font-bold text-[#0f172a]">{s.value}</p>
              </div>
              <s.Icon className="w-5 h-5" style={{ color: s.color }} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3">
        {docs.map((d) => {
          const Icon = ESTADO_ICON[d.estado]
          return (
            <Card key={d.id} className="border-[#e2e8f0]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#64748b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-[#0f172a] truncate">{d.nombre}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_COLOR[d.estado]}`}>
                        <Icon className="w-3 h-3" />{d.estado}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b] mt-0.5">{TIPO_LABEL[d.tipo]} &middot; Subido el {d.fechaSubida}</p>
                    {d.observacion && (
                      <p className="text-xs text-[#f59e0b] mt-1 font-medium">{d.observacion}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => toast.info("Vista previa no disponible en demo")}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toast.info("Descarga no disponible en demo")}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Lista de documentos requeridos */}
      <Card className="border-[#e2e8f0]">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#0f172a] mb-3">Documentos requeridos para matricula</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {Object.entries(TIPO_LABEL).map(([key, label]) => {
              const hasDoc = docs.some((d) => d.tipo === key && d.estado === "aprobado")
              return (
                <div key={key} className={`flex items-center gap-2 p-2 rounded-lg border ${hasDoc ? "border-[#1a6b3c] bg-[#f0fdf4]" : "border-[#e2e8f0] bg-[#f8fafc]"}`}>
                  {hasDoc
                    ? <CheckCircle className="w-4 h-4 text-[#1a6b3c] flex-shrink-0" />
                    : <XCircle className="w-4 h-4 text-[#94a3b8] flex-shrink-0" />}
                  <span className={`text-sm ${hasDoc ? "text-[#1a6b3c] font-medium" : "text-[#64748b]"}`}>{label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Subir documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Tipo de documento</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as DocTipo })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_LABEL).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Nombre del archivo *</Label>
              <Input placeholder="nombre_archivo.pdf" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-6 text-center">
              <Upload className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
              <p className="text-sm text-[#64748b]">Arrastra el archivo aqui o haz clic para seleccionar</p>
              <p className="text-xs text-[#94a3b8] mt-1">PDF, JPG, PNG &middot; Max 5MB</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button className="bg-[#1a6b3c] hover:bg-[#155730] text-white" onClick={handleUpload}>
              <Plus className="w-4 h-4 mr-2" />Subir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
