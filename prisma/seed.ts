import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create KRTVA admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@krtva.com' },
        update: {},
        create: {
            email: 'admin@krtva.com',
            name: 'KRTVA Admin',
            passwordHash: adminPassword,
            role: 'krtva',
        },
    })
    console.log('Created admin:', admin.email)

    // Create client user
    const clientPassword = await bcrypt.hash('client123', 12)
    const client = await prisma.user.upsert({
        where: { email: 'client@example.com' },
        update: {},
        create: {
            email: 'client@example.com',
            name: 'Test Client',
            passwordHash: clientPassword,
            role: 'client',
        },
    })
    console.log('Created client:', client.email)

    // Create a sample project for the client
    const project = await prisma.project.upsert({
        where: { id: 'sample-project-1' },
        update: {},
        create: {
            id: 'sample-project-1',
            title: 'Horizon Coffee Campaign',
            clientId: client.id,
        },
    })
    console.log('Created project:', project.title)

    // Create a sample video
    const video = await prisma.video.upsert({
        where: { id: 'sample-video-1' },
        update: {},
        create: {
            id: 'sample-video-1',
            projectId: project.id,
            title: 'First Light — 30s Commercial',
            youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            displayOrder: 0,
        },
    })
    console.log('Created video:', video.title)

    // Create tabs for the video
    await prisma.tab.createMany({
        skipDuplicates: true,
        data: [
            {
                id: 'tab-overview',
                videoId: video.id,
                tabType: 'overview',
                title: 'Overview',
                content: { text: 'This is a 30-second commercial for Horizon Coffee, capturing the ritual of morning coffee through cinematic visuals and evocative voiceover.' },
                displayOrder: 0,
            },
            {
                id: 'tab-preproduction',
                videoId: video.id,
                tabType: 'preproduction',
                title: 'Pre-production',
                content: { text: 'Shot list:\n- Mountain valley at dawn\n- Close-up hands picking coffee cherries\n- Roasting and pour-over montage\n- Morning kitchen scene\n- Product shot with end card' },
                displayOrder: 1,
            },
            {
                id: 'tab-script-1',
                videoId: video.id,
                tabType: 'script',
                title: 'Script v1',
                content: {
                    blocks: [
                        { id: 'block-1', timecode: '00:00 - 00:05', visual: 'FADE IN on a misty mountain valley at dawn.', audio: '(Natural ambience)' },
                        { id: 'block-2', timecode: '00:05 - 00:10', visual: 'CLOSE-UP: Hands selecting coffee cherries.', audio: 'VO: "Some mornings demand more than coffee."' },
                        { id: 'block-3', timecode: '00:10 - 00:20', visual: 'MONTAGE: Roasting, grinding, pour-over.', audio: 'VO: "They demand a ritual."' },
                        { id: 'block-4', timecode: '00:20 - 00:30', visual: 'PRODUCT SHOT with end card.', audio: 'VO: "Horizon Coffee. First light of something new."' },
                    ],
                },
                displayOrder: 2,
            },
            {
                id: 'tab-moodboard',
                videoId: video.id,
                tabType: 'moodboard',
                title: 'Moodboard',
                content: { items: [] },
                displayOrder: 3,
            },
        ],
    })
    console.log('Created tabs')

    console.log('\n✅ Seed complete!')
    console.log('\nTest credentials:')
    console.log('  KRTVA Admin: admin@krtva.com / admin123')
    console.log('  Client: client@example.com / client123')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
