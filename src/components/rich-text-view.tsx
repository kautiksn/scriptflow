'use client'

import { motion } from 'framer-motion'

interface RichTextViewProps {
    content: string
    isEditable?: boolean
}

export function RichTextView({ content, isEditable }: RichTextViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-[#E5E5E5] p-8 shadow-sm"
        >
            <div
                data-block-id="rich-text-block"
                className={`prose prose-neutral max-w-none script-text ${isEditable ? 'cursor-text' : ''
                    }`}
                contentEditable={isEditable}
                suppressContentEditableWarning
            >
                {content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 text-[#1A1A1A] leading-relaxed">
                        {paragraph || <br />}
                    </p>
                ))}
            </div>

            {isEditable && (
                <p className="text-xs text-[#A3A3A3] mt-6 pt-4 border-t border-[#E5E5E5]">
                    Click to edit • Changes are saved automatically
                </p>
            )}
        </motion.div>
    )
}
