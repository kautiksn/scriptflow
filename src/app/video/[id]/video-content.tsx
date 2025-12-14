'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Plus, Settings } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { TabBar } from '@/components/tab-bar'
import { TabContent } from '@/components/tab-content'
import { CommentSidebar } from '@/components/comment-sidebar'
import { CommentTrigger } from '@/components/comment-trigger'
import { CommenterPrompt } from '@/components/commenter-prompt'
import { useTextSelection } from '@/hooks/use-text-selection'
import { useCommenterIdentity } from '@/hooks/use-commenter-identity'

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

function getYouTubeEmbedUrl(url: string): string {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s?]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

export function VideoContent({ video, user }: VideoContentProps) {
    const [activeTabId, setActiveTabId] = useState(video.tabs[0]?.id || '')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
    const [activeSelectedText, setActiveSelectedText] = useState('')
    const [comments, setComments] = useState<Comment[]>(
        video.tabs.flatMap(tab => tab.comments)
    )

    const { selection, clearSelection } = useTextSelection()
    const { identity, showPrompt, setIdentity, hidePrompt } = useCommenterIdentity()

    const activeTab = video.tabs.find(t => t.id === activeTabId)
    const activeTabComments = comments.filter(c =>
        activeTab?.comments.some(tc => tc.id === c.id) ||
        (c as unknown as { tabId?: string }).tabId === activeTabId
    )

    const handleCommentClick = useCallback(() => {
        if (!identity) {
            // Show name prompt first
            return
        }
        if (selection) {
            setActiveBlockId(selection.blockId)
            setActiveSelectedText(selection.text)
            setIsSidebarOpen(true)
            clearSelection()
        }
    }, [selection, clearSelection, identity])

    const handleAddComment = useCallback(async (commentData: {
        blockId: string
        text: string
        selectedText: string
        author: string
    }) => {
        if (!identity) return

        const newComment: Comment = {
            id: `temp-${Date.now()}`,
            blockId: commentData.blockId,
            selectedText: commentData.selectedText,
            text: commentData.text,
            authorName: identity.name,
            authorColor: identity.color,
            createdAt: new Date(),
        }

        setComments(prev => [...prev, newComment])

        // TODO: Persist to database via server action
    }, [identity])

    const isAdmin = user.role === 'krtva'

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Commenter name prompt */}
            <CommenterPrompt
                isOpen={showPrompt}
                onSubmit={setIdentity}
                onClose={hidePrompt}
            />

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
                            {isAdmin && (
                                <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#737373] hover:text-[#1A1A1A] border border-[#E5E5E5] rounded-lg hover:bg-[#F5F5F5] transition-all-200">
                                    <Settings className="w-4 h-4" />
                                    Edit
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

            {/* YouTube Embed */}
            <div className="max-w-6xl mx-auto px-6 py-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg"
                >
                    <iframe
                        src={getYouTubeEmbedUrl(video.youtubeUrl)}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </motion.div>
            </div>

            {/* Tab Bar */}
            <div className="max-w-6xl mx-auto px-6">
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
            {selection && identity && (
                <CommentTrigger rect={selection.rect} onClick={handleCommentClick} />
            )}

            {/* Comment sidebar */}
            <CommentSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                blockId={activeBlockId}
                selectedText={activeSelectedText}
                comments={activeTabComments.map(c => ({
                    id: c.id,
                    blockId: c.blockId,
                    text: c.text,
                    selectedText: c.selectedText || '',
                    author: c.authorName,
                    timestamp: new Date(c.createdAt).toLocaleDateString(),
                    color: c.authorColor,
                }))}
                onAddComment={(comment) => handleAddComment({
                    ...comment,
                    author: identity?.name || 'Anonymous',
                })}
                authorColor={identity?.color}
            />
        </div>
    )
}
