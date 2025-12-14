'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from 'lucide-react'

interface CommenterPromptProps {
    isOpen: boolean
    onSubmit: (identity: { name: string; color: string }) => void
    onClose: () => void
}

// Curated color palette for commenters
const COMMENTER_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
]

function getRandomColor(): string {
    return COMMENTER_COLORS[Math.floor(Math.random() * COMMENTER_COLORS.length)]
}

export function CommenterPrompt({ isOpen, onSubmit, onClose }: CommenterPromptProps) {
    const [name, setName] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        const color = getRandomColor()
        onSubmit({ name: name.trim(), color })
        setName('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
                    >
                        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-2xl p-6">
                            {/* Icon */}
                            <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-6 h-6 text-[#737373]" />
                            </div>

                            {/* Title */}
                            <h2 className="text-lg font-semibold text-[#1A1A1A] text-center mb-2">
                                What's your name?
                            </h2>
                            <p className="text-sm text-[#737373] text-center mb-6">
                                This helps keep track of your comments
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    autoFocus
                                    className="w-full px-4 py-3 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all-200 text-center"
                                />
                                <button
                                    type="submit"
                                    disabled={!name.trim()}
                                    className="w-full mt-4 py-3 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all-200"
                                >
                                    Continue
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
