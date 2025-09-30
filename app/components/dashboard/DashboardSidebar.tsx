'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  GraduationCap,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Building2,
  Target,
  Eye,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserButton } from '@clerk/nextjs'

const menuItems = [
  {
    title: 'Tableau de bord',
    icon: Home,
    href: '/dashboard',
  },
  {
    title: 'Formations',
    icon: GraduationCap,
    children: [
      { title: 'Gestion catalogue public', href: '/admin/catalogue', icon: Globe },
      { title: 'Programmes catalogue', href: '/admin/programmes', icon: BookOpen },
      { title: 'Programmes personnalisés', href: '/admin/programmes-personnalises', icon: Target },
      { title: 'Catégories', href: '/admin/categories', icon: ClipboardList },
      { title: 'Voir catalogue public', href: '/catalogue', icon: Eye, external: true },
    ]
  },
  {
    title: 'Apprenants',
    icon: Users,
    children: [
      { title: 'Gestion des apprenants', href: '/dashboard/apprenants', icon: Users },
      { title: 'Dossiers de formation', href: '/dashboard/apprenants/dossiers', icon: FileText },
      { title: 'Positionnements', href: '/dashboard/apprenants/positionnements', icon: UserCheck },
    ]
  },
  {
    title: 'Rendez-vous',
    icon: Calendar,
    href: '/rendezvous-positionnement',
  },
  {
    title: 'Veille & Actualités',
    icon: Eye,
    href: '/dashboard/veille',
  },
  {
    title: 'Qualité',
    icon: BarChart3,
    children: [
      { title: 'Réclamations', href: '/dashboard/qualite/reclamations', icon: AlertTriangle },
      { title: 'Actions correctives', href: '/dashboard/qualite/actions-correctives', icon: ClipboardList },
      { title: 'Conformité', href: '/dashboard/qualite/conformite', icon: FileText },
    ]
  },
  {
    title: 'Administration',
    icon: Settings,
    children: [
      { title: 'Général', href: '/admin', icon: Settings },
      { title: 'Catégories', href: '/admin/categories', icon: ClipboardList },
      { title: 'Paramètres', href: '/admin', icon: Settings },
    ]
  },
  {
    title: 'Support',
    icon: HelpCircle,
    href: '/dashboard/support',
  },
]

interface SidebarItemProps {
  item: typeof menuItems[0]
  isCollapsed: boolean
}

function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = pathname === item.href
  const hasActiveChild = item.children?.some(child => pathname === child.href)

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            (hasActiveChild || isOpen) && 'bg-gray-100 dark:bg-gray-800'
          )}
        >
          <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )} />
            </>
          )}
        </button>

        {!isCollapsed && isOpen && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                target={child.external ? '_blank' : undefined}
                rel={child.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  pathname === child.href && 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                )}
              >
                <child.icon className="h-4 w-4 mr-3" />
                <span>{child.title}</span>
                {child.external && <span className="ml-1 text-xs">↗</span>}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isActive && 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
      )}
    >
      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  )
}

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-transform',
        'lg:translate-x-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        isCollapsed ? 'w-16' : 'w-64'
      )}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed && (
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">GestionMax</span>
              </div>
            )}

            {/* Collapse button - desktop only */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>

            {/* Close button - mobile only */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          {!isCollapsed && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Centre de formation</p>
                  <p className="text-xs text-gray-600">Administrateur</p>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.title}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

          {/* Quick stats */}
          {!isCollapsed && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Formations actives</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Apprenants</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">156</Badge>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}