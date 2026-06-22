'use server'
import { db } from './db'
import { profiles, orders, transactions } from './schema'
import { eq, desc, sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { hashPassword, comparePassword, createToken, getSession } from './auth'

// --- Auth ---

export async function registerAction(formData: any) {
    const { name, phone, password } = formData
    
    // Security: Input length limits to prevent DoS
    if (typeof password !== 'string' || password.length > 72) return { success: false, message: 'পাসওয়ার্ডটি ৭২ ক্যারেক্টারের নিচে হতে হবে' }
    if (typeof name !== 'string' || name.length > 100) return { success: false, message: 'নামটি ১০০ ক্যারেক্টারের নিচে হতে হবে' }
    
    let formattedPhone = phone.trim().replace(/\s/g, '')
    if (formattedPhone.startsWith('+88')) formattedPhone = formattedPhone.replace('+88', '')

    const existing = await db.select().from(profiles).where(eq(profiles.phone, formattedPhone)).limit(1)
    if (existing.length > 0) return { success: false, message: 'এই নম্বরটি ইতিমধ্যে ব্যবহার করা হয়েছে' }

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
        return { success: false, message: 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে' }
    }
}

export async function loginAction(formData: any) {
    const { phone, password } = formData
    
    // Security: Input length limit
    if (typeof password !== 'string' || password.length > 72) return { success: false, message: 'পাসওয়ার্ড খুব বড়' }

    let formattedPhone = phone.trim().replace(/\s/g, '')
    if (formattedPhone.startsWith('+88')) formattedPhone = formattedPhone.replace('+88', '')

    const user = await db.select().from(profiles).where(eq(profiles.phone, formattedPhone)).limit(1)
    if (user.length === 0) return { success: false, message: 'অ্যাকাউন্ট পাওয়া যায়নি' }

    const isMatch = await comparePassword(password, user[0].password)
    if (!isMatch) return { success: false, message: 'পাসওয়ার্ড ভুল' }

    const token = await createToken({ id: user[0].id, phone: user[0].phone, role: user[0].role })
    const cookieStore = await cookies()
    cookieStore.set('session', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 })
    return { success: true }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

// --- Profile ---
export async function getProfile() {
    const session = await getSession()
    if (!session) return null
    const user = await db.select().from(profiles).where(eq(profiles.id, (session as any).id)).limit(1)
    
    if (user.length === 0) return null
    // Security: Exclude hashed password from the response
    const { password, ...safeUser } = user[0]
    return safeUser
}

// --- Orders ---
export async function placeOrderAction(service: { id: string, title: string, price: number }, inputData: string) {
    const session = await getSession()
    if (!session) return { success: false, message: 'লগইন করুন' }

    const profile = await db.select().from(profiles).where(eq(profiles.id, (session as any).id)).limit(1)
    if (profile.length === 0 || profile[0].balance < service.price) {
        return { success: false, message: 'পর্যাপ্ত ব্যালেন্স নেই' }
    }

    try {
        // ✅ transaction() ছাড়া — neon-http compatible
        await db.update(profiles)
            .set({ balance: sql`${profiles.balance} - ${service.price}` })
            .where(eq(profiles.id, (session as any).id))

        await db.insert(orders).values({
            userId: profile[0].phone,
            serviceId: service.id,
            serviceName: service.title,
            price: service.price,
            inputData: inputData,
            status: 'pending',
            notes: '',
        })

        revalidatePath('/dashboard')
        return { success: true }
    } catch (err) {
        console.error(err)
        return { success: false, message: 'অর্ডার করতে সমস্যা হয়েছে' }
    }
}

export async function getOrdersAction() {
    const session = await getSession()
    if (!session) return []
    return await db.select().from(orders)
        .where(eq(orders.userId, (session as any).phone))
        .orderBy(desc(orders.createdAt))
}

// --- Balance ---
// ✅ Recharge করলে সাথে সাথে balance add হবে
export async function addBalanceAction(amount: number, trxId: string, method: string, description: string) {
    const session = await getSession()
    if (!session) return { success: false, message: 'লগইন করুন' }

    const userPhone = (session as any).phone
    const userId = (session as any).id

    try {
        // ✅ transaction() ছাড়া — neon-http compatible
        await db.insert(transactions).values({
            userId: userPhone,
            amount,
            method,
            trxId,
            description,
            status: 'approved',
        })

        await db.update(profiles)
            .set({ balance: sql`${profiles.balance} + ${amount}` })
            .where(eq(profiles.id, userId))

        revalidatePath('/dashboard')
        revalidatePath('/admin')
        return { success: true, message: 'ব্যালেন্স সফলভাবে যোগ হয়েছে' }
    } catch (err: any) {
        console.error('addBalanceAction error:', err)
        if (err?.message?.includes('unique') || err?.code === '23505') {
            return { success: false, message: 'এই TrxID টি আগে ব্যবহার হয়েছে' }
        }
        return { success: false, message: 'ব্যালেন্স যোগ করতে সমস্যা হয়েছে' }
    }
}

// --- Admin ---
export async function getAdminStats() {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return null

    const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.createdAt))
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt))
    const allUsers = await db.select().from(profiles).orderBy(desc(profiles.createdAt))

    return { transactions: allTransactions, orders: allOrders, users: allUsers }
}

// ✅ Admin manually approve
export async function approveTransactionAction(id: number) {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return { success: false }

    try {
        const txn = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1)
        if (txn.length === 0) return { success: false, message: 'Transaction not found' }
        if (txn[0].status !== 'pending') return { success: false, message: 'Already processed' }

        const amount = Number(txn[0].amount)
        const userPhone = txn[0].userId as string

        await db.update(transactions)
            .set({ status: 'approved' })
            .where(eq(transactions.id, id))

        await db.update(profiles)
            .set({ balance: sql`${profiles.balance} + ${amount}` })
            .where(eq(profiles.phone, userPhone))

        revalidatePath('/dashboard')
        revalidatePath('/admin')
        return { success: true }
    } catch (err: any) {
        console.error('Approval error:', err)
        return { success: false, message: err.message }
    }
}

export async function rejectTransactionAction(id: number) {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return { success: false }
    await db.update(transactions).set({ status: 'rejected' }).where(eq(transactions.id, id))
    revalidatePath('/admin')
    return { success: true }
}

// --- Withdraw ---
export async function withdrawBalanceAction(amount: number, method: string, receiverNumber: string) {
    const session = await getSession()
    if (!session) return { success: false, message: 'লগইন করুন' }

    const userPhone = (session as any).phone
    const userId = (session as any).id

    // Balance চেক
    const profile = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1)
    if (profile.length === 0 || profile[0].balance < amount) {
        return { success: false, message: 'পর্যাপ্ত ব্যালেন্স নেই' }
    }

    try {
        // Balance কাটো
        await db.update(profiles)
            .set({ balance: sql`${profiles.balance} - ${amount}` })
            .where(eq(profiles.id, userId))

        // Transaction record করো (pending — admin approve করবে)
        await db.insert(transactions).values({
            userId: userPhone,
            amount,
            method,
            trxId: `WD-${Date.now()}-${userId}`,
            description: `Withdraw: ${method}, Receiver: ${receiverNumber}`,
            status: 'pending',
        })

        revalidatePath('/dashboard')
        revalidatePath('/admin')
        return { success: true }
    } catch (err: any) {
        console.error('withdrawBalanceAction error:', err)
        return { success: false, message: 'উইথড্র করতে সমস্যা হয়েছে' }
    }
}

// ✅ Notes সহ order update
export async function updateOrderAction(id: number, status: string, notes: string) {
    const session = await getSession()
    if (!session || (session as any).role !== 'admin') return { success: false }

    await db.update(orders)
        .set({ status, notes })
        .where(eq(orders.id, id))

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    return { success: true }
}