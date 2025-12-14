'use client'

import { motion } from 'framer-motion'
import type { Script, ScriptBlock } from '@/lib/sample-script'

interface ScriptViewProps {
    script: Script
}

function ScriptBlockRow({ block, index }: { block: ScriptBlock; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.05 }}
            data-block-id={block.id}
            className="grid grid-cols-[1fr_1fr] gap-8 py-6 border-b border-[#E5E5E5] last:border-b-0 group hover:bg-[#FAFAFA]/50 transition-all-200 -mx-4 px-4 rounded-lg"
        >
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

export function ScriptView({ script }: ScriptViewProps) {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="sticky top-0 z-20 glass border-b border-[#E5E5E5]"
            >
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">
                                {script.title}
                            </h1>
                            <p className="text-sm text-[#737373] mt-1">
                                {script.client} • {script.version} • {script.duration}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                                {script.status === 'review' ? 'In Review' : script.status}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Script Canvas */}
            <main className="max-w-4xl mx-auto px-6 py-8 pb-32">
                <div className="bg-white rounded-xl border border-[#E5E5E5] p-8 shadow-sm">
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
                            <ScriptBlockRow key={block.id} block={block} index={index} />
                        ))}
                    </div>
                </div>

                {/* Metadata Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mt-8 text-center text-xs text-[#A3A3A3]"
                >
                    Last updated: {script.lastUpdated} • Script ID: {script.id}
                </motion.div>
            </main>
        </div>
    )
}
