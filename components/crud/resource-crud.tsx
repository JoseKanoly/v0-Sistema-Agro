"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { CrudModal } from "@/components/ui/crud-modal"
import { ExportButtons } from "@/components/ui/export-buttons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { exportToPDF, exportToExcel, type ExportColumn } from "@/lib/utils/export"

export type FieldType = "text" | "number" | "email" | "date" | "textarea" | "select"

export interface CrudField<T> {
  name: Extract<keyof T, string>
  label: string
  type?: FieldType
  required?: boolean
  placeholder?: string
  options?: { value: string | number; label: string }[]
  step?: string
  defaultValue?: string | number
  full?: boolean
}

export interface CrudColumn<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  exportAccessor?: (row: T) => string | number
}

interface Identifiable {
  id: number
}

export interface CrudService<T extends Identifiable> {
  getAll: () => Promise<T[]>
  create: (item: Omit<T, "id">) => Promise<T>
  update: (id: number, patch: Partial<T>) => Promise<T | undefined>
  delete: (id: number) => Promise<boolean>
}

interface ResourceCrudProps<T extends Identifiable> {
  title: string
  description?: string
  service: CrudService<T>
  fields: CrudField<T>[]
  columns: CrudColumn<T>[]
  searchKeys?: string[]
  exportName?: string
  itemLabel?: string
  readOnly?: boolean
  stats?: (rows: T[]) => React.ReactNode
  filter?: (row: T) => boolean
  defaults?: Partial<T>
}

function defaultForm<T>(fields: CrudField<T>[]): Record<string, string> {
  const f: Record<string, string> = {}
  for (const field of fields) {
    if (field.defaultValue !== undefined) f[field.name] = String(field.defaultValue)
    else if (field.type === "select" && field.options?.length) f[field.name] = String(field.options[0].value)
    else f[field.name] = ""
  }
  return f
}

export function ResourceCrud<T extends Identifiable>({
  title,
  description,
  service,
  fields,
  columns,
  searchKeys = [],
  exportName,
  itemLabel = "registro",
  readOnly = false,
  stats,
  filter,
  defaults,
}: ResourceCrudProps<T>) {
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await service.getAll()
    setRows(filter ? data.filter(filter) : data)
    setLoading(false)
  }, [service, filter])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm(defaultForm(fields))
    setModalOpen(true)
  }

  const openEdit = (row: T) => {
    setEditing(row)
    const f: Record<string, string> = {}
    for (const field of fields) {
      const v = (row as Record<string, unknown>)[field.name]
      f[field.name] = v === null || v === undefined ? "" : String(v)
    }
    setForm(f)
    setModalOpen(true)
  }

  const coerce = (field: CrudField<T>, value: string): unknown => {
    if (field.type === "number") return value === "" ? 0 : Number(value)
    if (field.type === "select" && field.options?.length) {
      const sample = field.options[0].value
      if (typeof sample === "number") return value === "" ? null : Number(value)
      if (typeof sample === "boolean") return value === "true"
    }
    return value
  }

  const handleSubmit = async () => {
    for (const field of fields) {
      if (field.required && !form[field.name]) {
        toast.error(`El campo "${field.label}" es obligatorio`)
        return
      }
    }
    setSaving(true)
    const payload: Record<string, unknown> = {}
    for (const field of fields) {
      payload[field.name] = coerce(field, form[field.name] ?? "")
    }
    try {
      if (editing) {
        await service.update(editing.id, payload as Partial<T>)
        toast.success(`${capitalize(itemLabel)} actualizado correctamente`)
      } else {
        await service.create({ ...defaults, ...payload } as Omit<T, "id">)
        toast.success(`${capitalize(itemLabel)} creado correctamente`)
      }
      setModalOpen(false)
      await load()
    } catch {
      toast.error("Ocurrió un error al guardar")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setSaving(true)
    try {
      await service.delete(deleteTarget.id)
      toast.success(`${capitalize(itemLabel)} eliminado`)
      setDeleteTarget(null)
      await load()
    } catch {
      toast.error("No se pudo eliminar")
    } finally {
      setSaving(false)
    }
  }

  const exportColumns: ExportColumn<T>[] = columns.map((c) => ({
    header: c.header,
    accessor: c.exportAccessor ?? ((row: T) => String((row as Record<string, unknown>)[c.key] ?? "")),
  }))

  const tableColumns = readOnly
    ? columns
    : [
        ...columns,
        {
          key: "__acciones",
          header: "Acciones",
          render: (row: T) => (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openEdit(row)}
                className="p-1.5 rounded-lg text-[#1a6b3c] hover:bg-green-50 transition-colors"
                aria-label="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ),
        },
      ]

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {rows.length > 0 && (
              <ExportButtons
                onExportPDF={() => exportToPDF(exportName ?? title, title, exportColumns, rows)}
                onExportExcel={() => exportToExcel(exportName ?? title, title, exportColumns, rows)}
              />
            )}
            {!readOnly && (
              <Button onClick={openCreate} className="h-8 text-xs gap-1.5 bg-[#1a6b3c] hover:bg-[#155730] text-white">
                <Plus className="w-3.5 h-3.5" />
                Agregar
              </Button>
            )}
          </>
        }
      />

      {stats && rows.length > 0 && <div className="mb-6">{stats(rows)}</div>}

      {loading ? (
        <div className="py-16 text-center text-[#64748b] text-sm">Cargando...</div>
      ) : (
        <DataTable
          data={tableColumns ? (rows as Record<string, unknown>[]) : []}
          columns={tableColumns as never}
          searchKeys={searchKeys}
          emptyMessage={`No hay ${itemLabel}s registrados`}
        />
      )}

      <CrudModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Editar ${itemLabel}` : `Nuevo ${itemLabel}`}
        onSubmit={handleSubmit}
        loading={saving}
        size="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name} className={field.full || field.type === "textarea" ? "sm:col-span-2" : ""}>
              <Label className="text-xs font-medium text-[#475569] mb-1.5 block">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </Label>
              {field.type === "select" ? (
                <select
                  value={form[field.name] ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))}
                  className="w-full h-9 rounded-md border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <Textarea
                  value={form[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))}
                  className="bg-white border-[#e2e8f0] min-h-20"
                />
              ) : (
                <Input
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : "text"}
                  step={field.step}
                  value={form[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))}
                  className="bg-white border-[#e2e8f0] h-9"
                />
              )}
            </div>
          ))}
        </div>
      </CrudModal>

      <CrudModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={`Eliminar ${itemLabel}`}
        onSubmit={confirmDelete}
        submitLabel="Eliminar"
        loading={saving}
        size="sm"
      >
        <p className="text-sm text-[#475569]">
          ¿Estás seguro de que deseas eliminar este {itemLabel}? Esta acción no se puede deshacer.
        </p>
      </CrudModal>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
