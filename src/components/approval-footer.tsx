'use client'

import { motion } from 'framer-motion'
import { Check, MessageSquarePlus } from 'lucide-react'

interface ApprovalFooterProps {
    onRequestChanges: () => void
    onApprove: () => void
    isAdmin?: boolean
}

export function ApprovalFooter({ onRequestChanges, onApprove, isAdmin }: ApprovalFooterProps) {
    return (
        <motion.footer
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-[#E5E5E5]"
        >
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-[#737373]">
                    {isAdmin ? 'Admin Mode — Full Edit Access' : 'Review the script and provide your feedback'}
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onRequestChanges}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#1A1A1A] bg-white border border-[#E5E5E5] rounded-lg hover:bg-[#F5F5F5] hover:border-[#D4D4D4] transition-all-200"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        Request Changes
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onApprove}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black transition-all-200 shadow-md"
                    >
                        <Check className="w-4 h-4" />
                        Approve Script
                    </motion.button>
                </div>
            </div>
        </motion.footer>
    )
}
