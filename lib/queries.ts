import { db } from './db';
import { services } from './schema';

export async function getAllServices() {
  try {
    const data = await db.select().from(services);
    return data.map(s => ({
      ...s,
      createdAt: s.createdAt?.toISOString() ?? null,
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return []; // ✅ এরর হলে খালি array return করবে, crash করবে না
  }
}