'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  /** Helper text shown below the field when there is no error. */
  hint?: string
  error?: string
  /** Show a red ring and error message. */
  invalid?: boolean
  /** Auto-grow the textarea to fit content (max rows controlled by maxRows). */
  autoResize?: boolean
  maxRows?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      hint,
      error,
      invalid,
      id,
      required,
      disabled,
      autoResize = false,
      maxRows = 12,
      rows = 4,
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const textareaId = id ?? generatedId
    const describedById = `${textareaId}-desc`
    const hasError = Boolean(error) || invalid

    const internalRef = React.useRef<HTMLTextAreaElement | null>(null)
    React.useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement)

    const handleAutosize = React.useCallback(() => {
      const el = internalRef.current
      if (!el || !autoResize) return
      el.style.height = 'auto'
      const lineHeight = parseFloat(
        getComputedStyle(el).lineHeight || '24',
      )
      const maxHeight = lineHeight * maxRows
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    }, [autoResize, maxRows])

    React.useEffect(() => {
      handleAutosize()
    }, [handleAutosize])

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-0.5 text-brand-600">*</span>}
          </label>
        )}

        <textarea
          ref={internalRef}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          aria-invalid={hasError || undefined}
          aria-describedby={hint || error ? describedById : undefined}
          required={required}
          onChange={(e) => {
            onChange?.(e)
            handleAutosize()
          }}
          className={cn(
            'w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
            'shadow-sm transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-60',
            !autoResize && 'min-h-[5rem]',
            hasError
              ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
              : 'border-gray-200 focus:border-brand-400 focus:ring-brand-200',
            className,
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea'

export default Textarea
