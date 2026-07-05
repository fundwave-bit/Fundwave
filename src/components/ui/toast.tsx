import { ReactNode, createContext, useContext, useState } from 'react'
import { X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  variant?: 'default' | 'destructive'
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, variant?: 'default' | 'destructive') => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, variant: 'default' | 'destructive' = 'default') => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, variant }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => removeToast(id), 3000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 p-4 rounded-lg shadow-lg pointer-events-auto ${
              toast.variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-sm hover:opacity-80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
