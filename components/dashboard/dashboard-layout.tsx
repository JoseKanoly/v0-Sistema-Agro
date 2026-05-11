'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, LogOut, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth, usePermission } from '@/lib/auth/auth-context'
import { navigationConfig, filterNavigation, NavItem } from '@/lib/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

function NavItemComponent({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(isActive)
  const pathname = usePathname()

  if (item.children && item.children.length > 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={cn(
                'w-full justify-between',
                isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
              )}
            >
              <span className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </span>
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => (
                <SidebarMenuSubItem key={child.url}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === child.url}
                  >
                    <Link href={child.url}>
                      <child.icon className="h-4 w-4" />
                      <span>{child.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname === item.url}>
        <Link href={item.url}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function AppSidebar() {
  const { profile, role, permissions, signOut } = useAuth()
  const pathname = usePathname()
  
  const isSuperAdmin = role?.nombre === 'super_admin'
  const filteredNav = filterNavigation(navigationConfig, permissions, isSuperAdmin)

  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
  }

  return (
    <Sidebar variant="inset" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">SISPAA</span>
            <span className="text-xs text-muted-foreground">Platform</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {filteredNav.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.url || 
                    pathname.startsWith(item.url + '/') ||
                    item.children?.some(child => pathname === child.url)
                  
                  return (
                    <NavItemComponent 
                      key={item.url} 
                      item={item} 
                      isActive={isActive}
                    />
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {profile ? getInitials(profile.nombres, profile.apellidos) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left flex-1 min-w-0">
                <span className="text-sm font-medium truncate w-full">
                  {profile ? `${profile.nombres} ${profile.apellidos}` : 'Usuario'}
                </span>
                <span className="text-xs text-muted-foreground capitalize truncate w-full">
                  {role?.nombre?.replace('_', ' ') || 'Sin rol'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/perfil">Mi Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/notificaciones">
                <Bell className="mr-2 h-4 w-4" />
                Notificaciones
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/notificaciones">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
