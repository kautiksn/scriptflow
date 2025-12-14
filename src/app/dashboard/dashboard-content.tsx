'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Play, LogOut, Folder, Plus, X, FileText, MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { createProject, createVideo, deleteProject, updateProject, deleteVideo } from '@/app/actions/admin'

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
    const router = useRouter()
    const [showNewProject, setShowNewProject] = useState(false)
    const [showNewVideo, setShowNewVideo] = useState<string | null>(null)
    const [editingProject, setEditingProject] = useState<{ id: string; title: string } | null>(null)
    const [projectMenu, setProjectMenu] = useState<string | null>(null)
    const [videoMenu, setVideoMenu] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isAdmin = user.role === 'krtva'

    async function handleCreateProject(formData: FormData) {
        setIsSubmitting(true)
        await createProject(formData)
        setIsSubmitting(false)
        setShowNewProject(false)
    }

    async function handleCreateVideo(formData: FormData) {
        setIsSubmitting(true)
        await createVideo(formData)
        setIsSubmitting(false)
        setShowNewVideo(null)
    }

    async function handleDeleteProject(projectId: string) {
        if (confirm('Are you sure you want to delete this project? All scripts will be deleted.')) {
            await deleteProject(projectId)
            setProjectMenu(null)
            router.refresh()
        }
    }

    async function handleUpdateProject(e: React.FormEvent) {
        e.preventDefault()
        if (!editingProject) return
        setIsSubmitting(true)
        await updateProject(editingProject.id, { title: editingProject.title })
        setIsSubmitting(false)
        setEditingProject(null)
        router.refresh()
    }

    async function handleDeleteVideo(videoId: string) {
        if (confirm('Are you sure you want to delete this script?')) {
            await deleteVideo(videoId)
            setVideoMenu(null)
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]" onClick={() => { setProjectMenu(null); setVideoMenu(null) }}>
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
                        <p className="text-sm text-[#737373]">
                            Welcome, {user.name}
                            {isAdmin && <span className="ml-2 text-xs bg-[#1A1A1A] text-white px-2 py-0.5 rounded">Admin</span>}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <button
                                onClick={() => setShowNewProject(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black transition-all-200"
                            >
                                <Plus className="w-4 h-4" />
                                New Project
                            </button>
                        )}
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
                            {isAdmin ? 'Create your first project to get started.' : 'Your projects will appear here once they\'re assigned.'}
                        </p>
                        {isAdmin && (
                            <button
                                onClick={() => setShowNewProject(true)}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black transition-all-200"
                            >
                                <Plus className="w-4 h-4" />
                                Create Project
                            </button>
                        )}
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
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[#1A1A1A]">
                                    {project.title}
                                </h2>
                                <div className="flex items-center gap-2">
                                    {isAdmin && (
                                        <>
                                            <button
                                                onClick={() => setShowNewVideo(project.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#737373] hover:text-[#1A1A1A] border border-[#E5E5E5] rounded-lg hover:bg-[#F5F5F5] transition-all-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Script
                                            </button>
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setProjectMenu(projectMenu === project.id ? null : project.id)
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-[#F5F5F5] transition-all-200"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-[#737373]" />
                                                </button>
                                                {projectMenu === project.id && (
                                                    <div
                                                        className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-[#E5E5E5] shadow-lg py-1 z-20"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setEditingProject({ id: project.id, title: project.title })
                                                                setProjectMenu(null)
                                                            }}
                                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F5F5]"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                            Rename
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProject(project.id)}
                                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {project.videos.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#E5E5E5]">
                                    <FileText className="w-8 h-8 text-[#E5E5E5] mx-auto mb-2" />
                                    <p className="text-sm text-[#737373]">No scripts in this project</p>
                                    {isAdmin && (
                                        <button
                                            onClick={() => setShowNewVideo(project.id)}
                                            className="mt-3 text-sm text-[#1A1A1A] hover:underline"
                                        >
                                            Add your first script →
                                        </button>
                                    )}
                                </div>
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
                                                className="relative group"
                                            >
                                                <Link
                                                    href={`/video/${video.id}`}
                                                    className="block bg-white rounded-xl border border-[#E5E5E5] overflow-hidden hover:border-[#D4D4D4] hover:shadow-md transition-all-200"
                                                >
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
                                                                <FileText className="w-12 h-12 text-[#E5E5E5]" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all-200 flex items-center justify-center">
                                                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all-200 shadow-lg">
                                                                <Play className="w-6 h-6 text-[#1A1A1A] ml-1" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-medium text-[#1A1A1A] line-clamp-2 group-hover:text-black transition-all-200">
                                                            {video.title}
                                                        </h3>
                                                    </div>
                                                </Link>

                                                {/* Video menu for admin */}
                                                {isAdmin && (
                                                    <div className="absolute top-2 right-2 z-10">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                setVideoMenu(videoMenu === video.id ? null : video.id)
                                                            }}
                                                            className="p-1.5 bg-white/90 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition-all-200"
                                                        >
                                                            <MoreVertical className="w-4 h-4 text-[#737373]" />
                                                        </button>
                                                        {videoMenu === video.id && (
                                                            <div
                                                                className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-[#E5E5E5] shadow-lg py-1"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <button
                                                                    onClick={() => handleDeleteVideo(video.id)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </main>

            {/* New Project Modal */}
            <AnimatePresence>
                {showNewProject && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-50"
                            onClick={() => setShowNewProject(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                        >
                            <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-[#1A1A1A]">New Project</h2>
                                    <button onClick={() => setShowNewProject(false)} className="p-1.5 -m-1.5 rounded-md hover:bg-[#F5F5F5]">
                                        <X className="w-4 h-4 text-[#737373]" />
                                    </button>
                                </div>
                                <form action={handleCreateProject}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Project Name</label>
                                            <input
                                                type="text"
                                                name="title"
                                                required
                                                placeholder="e.g., Horizon Coffee Campaign"
                                                className="w-full px-4 py-2.5 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                                Client Email <span className="text-[#A3A3A3] font-normal">(optional)</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="clientEmail"
                                                placeholder="client@example.com"
                                                className="w-full px-4 py-2.5 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-6 py-3 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Project'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Edit Project Modal */}
            <AnimatePresence>
                {editingProject && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-50"
                            onClick={() => setEditingProject(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                        >
                            <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-[#1A1A1A]">Rename Project</h2>
                                    <button onClick={() => setEditingProject(null)} className="p-1.5 -m-1.5 rounded-md hover:bg-[#F5F5F5]">
                                        <X className="w-4 h-4 text-[#737373]" />
                                    </button>
                                </div>
                                <form onSubmit={handleUpdateProject}>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Project Name</label>
                                        <input
                                            type="text"
                                            value={editingProject.title}
                                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-6 py-3 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* New Video Modal */}
            <AnimatePresence>
                {showNewVideo && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-50"
                            onClick={() => setShowNewVideo(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                        >
                            <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-[#1A1A1A]">Add Script</h2>
                                    <button onClick={() => setShowNewVideo(null)} className="p-1.5 -m-1.5 rounded-md hover:bg-[#F5F5F5]">
                                        <X className="w-4 h-4 text-[#737373]" />
                                    </button>
                                </div>
                                <form action={handleCreateVideo}>
                                    <input type="hidden" name="projectId" value={showNewVideo} />
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Script Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                required
                                                placeholder="e.g., First Light — 30s Commercial"
                                                className="w-full px-4 py-2.5 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                                YouTube URL <span className="text-[#A3A3A3] font-normal">(optional)</span>
                                            </label>
                                            <input
                                                type="url"
                                                name="youtubeUrl"
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="w-full px-4 py-2.5 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-6 py-3 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Adding...' : 'Add Script'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
