import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/actions'

export async function GET() {
    const profile = await getProfile()
    if (!profile) return NextResponse.json(null, { status: 401 })
    return NextResponse.json(profile)
}