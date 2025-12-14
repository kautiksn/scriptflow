'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare } from 'lucide-react'

interface CommentTriggerProps {
    rect: DOMRect | null
    onClick: () => void
}

export function CommentTrigger({ rect, onClick }: CommentTriggerProps) {
    if (!rect) return null

    // Position the button above the selection
    const top = rect.top + window.scrollY - 40
    const left = rect.left + rect.width / 2 - 16

    return (
        <AnimatePresence>
            <motion.button
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={onClick}
                className="fixed z-50 flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-full shadow-lg hover:bg-black transition-all-200"
                style={{
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translateX(-50%)',
                }}
            >
                <MessageSquare className="w-3.5 h-3.5" />
                Comment
            </motion.button>
        </AnimatePresence>
    )
}
