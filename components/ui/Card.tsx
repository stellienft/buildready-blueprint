import * as React from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Card — rounded-2xl surface with a soft shadow and hairline border.
 * The default styling follows the clean, Stitch-inspired aesthetic.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render with the frosted-glass style (use over gradient/image backgrounds). */
  glass?: boolean
  /** Remove default padding. */
  noPadding?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, noPadding = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-shadow',
          glass
            ? 'border border-white/60 bg-white/70 shadow-card backdrop-blur-xl'
            : 'border border-gray-100 bg-white shadow-card',
          !noPadding && 'p-6',
          className,
        )}
        {...props}
      />
    )
  },
)

Card.displayName = 'Card'

export default Card

/** Optional convenience sub-components for header/body/footer layout. */

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-4 flex flex-col gap-1', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-display text-lg font-semibold leading-tight text-gray-900',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm text-gray-700', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-4 flex items-center gap-2', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'
