'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

/* ------------------------------------------------------------------ */
/* Variants & sizes                                                   */
/* ------------------------------------------------------------------ */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  // Brand gradient
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm hover:from-brand-600 hover:to-brand-700 focus-visible:ring-brand-400',
  // White / subtle border on gradient backgrounds
  secondary:
    'bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-300',
  // Transparent text-only
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300',
  // Outlined brand
  outline:
    'bg-transparent text-brand-700 border border-brand-300 hover:bg-brand-50 focus-visible:ring-brand-300',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-7 text-base gap-2.5 py-3',
}

/* ------------------------------------------------------------------ */
/* Loading spinner                                                    */
/* ------------------------------------------------------------------ */

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Button props                                                        */
/* ------------------------------------------------------------------ */

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Show a loading spinner and disable interaction. */
  loading?: boolean
  /** Optional leading icon node. */
  leftIcon?: React.ReactNode
  /** Optional trailing icon node. */
  rightIcon?: React.ReactNode
  /** Use width: 100%. */
  fullWidth?: boolean
}

/* ------------------------------------------------------------------ */
/* Button component                                                   */
/* ------------------------------------------------------------------ */

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          'disabled:cursor-not-allowed disabled:opacity-60',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner className="h-4 w-4" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span className={cn(loading && 'opacity-80')}>{children}</span>}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
