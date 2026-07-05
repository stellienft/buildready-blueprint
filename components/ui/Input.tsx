'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  /** Helper text shown below the input when there is no error. */
  hint?: string
  error?: string
  /** Show a red ring and error message. */
  invalid?: boolean
  /** Optional icon node rendered before the input value. */
  leftIcon?: React.ReactNode
  /** Optional icon node rendered after the input value. */
  rightIcon?: React.ReactNode
  /** Size control for padding/height. */
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'h-9 text-sm',
  md: 'h-11 text-sm',
  lg: 'h-13 text-base',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      invalid,
      leftIcon,
      rightIcon,
      id,
      size = 'md',
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const describedById = `${inputId}-desc`
    const hasError = Boolean(error) || invalid

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-0.5 text-brand-600">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-gray-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={hint || error ? describedById : undefined}
            required={required}
            className={cn(
              'w-full rounded-lg border bg-white px-3.5 text-gray-900 placeholder:text-gray-400',
              'shadow-sm transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-60',
              sizeClasses[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              hasError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-gray-200 focus:border-brand-400 focus:ring-brand-200',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

        {(hint || error) && (
          <p
            id={describedById}
            className={cn(
              'mt-1.5 text-xs',
              hasError ? 'text-red-600' : 'text-gray-500',
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
