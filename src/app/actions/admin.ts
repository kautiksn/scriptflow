'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Verify admin access
async function verifyAdmin() {
    const session = await getSession()
    if (!session || session.role !== 'krtva') {
        throw new Error('Unauthorized')
    }
    return session
}

// ===== PROJECTS =====

export async function createProject(formData: FormData) {
    await verifyAdmin()

    const title = formData.get('title') as string
    const clientEmail = formData.get('clientEmail') as string

    if (!title) {
        return { error: 'Project title is required' }
    }

    // Find or create client
    let client = await prisma.user.findUnique({
        where: { email: clientEmail },
    })

    if (!client && clientEmail) {
        // Create a placeholder client
        const { hashPassword } = await import('@/lib/auth')
        client = await prisma.user.create({
            data: {
                email: clientEmail,
                name: clientEmail.split('@')[0],
                passwordHash: await hashPassword('changeme123'),
                role: 'client',
            },
        })
    }

    const project = await prisma.project.create({
        data: {
            title,
            clientId: client?.id,
        },
    })

    revalidatePath('/dashboard')
    return { success: true, projectId: project.id }
}

export async function deleteProject(projectId: string) {
    await verifyAdmin()

    await prisma.project.delete({
        where: { id: projectId },
    })

    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateProject(projectId: string, data: { title?: string }) {
    await verifyAdmin()

    await prisma.project.update({
        where: { id: projectId },
        data: {
            ...(data.title && { title: data.title }),
        },
    })

    revalidatePath('/dashboard')
    return { success: true }
}

// ===== VIDEOS =====

export async function createVideo(formData: FormData) {
    await verifyAdmin()

    const projectId = formData.get('projectId') as string
    const title = formData.get('title') as string
    const thumbnailUrl = formData.get('thumbnailUrl') as string

    if (!projectId || !title) {
        return { error: 'Project ID and title are required' }
    }

    // Get next display order
    const lastVideo = await prisma.video.findFirst({
        where: { projectId },
        orderBy: { displayOrder: 'desc' },
    })

    const video = await prisma.video.create({
        data: {
            projectId,
            title,
            youtubeUrl: '',
            thumbnailUrl: thumbnailUrl || null,
            displayOrder: (lastVideo?.displayOrder ?? -1) + 1,
        },
    })

    // Create default tabs
    await prisma.tab.createMany({
        data: [
            {
                videoId: video.id,
                tabType: 'overview',
                title: 'Overview',
                content: { text: '' },
                displayOrder: 0,
            },
            {
                videoId: video.id,
                tabType: 'preproduction',
                title: 'Pre-production',
                content: { text: '' },
                displayOrder: 1,
            },
            {
                videoId: video.id,
                tabType: 'script',
                title: 'Script v1',
                content: {
                    blocks: [
                        { id: 'block-1', timecode: '00:00 - 00:05', visual: '', audio: '' },
                    ],
                },
                displayOrder: 2,
            },
            {
                videoId: video.id,
                tabType: 'moodboard',
                title: 'Moodboard',
                content: { items: [] },
                displayOrder: 3,
            },
        ],
    })

    revalidatePath('/dashboard')
    return { success: true, videoId: video.id }
}

export async function deleteVideo(videoId: string) {
    await verifyAdmin()

    await prisma.video.delete({
        where: { id: videoId },
    })

    revalidatePath('/dashboard')
    return { success: true }
}

// ===== TABS =====

export async function createTab(formData: FormData) {
    await verifyAdmin()

    const videoId = formData.get('videoId') as string
    const title = formData.get('title') as string
    const tabType = formData.get('tabType') as string || 'script'

    if (!videoId || !title) {
        return { error: 'Video ID and title are required' }
    }

    // Get next display order
    const lastTab = await prisma.tab.findFirst({
        where: { videoId },
        orderBy: { displayOrder: 'desc' },
    })

    const defaultContent = tabType === 'script'
        ? { blocks: [{ id: 'block-1', timecode: '00:00 - 00:05', visual: '', audio: '' }] }
        : tabType === 'moodboard'
            ? { items: [] }
            : { text: '' }

    const tab = await prisma.tab.create({
        data: {
            videoId,
            tabType: tabType as 'overview' | 'preproduction' | 'script' | 'moodboard',
            title,
            content: defaultContent,
            displayOrder: (lastTab?.displayOrder ?? -1) + 1,
        },
    })

    revalidatePath(`/video/${videoId}`)
    return { success: true, tabId: tab.id }
}

export async function deleteTab(tabId: string) {
    await verifyAdmin()

    const tab = await prisma.tab.findUnique({
        where: { id: tabId },
        select: { videoId: true },
    })

    await prisma.tab.delete({
        where: { id: tabId },
    })

    if (tab) {
        revalidatePath(`/video/${tab.videoId}`)
    }
    return { success: true }
}

export async function updateTabContent(tabId: string, content: unknown) {
    await verifyAdmin()

    const tab = await prisma.tab.update({
        where: { id: tabId },
        data: { content: content as object },
    })

    revalidatePath(`/video/${tab.videoId}`)
    return { success: true }
}

// ===== COMMENTS =====

export async function createComment(formData: FormData) {
    const session = await getSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    const tabId = formData.get('tabId') as string
    const blockId = formData.get('blockId') as string
    const text = formData.get('text') as string
    const selectedText = formData.get('selectedText') as string
    const authorName = formData.get('authorName') as string
    const authorColor = formData.get('authorColor') as string

    if (!tabId || !text || !authorName) {
        return { error: 'Missing required fields' }
    }

    const comment = await prisma.comment.create({
        data: {
            tabId,
            blockId: blockId || 'general',
            text,
            selectedText: selectedText || null,
            authorName,
            authorColor: authorColor || '#1A1A1A',
        },
    })

    const tab = await prisma.tab.findUnique({
        where: { id: tabId },
        select: { videoId: true },
    })

    if (tab) {
        revalidatePath(`/video/${tab.videoId}`)
    }

    return { success: true, commentId: comment.id }
}
