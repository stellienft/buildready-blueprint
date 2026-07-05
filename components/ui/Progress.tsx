'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ProgressProps {
  /** 1-indexed current step number. */
  current: number
  /** Total number of steps. */
  total: number
  /** Optional accessible label template; `{current}` and `{total}` are interpolated. */
  label?: string
  className?: string
  /** Show the numeric "current / total" caption beside the bar. */
  showCaption?: boolean
}

export function Progress({
  current,
  total,
  label = 'Step {current} of {total}',
  className,
  showCaption = true,
}: ProgressProps) {
  const safeTotal = Math.max(total, 1)
  const clamped = Math.min(Math.max(current, 0), safeTotal)
  const pct = Math.round((clamped / safeTotal) * 100)
  const ariaLabel = label
    .replace('{current}', String(clamped))
    .replace('{total}', String(safeTotal))

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">{ariaLabel}</span>
        {showCaption && (
          <span className="text-xs tabular-nums text-gray-500">{pct}%</span>
        )}
      </div>

      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-label={ariaLabel}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {Array.from({ length: safeTotal }).map((_, i) => {
          const step = i + 1
          const done = step <= clamped
          return (
            <span
              key={step}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                done
                  ? 'w-6 bg-brand-500'
                  : 'w-1.5 bg-gray-200',
              )}
              aria-hidden="true"
            />
          )
        })}
      </div>
    </div>
  )
}

export default Progress
