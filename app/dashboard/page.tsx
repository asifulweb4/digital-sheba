'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Menu, X, LogOut, User, Search, Bell, Wallet, Settings, Clock, Send, LogIn, UserPlus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import { services, categories } from '@/lib/services'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeService, setActiveService] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  // পেমেন্ট এবং অর্ডারের নতুন স্টেট
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [trxId, setTrxId] = useState('')
  const [method, setMethod] = useState('bKash')
  const [orderInput, setOrderInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // লগইন না থাকলে → front page এ পাঠাও
        router.push('/')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setProfile(profileData)
      setIsGuest(false)
      setLoading(false)
    }
    getUser()
  }, [router])






  // ১. ব্যালেন্স রিচার্জ রিকোয়েস্ট ফাংশন
  const handleAddBalance = async () => {
    if (!depositAmount || !trxId) return alert("টাকার পরিমাণ এবং TrxID দিন")
    setSubmitting(true)

    const { error } = await supabase.from('transactions').insert([
      {
        user_id: profile?.id,
        amount: Number(depositAmount),
        trx_id: trxId,
        method: method,
        status: 'pending'
      }
    ])

    setSubmitting(false)
    if (error) {
      alert("এই TrxID টি আগে ব্যবহার হয়েছে অথবা ভুল!")
    } else {
      alert("রিকোয়েস্ট পাঠানো হয়েছে! অ্যাডমিন চেক করে ব্যালেন্স যোগ করে দিবে।")
      setPaymentModalOpen(false)
      setTrxId('')
      setDepositAmount('')
    }
  }

  // ২. সার্ভিস অর্ডার কনফার্ম ফাংশন (আপডেট করা হয়েছে)
  const handlePlaceOrder = async (service: any) => {
    if (!orderInput) return alert("প্রয়োজনীয় তথ্য (NID/নাম্বার) দিন")

    // ১. ব্যালেন্স চেক (Frontend check for better UX)
    if ((profile?.balance || 0) < service.price) {
      alert("আপনার পর্যাপ্ত ব্যালেন্স নেই! ব্যালেন্স যোগ করার পেজে নিয়ে যাওয়া হচ্ছে।");
      router.push('/dashboard/balance');
      return;
    }

    setSubmitting(true)

    // ২. সিকিউর RPC কল (অটোমেটিক ব্যালেন্স কাটবে এবং অর্ডার করবে)
    const { data, error: rpcError } = await supabase.rpc('place_order', {
      p_service_id: service.id,
      p_service_name: service.title,
      p_price: service.price,
      p_input_data: orderInput
    })

    if (rpcError || (data && !data.success)) {
      alert(rpcError?.message || data?.message || "অর্ডার করতে সমস্যা হয়েছে।")
    } else {
      alert("অর্ডার সফল হয়েছে!")
      setActiveService(null)
      setOrderInput('')
      window.location.reload()
    }
    setSubmitting(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const filteredServices = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-12 h-12 spinner mx-auto mb-4 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#7c3aed] font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'ড্যাশবোর্ড' },
    { href: '/dashboard/profile', icon: User, label: 'প্রোফাইল' },
    { href: '/dashboard/orders', icon: Clock, label: 'অর্ডার লিস্ট' },
    { href: '/dashboard/balance', icon: Wallet, label: 'ব্যালেন্স যোগ করুন' },
    { href: '/dashboard/settings', icon: Settings, label: 'সেটিংস' },
  ]

  return (
    <div className="min-h-screen relative flex bg-[#f8fafc] overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-300/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-300/20 blur-[100px] pointer-events-none"></div>
      {/* Sidebar - আপনার কোড */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#2e1065] transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-[#7c3aed]">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 text-white font-bold">সহজ ডিজিটাল সেবা</Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white"><X /></button>
            </div>
          </div>
          <div className="p-5">
            {isGuest ? (
              <div className="bg-[#7c3aed] rounded-xl p-4 text-white space-y-2">
                <p className="text-xs opacity-70 text-center">সেবা নিতে প্রথমে লগিন করুন</p>
                <Link href="/auth/login" className="w-full bg-white text-violet-800 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                  <LogIn size={13} /> লগিন
                </Link>
                <Link href="/auth/register" className="w-full bg-violet-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
                  <UserPlus size={13} /> রেজিস্ট্রেশন
                </Link>
              </div>
            ) : (
              <div className="bg-[#7c3aed] rounded-xl p-4 text-white">
                <p className="text-xs opacity-70">বর্তমান ব্যালেন্স</p>
                <p className="text-2xl font-bold">{profile?.balance || 0} ৳</p>
                <button onClick={() => setPaymentModalOpen(true)} className="mt-2 w-full bg-white text-violet-800 py-1.5 rounded-lg text-xs font-bold">রিচার্জ করুন</button>
              </div>
            )}
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-[#7c3aed] hover:text-white transition text-sm">
                <item.icon size={18} /> {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-[#7c3aed]">
            {isGuest ? (
              <Link href="/auth/login" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-violet-300 hover:bg-[#7c3aed] transition text-sm">
                <LogIn size={18} /> লগিন / রেজিস্ট্রেশন
              </Link>
            ) : (
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm">
                <LogOut size={18} /> লগআউট
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500"><Menu /></button>
          <div className="flex-1 max-w-xs relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="সেবা খুঁজুন..." className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border rounded-xl" />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">{profile?.full_name}</p>
              <p className="text-[10px] text-violet-600">ব্যালেন্স: {profile?.balance}৳</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold">{profile?.full_name?.charAt(0)}</div>
          </div>
        </header>

        <main className="p-4 sm:p-6 overflow-y-auto">
          {/* Welcome banner */}
          {isGuest ? (
            <div className="relative bg-gradient-to-br from-[#2e1065] via-[#7c3aed] to-[#c026d3] rounded-3xl p-6 sm:p-8 mb-8 text-white flex justify-between items-center shadow-[0_15px_40px_rgb(124,58,237,0.2)] border border-white/10 overflow-hidden transform transition-all hover:scale-[1.01]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 w-full sm:w-auto">
                <h2 className="text-2xl sm:text-3xl font-black mb-1 drop-shadow-sm tracking-tight text-white/95">সহজ ডিজিটাল সেবা-তে স্বাগতম! <span className="inline-block animate-bounce_slow">👋</span></h2>
                <p className="text-violet-100 text-sm sm:text-base mt-2 mb-6 font-medium tracking-wide max-w-lg">সেবা অর্ডার করতে লগিন বা রেজিস্ট্রেশন করুন — সম্পূর্ণ বিনামূল্যে!</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/auth/register" className="bg-white text-[#2e1065] px-6 py-3 rounded-2xl font-black text-sm shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_25px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all flex items-center gap-2">
                    <UserPlus size={16} strokeWidth={2.5} /> বিনামূল্যে যোগ দিন
                  </Link>
                  <Link href="/auth/login" className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-bold text-sm border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all flex items-center gap-2">
                    <LogIn size={16} /> লগিন
                  </Link>
                </div>
              </div>
              <Wallet size={120} className="absolute right-[-10px] bottom-[-20px] opacity-[0.07] transform -rotate-12 hidden md:block" />
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-[#2e1065] via-[#7c3aed] to-[#c026d3] rounded-3xl p-6 sm:p-8 mb-8 text-white flex justify-between items-center shadow-[0_15px_40px_rgb(124,58,237,0.2)] border border-white/10 overflow-hidden transform transition-all hover:scale-[1.01]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black drop-shadow-sm mb-1 text-white/95">আস্সালামু আলাইকুম, {profile?.full_name?.split(' ')[0]}! <span className="inline-block animate-bounce_slow">👋</span></h2>
                <p className="text-violet-100/90 text-sm sm:text-base mt-1 font-medium tracking-wide mb-5">আজকে আপনি কোন সরকারি সেবাটি নিতে চান?</p>
                <button onClick={() => setPaymentModalOpen(true)} className="bg-white text-[#2e1065] px-6 py-2.5 rounded-2xl font-black text-sm shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_25px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all flex items-center gap-2">
                  <Wallet size={16} strokeWidth={2.5} /> ব্যালেন্স যোগ করুন
                </button>
              </div>
              <Wallet size={120} className="absolute right-[-10px] bottom-[-20px] opacity-[0.07] transform -rotate-12 hidden md:block" />
            </div>
          )}

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-[#7c3aed] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100'}`}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 relative z-10">
            {filteredServices.map(service => (
              <button key={service.id} onClick={() => setActiveService(service.id)} className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-5 text-center border border-white hover:border-violet-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgb(124,58,237,0.1)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`relative z-10 w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-[3deg] transition-transform duration-300 shadow-[0_4px_15px_rgb(0,0,0,0.1)]`}>
                  {service.icon}
                </div>
                <p className="relative z-10 text-xs font-bold text-gray-800 leading-tight mb-3 line-clamp-2">{service.title}</p>
                <div className="relative z-10 inline-flex items-center justify-center bg-gradient-to-r from-violet-50 to-fuchsia-50 text-[#7c3aed] px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide border border-violet-100/60 shadow-inner">
                  <span className="mr-0.5 opacity-60">৳</span> {service.price}
                </div>
              </button>
            ))}
          </div>

          {/* রিচার্জ মোডাল (Add Balance) */}
          {paymentModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Wallet className="text-violet-600" /> রিচার্জ করুন</h3>
                <div className="bg-violet-50 p-4 rounded-2xl mb-4 border border-violet-100">
                  <p className="text-xs text-violet-800 font-bold mb-1 uppercase tracking-wider">বিকাশ/নগদ (পার্সোনাল)</p>
                  <p className="text-lg font-black text-violet-700 tracking-widest">017XXXXXXXX</p>
                  <p className="text-[10px] text-violet-600 mt-1">সেন্ড মানি করার পর ট্রানজেকশন আইডি দিন</p>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {['bKash', 'Nagad'].map(m => (
                      <button key={m} onClick={() => setMethod(m)} className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all ${method === m ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-gray-100 text-gray-400'}`}>{m}</button>
                    ))}
                  </div>
                  <input type="number" placeholder="টাকার পরিমাণ" className="w-full p-3.5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-violet-500" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
                  <input type="text" placeholder="Transaction ID (TrxID)" className="w-full p-3.5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-violet-500" value={trxId} onChange={e => setTrxId(e.target.value)} />
                  <div className="flex gap-3">
                    <button onClick={() => setPaymentModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 rounded-2xl font-bold text-gray-500">বাতিল</button>
                    <button onClick={handleAddBalance} disabled={submitting} className="flex-1 py-3.5 bg-[#7c3aed] text-white rounded-2xl font-bold shadow-lg shadow-violet-200">
                      {submitting ? 'প্রসেসিং...' : 'সাবমিট করুন'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* সার্ভিস অর্ডার মোডাল (Guest হলে লগিন prompt, লগিন হলে order form) */}
          {activeService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveService(null)}>
              <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                {(() => {
                  const s = services.find(sv => sv.id === activeService)
                  if (!s) return null

                  // Guest mode: লগিন প্রম্পট
                  if (isGuest) return (
                    <>
                      <div className="flex items-center gap-4 mb-5">
                        <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>{s.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{s.title}</h3>
                          <p className="text-violet-600 font-bold text-sm">চার্জ: {s.price} ৳</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-center">
                        <p className="text-amber-800 font-bold mb-1">🔒 লগিন প্রয়োজন</p>
                        <p className="text-amber-600 text-sm">এই সেবা নিতে প্রথমে লগিন করুন অথবা বিনামূল্যে আকাউন্ট বানান</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setActiveService(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500">বাতিল</button>
                        <Link href="/auth/login" className="flex-1 py-4 bg-[#7c3aed] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
                          <LogIn size={18} /> লগিন
                        </Link>
                      </div>
                    </>
                  )

                  // Logged-in: normal order form
                  return (
                    <>
                      <div className="flex items-center gap-4 mb-5">
                        <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>{s.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{s.title}</h3>
                          <p className="text-violet-600 font-bold text-sm">চার্জ: {s.price} ৳</p>
                        </div>
                      </div>
                      <div className="mb-5">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">প্রয়োজনীয় তথ্য (NID/নাম্বার/লিঙ্ক)</label>
                        <input type="text" value={orderInput} onChange={e => setOrderInput(e.target.value)} placeholder="এখানে লিখুন..." className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-violet-500 shadow-inner" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setActiveService(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500">বাতিল</button>
                        <button onClick={() => handlePlaceOrder(s)} disabled={submitting} className="flex-1 py-4 bg-[#7c3aed] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-200">
                          {submitting ? 'লোড হচ্ছে...' : <><Send size={18} /> অর্ডার করুন</>}
                        </button>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}