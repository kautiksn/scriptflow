import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { VideoContent } from './video-content'

interface VideoPageProps {
    params: Promise<{ id: string }>
}

export default async function VideoPage({ params }: VideoPageProps) {
    const { id } = await params
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const video = await prisma.video.findUnique({
        where: { id },
        include: {
            project: true,
            tabs: {
                orderBy: { displayOrder: 'asc' },
                include: {
                    comments: {
                        orderBy: { createdAt: 'desc' },
                    },
                },
            },
        },
    })

    if (!video) {
        notFound()
    }

    // Verify access - client can only view their own projects
    if (session.role === 'client' && video.project.clientId !== session.userId) {
        redirect('/dashboard')
    }

    return (
        <VideoContent
            video={video}
            user={{
                id: session.userId,
                name: session.name,
                role: session.role
            }}
        />
    )
}
