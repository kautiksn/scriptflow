'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface Tab {
    id: string
    title: string
    type: string
}

interface TabBarProps {
    tabs: Tab[]
    activeTabId: string
    onTabChange: (id: string) => void
    isAdmin?: boolean
}

const TAB_ICONS: Record<string, string> = {
    overview: '📋',
    preproduction: '📝',
    script: '📄',
    moodboard: '🎨',
}

export function TabBar({ tabs, activeTabId, onTabChange, isAdmin }: TabBarProps) {
    return (
        <div className="flex items-center gap-1 border-b border-[#E5E5E5] overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId
                const icon = TAB_ICONS[tab.type] || '📄'

                return (
                    <motion.button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all-200 ${isActive
                                ? 'text-[#1A1A1A]'
                                : 'text-[#737373] hover:text-[#1A1A1A]'
                            }`}
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                    >
                        <span>{icon}</span>
                        {tab.title}

                        {/* Active indicator */}
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A1A1A]"
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                            />
                        )}
                    </motion.button>
                )
            })}

            {/* Add tab button - admin only */}
            {isAdmin && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-3 py-2 ml-2 text-sm text-[#737373] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-lg transition-all-200"
                >
                    <Plus className="w-4 h-4" />
                    Add Tab
                </motion.button>
            )}
        </div>
    )
}
