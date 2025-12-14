import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardContent } from './dashboard-content'

export default async function DashboardPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    // Admin sees all projects, clients see only their own
    const isAdmin = session.role === 'krtva'

    const projects = await prisma.project.findMany({
        where: isAdmin ? {} : { clientId: session.userId },
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
