'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, StickyNote, ImageIcon, X } from 'lucide-react'

interface MoodboardItem {
    id: string
    type: 'image' | 'note'
    content: string
    x: number
    y: number
}

interface MoodboardViewProps {
    items: MoodboardItem[]
    isAdmin?: boolean
}

export function MoodboardView({ items: initialItems, isAdmin }: MoodboardViewProps) {
    const [items, setItems] = useState<MoodboardItem[]>(initialItems)
    const [draggingId, setDraggingId] = useState<string | null>(null)

    const handleDragStart = (id: string) => {
        if (!isAdmin) return
        setDraggingId(id)
    }

    const handleDragEnd = () => {
        setDraggingId(null)
    }

    const addNote = () => {
        const newItem: MoodboardItem = {
            id: `note-${Date.now()}`,
            type: 'note',
            content: 'Double-click to edit',
            x: Math.random() * 200 + 50,
            y: Math.random() * 200 + 50,
        }
        setItems([...items, newItem])
    }

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    return (
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm overflow-hidden">
            {/* Toolbar */}
            {isAdmin && (
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E5E5E5] bg-[#FAFAFA]">
                    <button
                        onClick={addNote}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#737373] hover:text-[#1A1A1A] hover:bg-white rounded-lg border border-[#E5E5E5] transition-all-200"
                    >
                        <StickyNote className="w-4 h-4" />
                        Add Note
                    </button>
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#737373] hover:text-[#1A1A1A] hover:bg-white rounded-lg border border-[#E5E5E5] transition-all-200"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Add Image
                    </button>
                </div>
            )}

            {/* Canvas */}
            <div className="relative h-[600px] bg-[#FAFAFA] bg-[radial-gradient(#E5E5E5_1px,transparent_1px)] bg-[size:20px_20px]">
                {items.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-xl border-2 border-dashed border-[#E5E5E5] flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-6 h-6 text-[#A3A3A3]" />
                            </div>
                            <p className="text-sm text-[#737373]">
                                {isAdmin ? 'Add images and notes to the moodboard' : 'No moodboard items yet'}
                            </p>
                        </div>
                    </div>
                ) : (
                    items.map((item) => (
                        <motion.div
                            key={item.id}
                            drag={isAdmin}
                            dragMomentum={false}
                            onDragStart={() => handleDragStart(item.id)}
                            onDragEnd={handleDragEnd}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                zIndex: draggingId === item.id ? 10 : 1,
                            }}
                            className={`absolute ${isAdmin ? 'cursor-move' : 'cursor-default'}`}
                            style={{ left: item.x, top: item.y }}
                        >
                            {item.type === 'note' ? (
                                <div className="w-48 bg-yellow-100 rounded-lg shadow-md p-4 border border-yellow-200">
                                    {isAdmin && (
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all-200"
                                        >
                                            <X className="w-3 h-3 text-[#737373]" />
                                        </button>
                                    )}
                                    <p
                                        contentEditable={isAdmin}
                                        suppressContentEditableWarning
                                        className="text-sm text-yellow-900 focus:outline-none"
                                    >
                                        {item.content}
                                    </p>
                                </div>
                            ) : (
                                <div className="relative w-64 bg-white rounded-lg shadow-md overflow-hidden border border-[#E5E5E5]">
                                    {isAdmin && (
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="absolute top-2 right-2 z-10 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 transition-all-200"
                                        >
                                            <X className="w-3 h-3 text-[#737373]" />
                                        </button>
                                    )}
                                    <Image
                                        src={item.content}
                                        alt="Moodboard image"
                                        width={256}
                                        height={192}
                                        className="w-full h-auto"
                                    />
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
