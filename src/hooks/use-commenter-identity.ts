'use client'

import { useState, useEffect } from 'react'

interface CommenterIdentity {
    name: string
    color: string
    browserId: string
}

const STORAGE_KEY = 'scriptflow_commenter'

function generateBrowserId(): string {
    return `browser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function useCommenterIdentity() {
    const [identity, setIdentityState] = useState<CommenterIdentity | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setIdentityState(parsed)
            } catch {
                // Invalid JSON, clear it
                localStorage.removeItem(STORAGE_KEY)
            }
        }
        setIsLoaded(true)
    }, [])

    const setIdentity = (data: { name: string; color: string }) => {
        const newIdentity: CommenterIdentity = {
            ...data,
            browserId: identity?.browserId || generateBrowserId(),
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIdentity))
        setIdentityState(newIdentity)
        setShowPrompt(false)

        // TODO: Sync to database via server action
    }

    const promptForIdentity = () => {
        if (!identity && isLoaded) {
            setShowPrompt(true)
        }
    }

    const hidePrompt = () => {
        setShowPrompt(false)
    }

    const clearIdentity = () => {
        localStorage.removeItem(STORAGE_KEY)
        setIdentityState(null)
    }

    return {
        identity,
        showPrompt,
        isLoaded,
        setIdentity,
        promptForIdentity,
        hidePrompt,
        clearIdentity,
    }
}
