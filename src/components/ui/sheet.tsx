import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

interface SheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined)

function useSheet() {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('Sheet components must be used within Sheet')
  }
  return context
}

export function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(open)
  const isControlled = onOpenChange !== undefined
  const sheetOpen = isControlled ? open : internalOpen
  const setOpen = isControlled ? onOpenChange : setInternalOpen

  return (
    <SheetContext.Provider value={{ open: sheetOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

export function SheetTrigger({ asChild, children, ...props }: any) {
  const { setOpen } = useSheet()

  if (asChild) {
    return children
  }

  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  )
}

export function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { side?: 'left' | 'right' }) {
  const { open, setOpen } = useSheet()

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'fixed top-0 z-50 gap-4 bg-background p-6 shadow-lg w-3/4 sm:w-1/2 md:w-1/3 transition-transform',
          side === 'right' ? 'right-0 h-full animate-in slide-in-from-right' : 'left-0 h-full animate-in slide-in-from-left',
          className
        )}
        {...props}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </>
  )
}

export function SheetHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props}>
      {children}
    </div>
  )
}

export function SheetFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)} {...props}>
      {children}
    </div>
  )
}

export function SheetTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props}>
      {children}
    </h2>
  )
}

export function SheetDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}

import React from 'react'
