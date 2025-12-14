'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, GripVertical, Save } from 'lucide-react'

interface ScriptBlock {
    id: string
    timecode: string
    visual: string
    audio: string
    notes?: string
}

interface ScriptEditorProps {
    isOpen: boolean
    onClose: () => void
    onSave: (blocks: ScriptBlock[]) => void
    initialBlocks?: ScriptBlock[]
    title?: string
}

function generateId(): string {
    return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function ScriptEditor({
    isOpen,
    onClose,
    onSave,
    initialBlocks = [],
    title = 'Script Editor',
}: ScriptEditorProps) {
    const [blocks, setBlocks] = useState<ScriptBlock[]>(
        initialBlocks.length > 0
            ? initialBlocks
            : [{ id: generateId(), timecode: '00:00 - 00:05', visual: '', audio: '' }]
    )
    const [isSaving, setIsSaving] = useState(false)

    const addBlock = () => {
        const lastBlock = blocks[blocks.length - 1]
        const newTimecode = lastBlock
            ? calculateNextTimecode(lastBlock.timecode)
            : '00:00 - 00:05'

        setBlocks([
            ...blocks,
            { id: generateId(), timecode: newTimecode, visual: '', audio: '' }
        ])
    }

    const removeBlock = (id: string) => {
        if (blocks.length > 1) {
            setBlocks(blocks.filter(b => b.id !== id))
        }
    }

    const updateBlock = (id: string, field: keyof ScriptBlock, value: string) => {
        setBlocks(blocks.map(b =>
            b.id === id ? { ...b, [field]: value } : b
        ))
    }

    const handleSave = async () => {
        setIsSaving(true)
        await onSave(blocks)
        setIsSaving(false)
        onClose()
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
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">{title}</h2>
                            <div className="flex items-center gap-3">
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
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="max-w-5xl mx-auto">
                                {/* Column Headers */}
                                <div className="grid grid-cols-[100px_1fr_1fr] gap-6 pb-4 mb-6 border-b-2 border-[#1A1A1A]">
                                    <div className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
                                        Timecode
                                    </div>
                                    <div className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
                                        Visuals
                                    </div>
                                    <div className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
                                        Audio
                                    </div>
                                </div>

                                {/* Script Blocks */}
                                <div className="space-y-4">
                                    {blocks.map((block, index) => (
                                        <motion.div
                                            key={block.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="group grid grid-cols-[100px_1fr_1fr] gap-6 p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5] hover:border-[#D4D4D4] transition-all-200"
                                        >
                                            {/* Timecode */}
                                            <div className="flex items-start gap-2">
                                                <GripVertical className="w-4 h-4 text-[#D4D4D4] mt-2.5 cursor-grab" />
                                                <input
                                                    type="text"
                                                    value={block.timecode}
                                                    onChange={(e) => updateBlock(block.id, 'timecode', e.target.value)}
                                                    placeholder="00:00 - 00:05"
                                                    className="w-full px-2 py-2 text-sm font-mono bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent"
                                                />
                                            </div>

                                            {/* Visual */}
                                            <div>
                                                <textarea
                                                    value={block.visual}
                                                    onChange={(e) => updateBlock(block.id, 'visual', e.target.value)}
                                                    placeholder="Describe the visual scene..."
                                                    rows={4}
                                                    className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent placeholder:text-[#A3A3A3]"
                                                />
                                            </div>

                                            {/* Audio */}
                                            <div className="flex gap-3">
                                                <textarea
                                                    value={block.audio}
                                                    onChange={(e) => updateBlock(block.id, 'audio', e.target.value)}
                                                    placeholder="VO, music, SFX..."
                                                    rows={4}
                                                    className="flex-1 px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent placeholder:text-[#A3A3A3]"
                                                />
                                                <button
                                                    onClick={() => removeBlock(block.id)}
                                                    className="self-start p-2 rounded-lg text-[#A3A3A3] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Add Block Button */}
                                <button
                                    onClick={addBlock}
                                    className="mt-6 w-full flex items-center justify-center gap-2 py-4 text-sm font-medium text-[#737373] border-2 border-dashed border-[#E5E5E5] rounded-xl hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all-200"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Scene
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

function calculateNextTimecode(current: string): string {
    // Parse "00:00 - 00:05" format
    const match = current.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/)
    if (!match) return '00:00 - 00:05'

    const endMin = parseInt(match[3])
    const endSec = parseInt(match[4])

    const startSec = endSec + 1
    const startMin = endMin + Math.floor(startSec / 60)
    const newStartSec = startSec % 60

    const durationSec = 5 // Default 5 second scenes
    const totalEndSec = startMin * 60 + newStartSec + durationSec
    const newEndMin = Math.floor(totalEndSec / 60)
    const newEndSec = totalEndSec % 60

    return `${String(startMin).padStart(2, '0')}:${String(newStartSec).padStart(2, '0')} - ${String(newEndMin).padStart(2, '0')}:${String(newEndSec).padStart(2, '0')}`
}
