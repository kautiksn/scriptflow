'use client'

import { Suspense, useState, useCallback } from 'react'
import { ScriptView } from '@/components/script-view'
import { CommentTrigger } from '@/components/comment-trigger'
import { CommentSidebar } from '@/components/comment-sidebar'
import { ApprovalFooter } from '@/components/approval-footer'
import { useTextSelection } from '@/hooks/use-text-selection'
import { useAccessMode } from '@/hooks/use-access-mode'
import { sampleScript } from '@/lib/sample-script'

interface Comment {
  id: string
  blockId: string
  text: string
  selectedText: string
  author: string
  timestamp: string
}

function ScriptFlowContent() {
  const accessMode = useAccessMode()
  const { selection, clearSelection } = useTextSelection()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [activeSelectedText, setActiveSelectedText] = useState('')
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'comment-1',
      blockId: 'block-2',
      text: 'Love this line — very evocative. Could we explore "ritual" as the central theme throughout?',
      selectedText: 'Some mornings demand more than coffee.',
      author: 'Sarah (Client)',
      timestamp: '2 hours ago',
    },
  ])

  const handleCommentClick = useCallback(() => {
    if (selection) {
      setActiveBlockId(selection.blockId)
      setActiveSelectedText(selection.text)
      setIsSidebarOpen(true)
      clearSelection()
    }
  }, [selection, clearSelection])

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false)
    setActiveBlockId(null)
    setActiveSelectedText('')
  }, [])

  const handleAddComment = useCallback((comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      timestamp: 'Just now',
    }
    setComments((prev) => [...prev, newComment])
  }, [])

  const handleRequestChanges = useCallback(() => {
    // In a real app, this would submit all comments and mark the script for revision
    alert('Request for changes submitted! The production team will be notified.')
  }, [])

  const handleApprove = useCallback(() => {
    // In a real app, this would mark the script as approved in Supabase
    alert('Script approved! The production team will proceed with this version.')
  }, [])

  return (
    <>
      <ScriptView script={sampleScript} />

      {/* Floating comment trigger */}
      {selection && (
        <CommentTrigger rect={selection.rect} onClick={handleCommentClick} />
      )}

      {/* Comment sidebar */}
      <CommentSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        blockId={activeBlockId}
        selectedText={activeSelectedText}
        comments={comments}
        onAddComment={handleAddComment}
      />

      {/* Approval footer */}
      <ApprovalFooter
        onRequestChanges={handleRequestChanges}
        onApprove={handleApprove}
        isAdmin={accessMode === 'admin'}
      />
    </>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <ScriptFlowContent />
    </Suspense>
  )
}
