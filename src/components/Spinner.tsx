import React from 'react'
import { Loader2 } from 'lucide-react' // Keep this import
import { cn } from '../lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 
      className={cn('animate-spin text-amber-600', sizes[size], className)} 
    />
  )
}