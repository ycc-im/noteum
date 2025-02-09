import React from 'react'
import { cn } from '../src/lib/utils'

export const withThemeProvider = (Story: React.ComponentType) => {
  return (
    <div className={cn(
      "min-h-screen",
      "bg-background text-foreground",
      "[&:has([data-theme=dark])]:bg-slate-950",
      "[&:has([data-theme=dark])]:text-slate-50",
    )}>
      <Story />
    </div>
  )
}
