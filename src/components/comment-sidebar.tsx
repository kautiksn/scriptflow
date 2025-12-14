'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

interface Comment {
    id: string
    blockId: string
    text: string
    selectedText: string
    author: string
    timestamp: string
    color?: string
}

interface CommentSidebarProps {
    isOpen: boolean
    onClose: () => void
    blockId: string | null
    selectedText: string
    comments: Comment[]
    onAddComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void
    authorColor?: string
}

export function CommentSidebar({
    isOpen,
    onClose,
    blockId,
    selectedText,
    comments,
    onAddComment,
    authorColor = '#1A1A1A',
}: CommentSidebarProps) {
    const [commentText, setCommentText] = useState('')
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const blockComments = comments.filter((c) => c.blockId === blockId)

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 200)
        }
    }, [isOpen])

    const handleSubmit = () => {
        if (!commentText.trim() || !blockId) return

        onAddComment({
            blockId,
            text: commentText.trim(),
            selectedText,
            author: 'Client',
            color: authorColor,
        })
        setCommentText('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleSubmit()
        }
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
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed inset-0 bg-black/5 z-40"
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed right-0 top-0 bottom-0 w-[400px] max-w-full bg-white border-l border-[#E5E5E5] z-50 flex flex-col shadow-lg"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
                            <h2 className="text-sm font-semibold text-[#1A1A1A]">Add Comment</h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 -m-1.5 rounded-md hover:bg-[#F5F5F5] transition-all-200"
                            >
                                <X className="w-4 h-4 text-[#737373]" />
                            </button>
                        </div>

                        {/* Selected text preview */}
                        {selectedText && (
                            <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
                                <p className="text-xs font-medium text-[#737373] mb-2 uppercase tracking-wide">
                                    Selected Text
                                </p>
                                <p className="text-sm text-[#1A1A1A] italic leading-relaxed">
                                    "{selectedText.length > 150 ? `${selectedText.slice(0, 150)}...` : selectedText}"
                                </p>
                            </div>
                        )}

                        {/* Comment input */}
                        <div className="px-6 py-4 border-b border-[#E5E5E5]">
                            <textarea
                                ref={inputRef}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add your feedback..."
                                className="w-full h-24 px-3 py-2.5 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all-200 placeholder:text-[#A3A3A3]"
                            />
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-[#A3A3A3]">⌘ + Enter to submit</span>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!commentText.trim()}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all-200"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    Send
                                </button>
                            </div>
                        </div>

                        {/* Existing comments */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {blockComments.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-xs font-medium text-[#737373] uppercase tracking-wide">
                                        Previous Comments
                                    </p>
                                    {blockComments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="p-4 bg-[#FAFAFA] rounded-lg border border-[#E5E5E5]"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {/* Color indicator */}
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: comment.color || '#1A1A1A' }}
                                                    />
                                                    <span className="text-sm font-medium text-[#1A1A1A]">
                                                        {comment.author}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-[#A3A3A3]">{comment.timestamp}</span>
                                            </div>
                                            {comment.selectedText && (
                                                <p className="text-xs text-[#737373] italic mb-2 pb-2 border-b border-[#E5E5E5]">
                                                    On: "{comment.selectedText.slice(0, 50)}..."
                                                </p>
                                            )}
                                            <p className="text-sm text-[#1A1A1A] leading-relaxed">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-[#A3A3A3] text-center py-8">
                                    No comments on this section yet.
                                </p>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
