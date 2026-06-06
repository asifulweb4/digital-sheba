'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/lib/actions'
import { User, Phone, CreditCard, Mail, ArrowLeft, ShieldCheck, MapPin, Calendar } from 'lucide-react'

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            const profileData = await getProfile()
            if (!profileData) {
                router.push('/auth/login')
                return
            }
            setProfile(profileData)
            setLoading(false)
        }
        fetchProfile()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6fdf9]">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f6fdf9] p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="group flex items-center gap-2 text-emerald-800 hover:text-emerald-600 mb-8 font-black text-sm transition-all"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    ড্যাশবোর্ডে ফিরে যান
                </button>

                <div className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50">
                    <div className="h-32 bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#059669] relative">
                        <div className="absolute inset-0 grid-dots opacity-20" />
                    </div>

                    <div className="px-8 pb-10">
                        <div className="relative -mt-16 mb-8 flex flex-col sm:flex-row items-end gap-6">
                            <div className="w-32 h-32 rounded-[2rem] bg-white p-2 shadow-xl">
                                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-700 text-4xl font-black border-2 border-emerald-50">
                                    {profile?.fullName?.charAt(0)}
                                </div>
                            </div>
                            <div className="flex-1 mb-2">
                                <h1 className="text-3xl font-black text-[#022c22]">{profile?.fullName}</h1>
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mt-1">
                                    <ShieldCheck size={16} /> 
                                    Verified User 
                                    <span className="mx-2 text-gray-300">|</span>
                                    Phone: {profile?.phone}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <InfoItem icon={Mail} label="ইমেইল ঠিকানা" value={profile?.email} />
                                <InfoItem icon={Phone} label="মোবাইল নম্বর" value={profile?.phone} />
                                <InfoItem icon={CreditCard} label="এনআইডি নম্বর" value={profile?.nid || 'NID দেওয়া হয়নি'} />
                            </div>

                            <div className="space-y-4">
                                <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl">
                                    <p className="text-emerald-800 text-xs font-black uppercase tracking-widest mb-2">বর্তমান ব্যালেন্স</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-emerald-900">{profile?.balance}</span>
                                        <span className="text-emerald-600 font-bold text-lg">৳ (টাকা)</span>
                                    </div>
    
                                </div>

                                <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl">
                                    <p className="text-amber-800 text-xs font-black uppercase tracking-widest mb-1">একাউন্ট স্ট্যাটাস</p>
                                    <p className="text-amber-600 font-black text-lg">সক্রিয় (Active)</p>
                                    <p className="text-amber-700/60 text-xs font-bold mt-1">আপনি আমাদের সব সেবা উপভোগ করতে পারবেন</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-emerald-100 rounded-3xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-gray-100 group-hover:border-emerald-100 transition-all">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-[#022c22] font-bold text-sm">{value || 'Not Provided'}</p>
            </div>
        </div>
    )
}