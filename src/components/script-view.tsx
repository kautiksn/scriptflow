'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X } from 'lucide-react'
import type { Script, ScriptBlock } from '@/lib/sample-script'

interface Comment {
    id: string
    blockId: string
    selectedText?: string | null
    text: string
    authorName: string
    authorColor: string
    createdAt?: Date
}

interface ScriptViewProps {
    script: Script
    comments?: Comment[]
    onBlockClick?: (blockId: string) => void
}

function CommentBadge({
    count,
    onClick
}: {
    count: number
    onClick: () => void
}) {
    if (count === 0) return null

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            className="absolute -right-2 top-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full shadow-sm hover:bg-blue-600 transition-all-200"
        >
            <MessageSquare className="w-3 h-3" />
            {count}
        </motion.button>
    )
}

function CommentPopover({
    comments,
    onClose,
}: {
    comments: Comment[]
    onClose: () => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-[#E5E5E5] shadow-xl z-30"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F5F5F5]">
                <span className="text-sm font-medium text-[#1A1A1A]">
                    {comments.length} Comment{comments.length !== 1 ? 's' : ''}
                </span>
                <button onClick={onClose} className="p-1 hover:bg-[#F5F5F5] rounded">
                    <X className="w-4 h-4 text-[#737373]" />
                </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
                {comments.map((comment) => (
                    <div key={comment.id} className="px-4 py-3 border-b border-[#F5F5F5] last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: comment.authorColor }}
                            />
                            <span className="text-sm font-medium text-[#1A1A1A]">
                                {comment.authorName}
                            </span>
                            <span className="text-xs text-[#A3A3A3]">
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                            </span>
                        </div>
                        {comment.selectedText && (
                            <p className="text-xs text-[#737373] italic mb-1 line-clamp-1">
                                "{comment.selectedText}"
                            </p>
                        )}
                        <p className="text-sm text-[#1A1A1A]">{comment.text}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

function ScriptBlockRow({
    block,
    index,
    comments = [],
}: {
    block: ScriptBlock
    index: number
    comments?: Comment[]
}) {
    const [showComments, setShowComments] = useState(false)
    const blockComments = comments.filter(c => c.blockId === block.id)
    const hasComments = blockComments.length > 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.05 }}
            data-block-id={block.id}
            className={`relative grid grid-cols-[1fr_1fr] gap-8 py-6 border-b border-[#E5E5E5] last:border-b-0 group hover:bg-[#FAFAFA]/50 transition-all-200 -mx-4 px-4 rounded-lg ${hasComments ? 'bg-blue-50/30 border-l-2 border-l-blue-400' : ''
                }`}
        >
            {/* Comment badge */}
            <CommentBadge
                count={blockComments.length}
                onClick={() => setShowComments(!showComments)}
            />

            {/* Comments popover */}
            <AnimatePresence>
                {showComments && blockComments.length > 0 && (
                    <CommentPopover
                        comments={blockComments}
                        onClose={() => setShowComments(false)}
                    />
                )}
            </AnimatePresence>

            {/* Timecode */}
            <div className="col-span-2 mb-2">
                <span className="script-heading text-[#A3A3A3]">{block.timecode}</span>
            </div>

            {/* Visual Column */}
            <div className="pr-4">
                <p className="script-heading mb-2 text-[#737373]">Visual</p>
                <p className="script-text text-[#1A1A1A] leading-relaxed select-text cursor-text">
                    {block.visual}
                </p>
            </div>

            {/* Audio Column */}
            <div className="pl-4 border-l border-[#E5E5E5]">
                <p className="script-heading mb-2 text-[#737373]">Audio</p>
                <p className="script-text text-[#1A1A1A] leading-relaxed select-text cursor-text">
                    {block.audio}
                </p>
            </div>

            {/* Notes (if present) */}
            {block.notes && (
                <div className="col-span-2 mt-4 pt-3 border-t border-dashed border-[#E5E5E5]">
                    <p className="script-heading mb-1 text-[#A3A3A3]">Production Notes</p>
                    <p className="text-sm text-[#737373] italic">{block.notes}</p>
                </div>
            )}
        </motion.div>
    )
}

export function ScriptView({ script, comments = [] }: ScriptViewProps) {
    return (
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-8 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#E5E5E5]">
                <div>
                    <h2 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">
                        {script.title}
                    </h2>
                    <p className="text-sm text-[#737373] mt-1">
                        {script.version} • {script.duration}
                    </p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                    {script.status === 'review' ? 'In Review' : script.status}
                </span>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-[1fr_1fr] gap-8 pb-4 mb-4 border-b-2 border-[#1A1A1A]">
                <div className="pr-4">
                    <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
                        Visuals
                    </h2>
                </div>
                <div className="pl-4">
                    <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
                        Audio
                    </h2>
                </div>
            </div>

            {/* Script Blocks */}
            <div className="divide-y divide-[#E5E5E5]/0">
                {script.blocks.map((block, index) => (
                    <ScriptBlockRow
                        key={block.id}
                        block={block}
                        index={index}
                        comments={comments}
                    />
                ))}
            </div>
        </div>
    )
}
