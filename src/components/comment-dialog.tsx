'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

interface CommentDialogProps {
    isOpen: boolean
    onClose: () => void
    selectedText: string
    position: { x: number; y: number }
    onSubmit: (text: string) => void
    authorName: string
    authorColor: string
}

export function CommentDialog({
    isOpen,
    onClose,
    selectedText,
    position,
    onSubmit,
    authorName,
    authorColor,
}: CommentDialogProps) {
    const [text, setText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
        if (!isOpen) {
            setText('')
        }
    }, [isOpen])

    async function handleSubmit() {
        if (!text.trim()) return
        setIsSubmitting(true)
        await onSubmit(text.trim())
        setIsSubmitting(false)
        setText('')
        onClose()
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleSubmit()
        }
        if (e.key === 'Escape') {
            onClose()
        }
    }

    // Calculate position to keep dialog in viewport
    const dialogStyle = {
        left: Math.min(position.x, window.innerWidth - 380),
        top: Math.min(position.y + 10, window.innerHeight - 300),
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
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-40"
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="fixed z-50 w-[360px]"
                        style={dialogStyle}
                    >
                        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F5F5F5]">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: authorColor }}
                                    />
                                    <span className="text-sm font-medium text-[#1A1A1A]">{authorName}</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 -m-1 rounded hover:bg-[#F5F5F5] transition-all-200"
                                >
                                    <X className="w-4 h-4 text-[#A3A3A3]" />
                                </button>
                            </div>

                            {/* Selected text */}
                            {selectedText && (
                                <div className="px-4 py-2 bg-[#FAFAFA] border-b border-[#F5F5F5]">
                                    <p className="text-xs text-[#737373] italic line-clamp-2">
                                        "{selectedText.slice(0, 100)}{selectedText.length > 100 ? '...' : ''}"
                                    </p>
                                </div>
                            )}

                            {/* Input */}
                            <div className="p-3">
                                <textarea
                                    ref={inputRef}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Add a comment..."
                                    className="w-full h-20 px-3 py-2 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all-200 placeholder:text-[#A3A3A3]"
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-[#A3A3A3]">⌘ + Enter</span>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!text.trim() || isSubmitting}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all-200"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        {isSubmitting ? 'Sending...' : 'Send'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
