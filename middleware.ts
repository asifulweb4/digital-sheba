import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing!')
}
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value

    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    const isAdmin = request.nextUrl.pathname.startsWith('/admin')
    const isAuth = request.nextUrl.pathname.startsWith('/auth')

    let payload = null;
    if (session) {
        try {
            const verified = await jwtVerify(session, SECRET)
            payload = verified.payload
        } catch (err) {
            // Invalid token (e.g. secret changed or expired)
        }
    }

    if (isDashboard || isAdmin) {
        if (!payload) {
            const res = NextResponse.redirect(new URL('/auth/login', request.url))
            res.cookies.delete('session')
            return res
        }
        
        if (isAdmin && (payload as any).role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    if (isAuth && payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isAuth && session && !payload) {
        const res = NextResponse.next()
        res.cookies.delete('session')
        return res
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}