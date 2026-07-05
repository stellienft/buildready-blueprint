'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'info'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 ring-gray-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  info: 'bg-brand-50 text-brand-700 ring-brand-200',
}

/* Dot color mapping used when `dot` is enabled. */
const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-brand-500',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  /** Render a leading status dot. */
  dot?: boolean
  /** Slightly larger pill (for headers / cards). */
  size?: 'sm' | 'md'
}

export function Badge({
  className,
  variant = 'default',
  dot = false,
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            dotClasses[variant],
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

export default Badge
