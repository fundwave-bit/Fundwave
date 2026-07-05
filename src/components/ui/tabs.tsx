import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  children: ReactNode
}

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

export function Tabs({ defaultValue, children, className, ...props }: TabsProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; children: ReactNode }) {
  const { value: activeValue, onValueChange } = useTabs()
  const isActive = value === activeValue

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive && 'bg-background text-foreground shadow-sm',
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string; children: ReactNode }) {
  const { value: activeValue } = useTabs()

  if (value !== activeValue) return null

  return (
    <div className={cn('mt-2 ring-offset-background', className)} {...props}>
      {children}
    </div>
  )
}

import React from 'react'
