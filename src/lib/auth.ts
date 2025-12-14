import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'
const COOKIE_NAME = 'scriptflow_session'

export interface SessionPayload {
    userId: string
    email: string
    name: string
    role: 'krtva' | 'client'
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

// JWT Session management
export function createToken(payload: SessionPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): SessionPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as SessionPayload
    } catch {
        return null
    }
}

// Cookie-based session
export async function createSession(payload: SessionPayload): Promise<void> {
    const token = createToken(payload)
    const cookieStore = await cookies()

    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    })
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) return null
    return verifyToken(token)
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

// User operations
export async function createUser(
    email: string,
    password: string,
    name: string,
    role: 'krtva' | 'client'
) {
    const passwordHash = await hashPassword(password)

    return prisma.user.create({
        data: {
            email,
            passwordHash,
            name,
            role,
        },
    })
}

export async function authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) return null

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) return null

    return {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'krtva' | 'client',
    }
}
