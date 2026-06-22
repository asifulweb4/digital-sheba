import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing!')
}
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}

export async function createToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET)
        return payload
    } catch (err) {
        return null
    }
}

export async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
    if (!token) return null
    return await verifyToken(token)
}
