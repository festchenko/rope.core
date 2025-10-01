import React from 'react'
import { Home, Bell, List, Settings } from 'lucide-react'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

function NavItem({ icon, label, isActive = false }: NavItemProps) {
  return (
    <button
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
        isActive 
          ? 'text-accent bg-accent/10' 
          : 'text-muted hover:text-fg hover:bg-white/5'
      }`}
      aria-label={label}
    >
      <div className="w-5 h-5" aria-hidden="true">
        {icon}
      </div>
      <span className="text-xs font-medium">
        {label}
      </span>
    </button>
  )
}

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-sm border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        <NavItem 
          icon={<Home className="w-full h-full" />} 
          label="Home" 
          isActive={true} 
        />
        <NavItem 
          icon={<Bell className="w-full h-full" />} 
          label="Alerts" 
        />
        <NavItem 
          icon={<List className="w-full h-full" />} 
          label="Logs" 
        />
        <NavItem 
          icon={<Settings className="w-full h-full" />} 
          label="Settings" 
        />
      </div>
    </nav>
  )
}
