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
    text: string
    authorName: string
    authorColor: string
}

interface TabContentProps {
    tab: Tab
    comments: Comment[]
    isAdmin?: boolean
}

export function TabContent({ tab, comments, isAdmin }: TabContentProps) {
    const content = tab.content as Record<string, unknown>

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
        >
            {tab.tabType === 'script' && (
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
                />
            )}

            {tab.tabType === 'overview' && (
                <RichTextView
                    content={content.text as string || 'No overview content yet.'}
                    isEditable={isAdmin}
                />
            )}

            {tab.tabType === 'preproduction' && (
                <RichTextView
                    content={content.text as string || 'No pre-production notes yet.'}
                    isEditable={isAdmin}
                />
            )}

            {tab.tabType === 'moodboard' && (
                <MoodboardView
                    items={(content.items as Array<{
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
