'use client'

import { motion } from 'framer-motion'
import { ScriptView } from './script-view'
import { MoodboardView } from './moodboard-view'
import { RichTextView } from './rich-text-view'

interface Tab {
    id: string
    tabType: string
    title: string
    content: unknown
}

interface Comment {
    id: string
    blockId: string
    selectedText?: string | null
    text: string
    authorName: string
    authorColor: string
    createdAt?: Date
}

interface TabContentProps {
    tab: Tab
    comments: Comment[]
    isAdmin?: boolean
}

export function TabContent({ tab, comments, isAdmin }: TabContentProps) {
    const content = tab.content as Record<string, unknown>

    // Check if script is in text mode or scene mode
    const isTextMode = content?.mode === 'text' || (content?.text && !content?.blocks)
    const hasBlocks = Array.isArray(content?.blocks) && content.blocks.length > 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
        >
            {tab.tabType === 'script' && (
                <>
                    {/* Text mode script */}
                    {isTextMode && content?.text && (
                        <div className="bg-white rounded-xl border border-[#E5E5E5] p-8 shadow-sm">
                            <div className="max-w-3xl mx-auto">
                                <div className="prose prose-lg prose-slate max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-[#1A1A1A] bg-transparent p-0 m-0 border-none">
                                        {content.text as string}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scene mode script */}
                    {hasBlocks && (
                        <ScriptView
                            script={{
                                id: tab.id,
                                title: tab.title,
                                client: '',
                                version: 'v1',
                                duration: ':30',
                                lastUpdated: new Date().toISOString().split('T')[0],
                                status: 'review',
                                blocks: (content.blocks as Array<{
                                    id: string
                                    timecode: string
                                    visual: string
                                    audio: string
                                    notes?: string
                                }>) || [],
                            }}
                            comments={comments}
                        />
                    )}

                    {/* Empty state */}
                    {!isTextMode && !hasBlocks && (
                        <div className="bg-white rounded-xl border border-dashed border-[#E5E5E5] p-12 text-center">
                            <p className="text-[#737373]">
                                No script content yet. Click{' '}
                                <span className="font-medium text-blue-600">"Edit Text"</span> to paste a script or{' '}
                                <span className="font-medium text-[#1A1A1A]">"Edit Scenes"</span> to create scenes.
                            </p>
                        </div>
                    )}
                </>
            )}

            {tab.tabType === 'overview' && (
                <RichTextView
                    content={content?.text as string || 'No overview content yet.'}
                    isEditable={isAdmin}
                />
            )}

            {tab.tabType === 'preproduction' && (
                <RichTextView
                    content={content?.text as string || 'No pre-production notes yet.'}
                    isEditable={isAdmin}
                />
            )}

            {tab.tabType === 'moodboard' && (
                <MoodboardView
                    items={(content?.items as Array<{
                        id: string
                        type: 'image' | 'note'
                        content: string
                        x: number
                        y: number
                    }>) || []}
                    isAdmin={isAdmin}
                />
            )}
        </motion.div>
    )
}
