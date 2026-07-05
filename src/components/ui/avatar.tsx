import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <div
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function AvatarImage({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      className={cn('aspect-square h-full w-full', className)}
      {...props}
    />
  )
}

export function AvatarFallback({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-muted text-sm font-medium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
