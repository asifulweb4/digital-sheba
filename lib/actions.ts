'use server'
import { db } from './db'
import { profiles, orders, transactions } from './schema'
import { eq, desc, sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { hashPassword, comparePassword, createToken, getSession } from './auth'

// --- Custom Auth Actions ---

export async function registerAction(formData: any) {
    const { name, phone, password } = formData
    
    let formattedPhone = phone.trim().replace(/\s/g, '')
    if (formattedPhone.startsWith('+88')) formattedPhone = formattedPhone.replace('+88', '')
    
    // Check if user exists
    const existing = await db.select().from(profiles).where(eq(profiles.phone, formattedPhone)).limit(1)
    if (existing.length > 0) return { success: false, message: 'এই নম্বরটি ইতিমধ্যে ব্যবহার করা হয়েছে' }

    try {
        const hashedPassword = await hashPassword(password)
        await db.insert(profiles).values({
            fullName: name,
            phone: formattedPhone,
            password: hashedPassword,
            balance: 0,
            role: 'user'
        })
        return { success: true }
    } catch (err) {
        console.error(err)
        return { success: false, message: 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে' }
    }
}

export async function loginAction(formData: any) {
    const { phone, password } = formData
    
    // Format phone: remove spaces and ensure it starts with 0
    let formattedPhone = phone.trim().replace(/\s/g, '')
    if (formattedPhone.startsWith('+88')) formattedPhone = formattedPhone.replace('+88', '')

    const user = await db.select().from(profiles).where(eq(profiles.phone, formattedPhone)).limit(1)
    if (user.length === 0) return { success: false, message: 'অ্যাকাউন্ট পাওয়া যায়নি' }

    const isMatch = await comparePassword(password, user[0].password)
    if (!isMatch) return { success: false, message: 'পাসওয়ার্ড ভুল' }

    // Create Session
    const token = await createToken({ id: user[0].id, phone: user[0].phone, role: user[0].role })
    const cookieStore = await cookies()
    cookieStore.set('session', token, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 7 })

    return { success: true }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

// --- Profile Actions ---
export async function getProfile() {
    const session = await getSession()
    if (!session) return null
    const user = await db.select().from(profiles).where(eq(profiles.id, (session as any).id)).limit(1)
    return user[0] || null
}

// --- Order Actions ---
export async function placeOrderAction(service: { id: string, title: string, price: number }, inputData: string) {
    const session = await getSession()
    if (!session) return { success: false, message: 'লগইন করুন' }

    const profile = await db.select().from(profiles).where(eq(profiles.id, (session as any).id)).limit(1)
    if (profile.length === 0 || profile[0].balance < service.price) {
        return { success: false, message: 'পর্যাপ্ত ব্যালেন্স নেই' }
    }

    try {
        await db.transaction(async (tx) => {
            await tx.update(profiles)
                .set({ balance: profile[0].balance - service.price })
                .where(eq(profiles.id, (session as any).id))

            await tx.insert(orders).values({
                userId: profile[0].phone,
                serviceId: service.id,
                serviceName: service.title,
                price: service.price,
                inputData: inputData,
                status: 'pending',
            })
        })
        revalidatePath('/dashboard')
        return { success: true }
    } catch (err) {
        console.error(err)
        return { success: false, message: 'অর্ডার করতে সমস্যা হয়েছে' }
    }
}

export async function getOrdersAction() {
    const session = await getSession()
    if (!session) return []
    return await db.select().from(orders).where(eq(orders.userId, (session as any).phone)).orderBy(desc(orders.createdAt))
}

// --- Balance/Transaction Actions ---
export async function addBalanceAction(amount: number, trxId: string, method: string, description: string) {
    const session = await getSession()
    if (!session) return { success: false, message: 'লগইন করুন' }

    try {
        await db.insert(transactions).values({
            userId: (session as any).phone,
            amount,
            method,
            trxId,
            description,
            status: 'pending',
        })
        revalidatePath('/admin')
        return { success: true, message: 'রিচার্জ রিকোয়েস্ট সাবমিট হয়েছে' }
    } catch (err) {
        console.error(err)
        return { success: false, message: 'এই TrxID টি আগে ব্যবহার হয়েছে' }
    }
}

// --- Admin Actions ---
export async function getAdminStats() {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return null

    const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.createdAt))
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt))
    const allUsers = await db.select().from(profiles).orderBy(desc(profiles.createdAt))

    return { transactions: allTransactions, orders: allOrders, users: allUsers }
}

export async function approveTransactionAction(id: number) {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return { success: false }

    try {
        await db.transaction(async (tx) => {
            const txn = await tx.select().from(transactions).where(eq(transactions.id, id)).limit(1)
            if (txn.length === 0 || txn[0].status !== 'pending') throw new Error('Invalid Transaction')

            const amount = Number(txn[0].amount)
            const userPhone = txn[0].userId as string

            // Update transaction status
            await tx.update(transactions).set({ status: 'approved' }).where(eq(transactions.id, id))

            // Update profile balance using atomic addition
            await tx.update(profiles)
                .set({ balance: sql`${profiles.balance} + ${amount}` })
                .where(eq(profiles.phone, userPhone))
        })
        
        revalidatePath('/dashboard')
        revalidatePath('/admin')
        return { success: true }
    } catch (err) {
        console.error('Approval error:', err)
        return { success: false }
    }
}

export async function rejectTransactionAction(id: number) {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return { success: false }
    await db.update(transactions).set({ status: 'rejected' }).where(eq(transactions.id, id))
    return { success: true }
}

export async function updateOrderAction(id: number, status: string, notes: string) {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return { success: false }
    await db.update(orders).set({ status }).where(eq(orders.id, id))
    return { success: true }
}
