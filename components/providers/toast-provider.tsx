"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

type ToastType = "success" | "error" | "info" | "warning" | "loading"

interface ToastOptions {
  description?: React.ReactNode
  duration?: number
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, options?: ToastOptions) => void
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  info: (message: string, options?: ToastOptions) => void
  warning: (message: string, options?: ToastOptions) => void
  loading: (message: string, options?: ToastOptions) => string | number
  dismiss: (id?: string | number) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = React.useCallback((message: string, type: ToastType = "info", options?: ToastOptions) => {
    sonnerToast[type](message, options)
  }, [])

  const success = React.useCallback((message: string, options?: ToastOptions) => {
    sonnerToast.success(message, options)
  }, [])

  const error = React.useCallback((message: string, options?: ToastOptions) => {
    sonnerToast.error(message, options)
  }, [])

  const info = React.useCallback((message: string, options?: ToastOptions) => {
    sonnerToast.info(message, options)
  }, [])

  const warning = React.useCallback((message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, options)
  }, [])

  const loading = React.useCallback((message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, options)
  }, [])

  const dismiss = React.useCallback((id?: string | number) => {
    sonnerToast.dismiss(id)
  }, [])

  const value = React.useMemo(() => ({
    toast,
    success,
    error,
    info,
    warning,
    loading,
    dismiss
  }), [toast, success, error, info, warning, loading, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
