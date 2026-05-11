'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, BarChart3, BookOpen, Users, Microscope, Users2, Briefcase, GraduationCap, FlaskConical, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
  permission?: string;
}

interface SidebarNavProps {
  userRole: string;
  userName: string;
}

export function SidebarNav({ userRole, userName }: SidebarNavProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Vista general']);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const navItems: NavItem[] = [
    {
      label: 'Vista general',
      href: '/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    userRole !== 'estudiante' && {
      label: 'Docencia',
      icon: <BookOpen className="w-5 h-5" />,
      children: [
        { label: 'Informes de asignatura', href: '/dashboard/docencia/informes' },
        { label: 'Informes de sílabo', href: '/dashboard/docencia/silabos' },
      ],
    },
    (userRole === 'docente' || userRole === 'coordinador_carrera' || userRole === 'super_admin') && {
      label: 'Investigación',
      icon: <Microscope className="w-5 h-5" />,
      children: [
        { label: 'Informes', href: '/dashboard/investigacion/informes' },
      ],
    },
    userRole !== 'docente' && {
      label: 'Estudiantes',
      icon: <Users className="w-5 h-5" />,
      children: [
        { label: 'Estudiantes matriculados', href: '/dashboard/estudiantes/matriculados' },
        { label: 'Estudiantes activos', href: '/dashboard/estudiantes/activos' },
        { label: 'Estudiantes retirados', href: '/dashboard/estudiantes/retirados' },
        { label: 'Faltas', href: '/dashboard/estudiantes/faltas' },
        { label: 'Justificaciones de faltas', href: '/dashboard/estudiantes/justificaciones' },
      ],
    },
    (userRole === 'docente' || userRole === 'coordinador_carrera' || userRole === 'super_admin') && {
      label: 'Prácticas de Laboratorio',
      href: '/dashboard/laboratorio',
      icon: <FlaskConical className="w-5 h-5" />,
    },
    (userRole === 'docente' || userRole === 'coordinador_carrera' || userRole === 'super_admin') && {
      label: 'Vinculación',
      icon: <Users2 className="w-5 h-5" />,
      children: [
        { label: 'Líderes de vinculación', href: '/dashboard/vinculacion/lideres' },
      ],
    },
    (userRole === 'docente' || userRole === 'coordinador_carrera' || userRole === 'super_admin') && {
      label: 'Titulación',
      icon: <GraduationCap className="w-5 h-5" />,
      children: [
        { label: 'Temas en desarrollo', href: '/dashboard/titulacion/temas' },
      ],
    },
    userRole === 'super_admin' && {
      label: 'Administración',
      icon: <Settings className="w-5 h-5" />,
      children: [
        { label: 'Usuarios', href: '/dashboard/admin/usuarios' },
        { label: 'Carreras', href: '/dashboard/admin/carreras' },
        { label: 'Períodos', href: '/dashboard/admin/periodos' },
        { label: 'Permisos', href: '/dashboard/admin/permisos' },
      ],
    },
  ].filter(Boolean);

  const renderNavItem = (item: NavItem, isChild = false) => {
    if (!item) return null;

    const isExpanded = expandedItems.includes(item.label);
    const isActive = item.href && pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.label}>
        {item.href ? (
          <Link
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              isChild ? 'ml-4' : '',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ) : (
          <button
            onClick={() => toggleExpanded(item.label)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <span className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </span>
            {hasChildren && (
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform',
                  isExpanded && 'rotate-180'
                )}
              />
            )}
          </button>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map((child) => renderNavItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-sidebar border-r border-border h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">SISPAA</h1>
            <p className="text-xs text-muted-foreground">Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold">{userName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userRole}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full text-xs" asChild>
          <Link href="/auth/logout">Salir</Link>
        </Button>
      </div>
    </div>
  );
}
