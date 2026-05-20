// app/api/services/route.ts
import { db } from '@/lib/db';
import { services } from '@/lib/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await Promise.race([
      db.select().from(services),
      new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000))
    ]);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}