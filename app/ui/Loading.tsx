import React from 'react'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent"></div>
        <p className="text-lg font-medium text-[var(--muted-foreground)]">
          Loading...
        </p>
      </div>
    </div>
  )
}
