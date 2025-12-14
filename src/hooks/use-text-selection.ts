'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface TextSelection {
    text: string
    blockId: string
    rect: DOMRect | null
    range: Range | null
}

export function useTextSelection() {
    const [selection, setSelection] = useState<TextSelection | null>(null)
    const isSelecting = useRef(false)

    const handleSelectionChange = useCallback(() => {
        const windowSelection = window.getSelection()

        if (!windowSelection || windowSelection.isCollapsed || windowSelection.toString().trim() === '') {
            if (!isSelecting.current) {
                setSelection(null)
            }
            return
        }

        const range = windowSelection.getRangeAt(0)
        const selectedText = windowSelection.toString().trim()

        if (!selectedText) {
            setSelection(null)
            return
        }

        // Find the parent script block
        let node: Node | null = range.commonAncestorContainer
        let blockId: string | null = null

        while (node && node !== document.body) {
            if (node instanceof Element) {
                const id = node.getAttribute('data-block-id')
                if (id) {
                    blockId = id
                    break
                }
            }
            node = node.parentNode
        }

        if (!blockId) {
            setSelection(null)
            return
        }

        const rect = range.getBoundingClientRect()

        setSelection({
            text: selectedText,
            blockId,
            rect,
            range,
        })
    }, [])

    const handleMouseDown = useCallback(() => {
        isSelecting.current = true
    }, [])

    const handleMouseUp = useCallback(() => {
        isSelecting.current = false
        // Small delay to let selection finalize
        setTimeout(handleSelectionChange, 10)
    }, [handleSelectionChange])

    const clearSelection = useCallback(() => {
        window.getSelection()?.removeAllRanges()
        setSelection(null)
    }, [])

    useEffect(() => {
        document.addEventListener('selectionchange', handleSelectionChange)
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange)
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [handleSelectionChange, handleMouseDown, handleMouseUp])

    return { selection, clearSelection }
}
