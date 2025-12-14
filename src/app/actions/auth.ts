'use server'

import { redirect } from 'next/navigation'
import { authenticateUser, createSession, destroySession } from '@/lib/auth'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const user = await authenticateUser(email, password)

    if (!user) {
        return { error: 'Invalid email or password' }
    }

    await createSession(user)

    // Redirect based on role
    if (user.role === 'krtva') {
        redirect('/admin')
    } else {
        redirect('/dashboard')
    }
}

export async function logout() {
    await destroySession()
    redirect('/login')
}
