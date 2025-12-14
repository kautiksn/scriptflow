'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Type, Grid3X3 } from 'lucide-react'

interface TextScriptEditorProps {
    isOpen: boolean
    onClose: () => void
    onSave: (content: { text: string; mode: 'text' }) => void
    initialContent?: string
    title?: string
}

export function TextScriptEditor({
    isOpen,
    onClose,
    onSave,
    initialContent = '',
    title = 'Script Editor',
}: TextScriptEditorProps) {
    const [text, setText] = useState(initialContent)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        await onSave({ text, mode: 'text' })
        setIsSaving(false)
        onClose()
    }

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
    const charCount = text.length

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50"
                        onClick={onClose}
                    />

                    {/* Editor Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed inset-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5E5E5] bg-[#FAFAFA]">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-semibold text-[#1A1A1A]">{title}</h2>
                                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    <Type className="w-3 h-3" />
                                    Text Mode
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-[#737373]">
                                    {wordCount.toLocaleString()} words · {charCount.toLocaleString()} characters
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50 transition-all-200"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSaving ? 'Saving...' : 'Save Script'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-[#E5E5E5] transition-all-200"
                                >
                                    <X className="w-5 h-5 text-[#737373]" />
                                </button>
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div className="flex-1 overflow-hidden p-8">
                            <div className="h-full max-w-4xl mx-auto">
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste or type your script here...

You can include:
• Chapter headings (use ALL CAPS or ## Markdown)
• Dialogue and narration
• Stage directions [in brackets]
• Notes and annotations

The content will be saved exactly as you type it."
                                    className="w-full h-full px-6 py-4 text-base leading-relaxed bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent font-mono placeholder:text-[#A3A3A3] placeholder:font-sans"
                                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace' }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
