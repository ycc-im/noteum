import React from 'react'

interface MainContentProps {
  children: React.ReactNode
  className?: string
}

export function MainContent({ children, className = '' }: MainContentProps) {
  return (
    <main className={`flex-1 p-6 ${className}`}>
      {children}
    </main>
  )
}