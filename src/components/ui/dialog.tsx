import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('Dialog components must be used within Dialog')
  }
  return context
}

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(open)
  const isControlled = onOpenChange !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setOpen = isControlled ? onOpenChange : setInternalOpen

  return (
    <DialogContext.Provider value={{ open: dialogOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ asChild, children, ...props }: any) {
  const { setOpen } = useDialog()

  if (asChild) {
    return children
  }

  return (
    <Button onClick={() => setOpen(true)} {...props}>
      {children}
    </Button>
  )
}

export function DialogContent({
  className,
  children,
  onEscapeKeyDown,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onEscapeKeyDown?: (e: KeyboardEvent) => void }) {
  const { open, setOpen } = useDialog()
  const [React, setReact] = useState(0) // Import React below

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onEscapeKeyDown?.(e)
      setOpen(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onEscapeKeyDown, setOpen])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
}

export function DialogHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props}>
      {children}
    </div>
  )
}

export function DialogFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({
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

export function DialogDescription({
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
