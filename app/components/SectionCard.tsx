import React from 'react'

interface SectionCardProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

export default function SectionCard({ 
  title, 
  subtitle, 
  icon, 
  children 
}: SectionCardProps) {
  return (
    <div className="rounded-2xl bg-card/60 border border-white/5 p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {icon && (
          <div className="flex-shrink-0 w-6 h-6 text-accent">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-labco font-semibold text-fg text-base mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  )
}
