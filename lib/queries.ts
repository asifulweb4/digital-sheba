import { db } from './db';
import { services } from './schema';

export async function getAllServices() {
  try {
    // Vercel build টাইমে ডাটাবেস কানেকশন হ্যাং হলে যেন বিল্ড ফেইল না করে, তাই ৩ সেকেন্ডের টাইমআউট যোগ করা হলো
    const data = await Promise.race([
      db.select().from(services),
      new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000))
    ]);
    
    return data.map(s => ({
      ...s,
      createdAt: s.createdAt?.toISOString() ?? null,
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}