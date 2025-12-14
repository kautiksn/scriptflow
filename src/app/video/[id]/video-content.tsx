'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { createComment, updateTabContent } from '@/app/actions/admin'
import { TabBar } from '@/components/tab-bar'
import { TabContent } from '@/components/tab-content'
import { CommentDialog } from '@/components/comment-dialog'
import { CommentTrigger } from '@/components/comment-trigger'
import { ScriptEditor } from '@/components/script-editor'
import { useTextSelection } from '@/hooks/use-text-selection'

interface Tab {
    id: string
    tabType: string
    title: string
    content: unknown
    comments: Comment[]
}

interface Comment {
    id: string
    blockId: string
    selectedText: string | null
    text: string
    authorName: string
    authorColor: string
    createdAt: Date
}

interface Video {
    id: string
    title: string
    youtubeUrl: string
    project: { title: string }
    tabs: Tab[]
}

interface VideoContentProps {
    video: Video
    user: { id: string; name: string; role: string }
}

// Curated color palette for commenters
const USER_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
]

function getUserColor(name: string): string {
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return USER_COLORS[hash % USER_COLORS.length]
}

interface ScriptBlock {
    id: string
    timecode: string
    visual: string
    audio: string
    notes?: string
}

export function VideoContent({ video, user }: VideoContentProps) {
    const router = useRouter()
    const [activeTabId, setActiveTabId] = useState(video.tabs[0]?.id || '')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 })
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
    const [activeSelectedText, setActiveSelectedText] = useState('')
    const [comments, setComments] = useState<Comment[]>(
        video.tabs.flatMap(tab => tab.comments)
    )
    const [isEditorOpen, setIsEditorOpen] = useState(false)

    const { selection, clearSelection } = useTextSelection()

    const activeTab = video.tabs.find(t => t.id === activeTabId)

    // Filter comments for current tab
    const activeTabComments = comments.filter(c => {
        const originalTabComment = activeTab?.comments.some(tc => tc.id === c.id)
        const newComment = (c as unknown as { tabId?: string }).tabId === activeTabId
        return originalTabComment || newComment
    })

    // User color based on their name
    const userColor = getUserColor(user.name)

    const handleCommentClick = useCallback(() => {
        if (selection && selection.rect) {
            setActiveBlockId(selection.blockId)
            setActiveSelectedText(selection.text)
            setDialogPosition({
                x: selection.rect.left,
                y: selection.rect.bottom,
            })
            setIsDialogOpen(true)
            clearSelection()
        }
    }, [selection, clearSelection])

    const handleSubmitComment = useCallback(async (text: string) => {
        if (!activeTabId || !activeBlockId) return

        // Create optimistic comment
        const newComment: Comment = {
            id: `temp-${Date.now()}`,
            blockId: activeBlockId,
            selectedText: activeSelectedText,
            text,
            authorName: user.name,
            authorColor: userColor,
            createdAt: new Date(),
        }

        // Add to local state immediately
        setComments(prev => [...prev, { ...newComment, tabId: activeTabId } as unknown as Comment])

        // Close dialog
        setIsDialogOpen(false)
        setActiveBlockId(null)
        setActiveSelectedText('')

        // Save to database
        const formData = new FormData()
        formData.append('tabId', activeTabId)
        formData.append('blockId', activeBlockId)
        formData.append('text', text)
        formData.append('selectedText', activeSelectedText)
        formData.append('authorName', user.name)
        formData.append('authorColor', userColor)

        await createComment(formData)
    }, [activeTabId, activeBlockId, activeSelectedText, user.name, userColor])

    const handleCloseDialog = useCallback(() => {
        setIsDialogOpen(false)
        setActiveBlockId(null)
        setActiveSelectedText('')
    }, [])

    const handleSaveScript = useCallback(async (blocks: ScriptBlock[]) => {
        if (!activeTab || activeTab.tabType !== 'script') return

        await updateTabContent(activeTab.id, { blocks })
        router.refresh()
    }, [activeTab, router])

    const isAdmin = user.role === 'krtva'
    const isScriptTab = activeTab?.tabType === 'script'

    // Get current script blocks for editor
    const currentScriptBlocks = isScriptTab && activeTab
        ? ((activeTab.content as { blocks?: ScriptBlock[] })?.blocks || [])
        : []

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="sticky top-0 z-20 glass border-b border-[#E5E5E5]"
            >
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="p-2 -ml-2 rounded-lg hover:bg-[#F5F5F5] transition-all-200"
                            >
                                <ArrowLeft className="w-5 h-5 text-[#737373]" />
                            </Link>
                            <div>
                                <p className="text-xs text-[#737373] uppercase tracking-wide">
                                    {video.project.title}
                                </p>
                                <h1 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">
                                    {video.title}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isAdmin && isScriptTab && (
                                <button
                                    onClick={() => setIsEditorOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all-200 animate-pulse-subtle"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Script
                                </button>
                            )}
                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm text-[#737373] hover:text-[#1A1A1A] transition-all-200"
                                >
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Tab Bar */}
            <div className="max-w-6xl mx-auto px-6 mt-6">
                <TabBar
                    tabs={video.tabs.map(t => ({ id: t.id, title: t.title, type: t.tabType }))}
                    activeTabId={activeTabId}
                    onTabChange={setActiveTabId}
                    isAdmin={isAdmin}
                />
            </div>

            {/* Tab Content */}
            <main className="max-w-6xl mx-auto px-6 py-8 pb-32">
                <AnimatePresence mode="wait">
                    {activeTab && (
                        <TabContent
                            key={activeTab.id}
                            tab={activeTab}
                            comments={activeTabComments}
                            isAdmin={isAdmin}
                        />
                    )}
                </AnimatePresence>
            </main>

            {/* Floating comment trigger */}
            {selection && (
                <CommentTrigger rect={selection.rect} onClick={handleCommentClick} />
            )}

            {/* Comment dialog */}
            <CommentDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                selectedText={activeSelectedText}
                position={dialogPosition}
                onSubmit={handleSubmitComment}
                authorName={user.name}
                authorColor={userColor}
            />

            {/* Script Editor */}
            {isAdmin && (
                <ScriptEditor
                    isOpen={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleSaveScript}
                    initialBlocks={currentScriptBlocks}
                    title={`Edit: ${activeTab?.title || 'Script'}`}
                />
            )}
        </div>
    )
}
