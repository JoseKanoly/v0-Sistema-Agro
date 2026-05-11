"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, X } from "lucide-react"

interface Props {
  onApprove: () => void
  onReject: (motivo: string) => void
  disabled?: boolean
}

export function ReviewActions({ onApprove, onReject, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const [motivo, setMotivo] = useState("")

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={onApprove} disabled={disabled}>
        <Check className="mr-1 h-3.5 w-3.5" /> Aprobar
      </Button>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)} disabled={disabled} className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
        <X className="mr-1 h-3.5 w-3.5" /> Rechazar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo del rechazo</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Indica al solicitante por que se rechaza..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (!motivo.trim()) return
                onReject(motivo.trim())
                setOpen(false)
                setMotivo("")
              }}
            >
              Confirmar rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
