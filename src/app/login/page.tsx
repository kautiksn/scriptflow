'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { login } from '@/app/actions/auth'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [role, setRole] = useState<'client' | 'krtva'>('client')

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-[#1A1A1A] tracking-tight">
                        ScriptFlow
                    </h1>
                    <p className="text-sm text-[#737373] mt-1">
                        Script review portal
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl border border-[#E5E5E5] p-8 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-6">
                        Sign in to your account
                    </h2>

                    {/* Role Toggle */}
                    <div className="flex rounded-lg bg-[#F5F5F5] p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('client')}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all-200 ${role === 'client'
                                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                                    : 'text-[#737373] hover:text-[#1A1A1A]'
                                }`}
                        >
                            Client
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('krtva')}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all-200 ${role === 'krtva'
                                    ? 'bg-white text-[#1A1A1A] shadow-sm'
                                    : 'text-[#737373] hover:text-[#1A1A1A]'
                                }`}
                        >
                            KRTVA Member
                        </button>
                    </div>

                    {/* Login Form */}
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="w-full px-4 py-2.5 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all-200"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-2.5 text-sm bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all-200"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                `Sign in as ${role === 'krtva' ? 'KRTVA Member' : 'Client'}`
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[#A3A3A3] mt-6">
                    Powered by KRTVA
                </p>
            </motion.div>
        </div>
    )
}
