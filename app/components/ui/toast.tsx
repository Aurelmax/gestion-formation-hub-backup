"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

// Ajout des types manquants requis par use-toast.ts
export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="fixed bottom-4 right-4 z-50">{children}</div>
}

export const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-md p-4 mb-2 flex items-start justify-between gap-4",
      className
    )}
    {...props}
  />
))
Toast.displayName = "Toast"

export const ToastTitle = ({ children }: { children?: React.ReactNode }) => (
  <p className="font-semibold">{children}</p>
)

export const ToastDescription = ({
  children,
}: {
  children?: React.ReactNode
}) => <p className="text-sm text-gray-600 dark:text-gray-300">{children}</p>

export const ToastClose = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
  >
    ✕
  </button>
)

export const ToastViewport = () => null
