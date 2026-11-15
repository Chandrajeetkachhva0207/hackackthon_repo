import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-xl' }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#090E1A]/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Dialog with Spring Pop Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full ${maxWidth} bg-white dark:bg-[#101B35] rounded-3xl border border-slate-200 dark:border-[#1E2D4A] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#101B35] dark:text-white tracking-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="mt-1 text-xs sm:text-sm text-[#718096] dark:text-slate-400 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl text-[#718096] hover:text-[#101B35] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#17243A] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="mt-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
