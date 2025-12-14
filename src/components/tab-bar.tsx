'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { createTab } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

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
    videoId?: string
}

const TAB_ICONS: Record<string, string> = {
    overview: '📋',
    preproduction: '📝',
    script: '📄',
    moodboard: '🎨',
}

const TAB_TYPES = [
    { value: 'script', label: 'Script', icon: '📄' },
    { value: 'overview', label: 'Overview', icon: '📋' },
    { value: 'preproduction', label: 'Pre-production', icon: '📝' },
    { value: 'moodboard', label: 'Moodboard', icon: '🎨' },
]

export function TabBar({ tabs, activeTabId, onTabChange, isAdmin, videoId }: TabBarProps) {
    const router = useRouter()
    const [showAddTab, setShowAddTab] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleAddTab(formData: FormData) {
        if (!videoId) return
        setIsSubmitting(true)
        formData.append('videoId', videoId)
        await createTab(formData)
        setIsSubmitting(false)
        setShowAddTab(false)
        router.refresh()
    }

    return (
        <>
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
                {isAdmin && videoId && (
                    <motion.button
                        onClick={() => setShowAddTab(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-3 py-2 ml-2 text-sm text-[#737373] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-lg transition-all-200"
                    >
                        <Plus className="w-4 h-4" />
                        Add Tab
                    </motion.button>
                )}
            </div>

            {/* Add Tab Modal */}
            <AnimatePresence>
                {showAddTab && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-50"
                            onClick={() => setShowAddTab(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
                        >
                            <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-[#1A1A1A]">Add New Tab</h2>
                                    <button
                                        onClick={() => setShowAddTab(false)}
                                        className="p-1.5 -m-1.5 rounded-md hover:bg-[#F5F5F5]"
                                    >
                                        <X className="w-4 h-4 text-[#737373]" />
                                    </button>
                                </div>
                                <form action={handleAddTab}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                                Tab Name
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                required
                                                placeholder="e.g., Script v2, Notes, etc."
                                                className="w-full px-4 py-2.5 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                                Tab Type
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {TAB_TYPES.map((type) => (
                                                    <label
                                                        key={type.value}
                                                        className="flex items-center gap-2 px-3 py-2 border border-[#E5E5E5] rounded-lg cursor-pointer hover:bg-[#F5F5F5] has-[:checked]:border-[#1A1A1A] has-[:checked]:bg-[#F5F5F5]"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="tabType"
                                                            value={type.value}
                                                            defaultChecked={type.value === 'script'}
                                                            className="sr-only"
                                                        />
                                                        <span>{type.icon}</span>
                                                        <span className="text-sm">{type.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-6 py-3 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Tab'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
