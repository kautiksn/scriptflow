'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Play, LogOut, Folder } from 'lucide-react'
import { logout } from '@/app/actions/auth'

interface Video {
    id: string
    title: string
    youtubeUrl: string
    thumbnailUrl: string | null
}

interface Project {
    id: string
    title: string
    videos: Video[]
}

interface DashboardContentProps {
    user: { name: string; role: string }
    projects: Project[]
}

function getYouTubeThumbnail(url: string): string {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s?]+)/)?.[1]
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
}

export function DashboardContent({ user, projects }: DashboardContentProps) {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="sticky top-0 z-20 glass border-b border-[#E5E5E5]"
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">
                            ScriptFlow
                        </h1>
                        <p className="text-sm text-[#737373]">Welcome, {user.name}</p>
                    </div>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#737373] hover:text-[#1A1A1A] transition-all-200"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </form>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                {projects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <Folder className="w-12 h-12 text-[#E5E5E5] mx-auto mb-4" />
                        <h2 className="text-lg font-medium text-[#1A1A1A]">No projects yet</h2>
                        <p className="text-sm text-[#737373] mt-1">
                            Your projects will appear here once they're assigned.
                        </p>
                    </motion.div>
                ) : (
                    projects.map((project, projectIndex) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: projectIndex * 0.1 }}
                            className="mb-10"
                        >
                            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">
                                {project.title}
                            </h2>

                            {project.videos.length === 0 ? (
                                <p className="text-sm text-[#737373]">No videos in this project</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {project.videos.map((video, videoIndex) => {
                                        const thumbnail = video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl)

                                        return (
                                            <motion.div
                                                key={video.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: videoIndex * 0.05 }}
                                            >
                                                <Link
                                                    href={`/video/${video.id}`}
                                                    className="group block bg-white rounded-xl border border-[#E5E5E5] overflow-hidden hover:border-[#D4D4D4] hover:shadow-md transition-all-200"
                                                >
                                                    {/* Thumbnail */}
                                                    <div className="relative aspect-video bg-[#F5F5F5] overflow-hidden">
                                                        {thumbnail ? (
                                                            <Image
                                                                src={thumbnail}
                                                                alt={video.title}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full">
                                                                <Play className="w-12 h-12 text-[#E5E5E5]" />
                                                            </div>
                                                        )}
                                                        {/* Play overlay */}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all-200 flex items-center justify-center">
                                                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all-200 shadow-lg">
                                                                <Play className="w-6 h-6 text-[#1A1A1A] ml-1" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <div className="p-4">
                                                        <h3 className="font-medium text-[#1A1A1A] line-clamp-2 group-hover:text-black transition-all-200">
                                                            {video.title}
                                                        </h3>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </main>
        </div>
    )
}
