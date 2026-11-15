import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6)
    setToasts(prev => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => {
            const isSuccess = toast.type === 'success'
            const isError = toast.type === 'error'
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border ${
                  isSuccess
                    ? 'bg-white dark:bg-[#101B35] border-[#16A34A]/40 text-[#101B35] dark:text-white'
                    : isError
                    ? 'bg-white dark:bg-[#101B35] border-rose-500/40 text-[#101B35] dark:text-white'
                    : 'bg-white dark:bg-[#101B35] border-[#365CF5]/40 text-[#101B35] dark:text-white'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />}
                  {isError && <AlertCircle className="w-5 h-5 text-rose-500" />}
                  {!isSuccess && !isError && <Info className="w-5 h-5 text-[#365CF5]" />}
                </div>
                <div className="flex-1 text-xs font-semibold leading-relaxed">
                  {toast.message}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-[#718096] hover:text-[#101B35] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
