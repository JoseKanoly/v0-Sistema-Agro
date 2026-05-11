'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  Save
} from 'lucide-react'

export default function ConfiguracionPage() {
  const [notificaciones, setNotificaciones] = useState(true)
  const [emailNotificaciones, setEmailNotificaciones] = useState(true)
  const [mantenimiento, setMantenimiento] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuracion del Sistema</h1>
          <p className="text-muted-foreground">Administra las configuraciones generales del sistema</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="notificaciones">
              <Bell className="w-4 h-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="seguridad">
              <Shield className="w-4 h-4 mr-2" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="sistema">
              <Database className="w-4 h-4 mr-2" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configuracion General</CardTitle>
                <CardDescription>Configuraciones basicas del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institucion">Nombre de la Institucion</Label>
                    <Input id="institucion" defaultValue="Universidad Laica Eloy Alfaro de Manabi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siglas">Siglas</Label>
                    <Input id="siglas" defaultValue="ULEAM" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email de Contacto</Label>
                    <Input id="email" type="email" defaultValue="contacto@uleam.edu.ec" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Telefono</Label>
                    <Input id="telefono" defaultValue="+593 5 2623 740" />
                  </div>
                </div>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificaciones">
            <Card>
              <CardHeader>
                <CardTitle>Configuracion de Notificaciones</CardTitle>
                <CardDescription>Gestiona como se envian las notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones en el sistema</Label>
                    <p className="text-sm text-muted-foreground">Mostrar notificaciones dentro de la plataforma</p>
                  </div>
                  <Switch checked={notificaciones} onCheckedChange={setNotificaciones} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por email</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificaciones al correo electronico</p>
                  </div>
                  <Switch checked={emailNotificaciones} onCheckedChange={setEmailNotificaciones} />
                </div>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguridad">
            <Card>
              <CardHeader>
                <CardTitle>Configuracion de Seguridad</CardTitle>
                <CardDescription>Opciones de seguridad del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Tiempo de sesion (minutos)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" className="w-32" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-intentos">Maximo de intentos de login</Label>
                  <Input id="max-intentos" type="number" defaultValue="5" className="w-32" />
                </div>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema">
            <Card>
              <CardHeader>
                <CardTitle>Configuracion del Sistema</CardTitle>
                <CardDescription>Opciones avanzadas del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">Activar el modo mantenimiento del sistema</p>
                  </div>
                  <Switch checked={mantenimiento} onCheckedChange={setMantenimiento} />
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Informacion del Sistema</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Version:</span> 1.0.0</p>
                    <p><span className="text-muted-foreground">Base de datos:</span> Supabase PostgreSQL</p>
                    <p><span className="text-muted-foreground">Ultima actualizacion:</span> 11 de Mayo, 2026</p>
                  </div>
                </div>
                <Button variant="destructive">
                  Limpiar Cache del Sistema
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
