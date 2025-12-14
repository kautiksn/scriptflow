'use client'

import { useSearchParams } from 'next/navigation'

export type AccessMode = 'admin' | 'client'

export function useAccessMode(): AccessMode {
    const searchParams = useSearchParams()
    const accessParam = searchParams.get('access')

    return accessParam === 'admin' ? 'admin' : 'client'
}
