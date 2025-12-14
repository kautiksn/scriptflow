import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardContent } from './dashboard-content'

export default async function DashboardPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    // Get projects with videos for this client
    const projects = await prisma.project.findMany({
        where: {
            clientId: session.userId,
        },
        include: {
            videos: {
                orderBy: { displayOrder: 'asc' },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <DashboardContent
            user={{ name: session.name, role: session.role }}
            projects={projects}
        />
    )
}
