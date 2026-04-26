'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Menu, X, LogOut, User, Search, Bell,
  Wallet, Settings, Clock, Send, LogIn, UserPlus, ShieldCheck,
  ChevronRight, Star, Zap, TrendingUp, Award
} from 'lucide-react'
import { getProfile, placeOrderAction, logoutAction } from '@/lib/actions'
import { services, categories } from '@/lib/services'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeService, setActiveService] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderInput, setOrderInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getProfile()
      if (!profileData) {
        router.push('/auth/login')
        return
      }
      setProfile(profileData as any)
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  const handlePlaceOrder = async (service: any) => {
    if (!orderInput) return alert('প্রয়োজনীয় তথ্য (NID/নাম্বার) দিন')
    if ((profile?.balance || 0) < service.price) {
      alert('আপনার পর্যাপ্ত ব্যালেন্স নেই! ব্যালেন্স যোগ করার পেজে নিয়ে যাওয়া হচ্ছে।')
      router.push('/dashboard/balance'); return
    }
    setSubmitting(true)
    const res = await placeOrderAction(service, orderInput)
    if (!res.success) {
      alert(res.message)
    } else {
      alert('অর্ডার সফল হয়েছে!')
      setActiveService(null); setOrderInput('')
      window.location.reload()
    }
    setSubmitting(false)
  }

  const handleLogout = async () => {
    await logoutAction()
    router.push('/auth/login')
  }

  const filteredServices = services.filter((s: any) => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 16px', border: '4px solid rgba(16,185,129,0.3)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#10b981', fontWeight: 700, fontSize: 15 }}>লোড হচ্ছে...</p>
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

  const statCards = [
    { label: 'মোট সেবা', value: services.length + '+', icon: '🏛️', color: 'rgba(16,185,129,0.12)', accent: '#059669' },
    { label: 'চলমান অর্ডার', value: '০', icon: '⚡', color: 'rgba(245,158,11,0.12)', accent: '#d97706' },
    { label: 'সফল অর্ডার', value: '০', icon: '✅', color: 'rgba(6,79,59,0.12)', accent: '#064e3b' },
  ]

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body { width:100%; margin:0; padding:0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .dash-sidebar { background: linear-gradient(170deg, #022c22 0%, #064e3b 45%, #065f46 100%); width:260px; flex-shrink:0; }
        .dash-root { display:flex; width:100%; min-height:100vh; background:#f6fdf9; overflow:hidden; }
        .dash-sidebar-wrapper { display:none; position:sticky; top:0; height:100vh; overflow-y:auto; }
        @media (min-width:1024px) { .dash-sidebar-wrapper { display:flex; flex-direction:column; } }
        .dash-main { flex:1; min-width:0; display:flex; flex-direction:column; width:100%; overflow-x:hidden; }
        .dash-main-toggle { display:flex; }
        @media (min-width:1024px) { .dash-main-toggle { display:none !important; } }
        .dash-nav-link { display:flex; align-items:center; gap:12px; padding:11px 16px; border-radius:12px; color:rgba(255,255,255,0.7); font-size:14px; font-weight:500; transition:all 0.25s; text-decoration:none; position:relative; }
        .dash-nav-link:hover { background:rgba(16,185,129,0.15); color:#10b981; }
        .dash-nav-link.active { background:rgba(16,185,129,0.2); color:#10b981; }
        .service-card-db { background:#fff; border:1.5px solid rgba(6,79,59,0.09); border-radius:18px; padding:18px 12px 16px; display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; width:100%; transition:all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .service-card-db:hover { transform:translateY(-5px); border-color:rgba(5,150,105,0.35); box-shadow:0 12px 35px rgba(6,79,59,0.14); }
        .service-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; width:100%; }
        @media (min-width:500px)  { .service-grid { grid-template-columns:repeat(3,1fr); } }
        @media (min-width:768px)  { .service-grid { grid-template-columns:repeat(4,1fr); } }
        @media (min-width:1100px) { .service-grid { grid-template-columns:repeat(5,1fr); } }
        .stats-grid { display:grid; grid-template-columns:repeat(1,1fr); gap:12px; margin-bottom:22px; }
        @media (min-width:640px) { .stats-grid { grid-template-columns:repeat(3,1fr); } }
        .stat-mini { border-radius:16px; padding:16px; border:1px solid rgba(6,79,59,0.08); background:#fff; transition:all 0.25s; }
        .db-search { width:100%; padding:10px 14px 10px 38px; border-radius:12px; border:1.5px solid rgba(6,79,59,0.14); background:rgba(240,253,244,0.7); font-size:13px; color:#064e3b; outline:none; transition:all 0.2s; }
        .modal-overlay { position:fixed; inset:0; z-index:60; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(2,44,34,0.55); backdrop-filter:blur(8px); }
        .modal-box { background:#fff; border-radius:24px; width:100%; max-width:420px; padding:28px; box-shadow:0 30px 80px rgba(2,44,34,0.25); animation:fadeInUp 0.35s ease; }
        .balance-card { background:linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%); border-radius:20px; padding:20px; position:relative; overflow:hidden; }
      `}</style>

      <div className="dash-root">
        {sidebarOpen && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(2,44,34,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className="dash-sidebar dash-sidebar-wrapper" style={{ zIndex: 50 }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#10b981,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🇧🇩</div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>নাগরিক সেবা</p>
                  <p style={{ color: 'rgba(16,185,129,0.8)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em' }}>NAGARIK SHEBA</p>
                </div>
              </Link>
            </div>
          </div>

          <div style={{ padding: '14px 14px 10px' }}>
            <div className="balance-card">
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>বর্তমান ব্যালেন্স</p>
              <p style={{ color: '#fff', fontSize: 30, fontWeight: 900, marginBottom: 12 }}>
                {profile?.balance || 0} <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.8 }}>৳</span>
              </p>
              <Link
                href="/dashboard/balance"
                style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: '#022c22', padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 14px rgba(217,119,6,0.4)' }}
              >
                💳 রিচার্জ করুন
              </Link>
            </div>
          </div>

          <nav style={{ flex: 1, padding: '6px 10px', overflowY: 'auto' }}>
            {navItems.map(item => (
              <Link key={item.label} href={item.href} className="dash-nav-link" style={{ marginBottom: 2 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={15} />
                </div>
                {item.label}
              </Link>
            ))}
            {profile?.role === 'admin' && (
              <Link href="/admin" className="dash-nav-link" style={{ border: '1px solid rgba(217,119,6,0.3)', background: 'rgba(217,119,6,0.08)', color: '#fbbf24' }}>
                <ShieldCheck size={15} /> এডমিন প্যানেল
              </Link>
            )}
          </nav>

          <div style={{ padding: '12px 10px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderRadius: 12, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.18)', color: '#fca5a5', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              <LogOut size={15} /> লগআউট
            </button>
          </div>
        </aside>

        <div className="dash-main">
          <header style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(6,79,59,0.1)', position: 'sticky', top: 0, zIndex: 30, height: 62, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>
            <button onClick={() => setSidebarOpen(true)} className="dash-main-toggle" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#064e3b' }}>
              <Menu size={22} />
            </button>

            <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="সেবা খুঁজুন..." className="db-search" />
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right', display: profile?.fullName ? 'block' : 'none' }}>
                <p style={{ fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: 700, color: '#022c22', lineHeight: 1.2 }}>{profile?.fullName}</p>
                <p style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', color: '#059669', fontWeight: 600 }}>ব্যালেন্স: {profile?.balance || 0}৳</p>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#064e3b,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, flexShrink: 0 }}>
                {profile?.fullName?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </header>

          <main style={{ flex: 1, padding: '24px 24px 40px', overflowY: 'auto', width: '100%' }}>
            <div style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 70%, #047857 100%)', borderRadius: 24, padding: 'clamp(20px, 5vw, 28px)', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: 'clamp(20px, 6vw, 26px)', fontWeight: 900, color: '#fff', marginBottom: 6 }}>আস্সালামু আলাইকুম, {profile?.fullName?.split(' ')[0]}! 👋</h2>
                <p style={{ color: 'rgba(16,185,129,0.8)', fontSize: 'clamp(12px, 3.5vw, 14px)', marginBottom: 20 }}>আজকে আপনি কোন সরকারি সেবাটি নিতে চান?</p>
                <Link href="/dashboard/balance" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: '#022c22', padding: '10px 20px', borderRadius: 14, fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: 800, textDecoration: 'none' }}>
                  <Wallet size={15} /> ব্যালেন্স যোগ করুন
                </Link>
              </div>
            </div>

            <div className="stats-grid">
              {statCards.map((s, i) => (
                <div key={i} className="stat-mini">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
                    <div>
                      <p style={{ fontSize: 20, fontWeight: 900, color: '#022c22' }}>{s.value}</p>
                      <p style={{ fontSize: 11, color: '#6b7280' }}>{s.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="service-grid">
              {filteredServices.map((service: any) => (
                <button key={service.id} onClick={() => setActiveService(service.id)} className="service-card-db">
                  <div className={service.color} style={{ width: 60, height: 60, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 12 }}>{service.icon}</div>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: '#1f2937', marginBottom: 10 }}>{service.title}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: '#ecfdf5', color: '#065f46', borderRadius: 99, padding: '4px 12px', fontSize: 11, fontWeight: 800 }}>৳ {service.price}</div>
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>

      {activeService && (
        <div className="modal-overlay" onClick={() => setActiveService(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            {(() => {
              const s = services.find((sv: any) => sv.id === activeService)
              if (!s) return null
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className={s.color} style={{ width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{s.icon}</div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#022c22' }}>{s.title}</h3>
                        <p style={{ fontSize: 12, fontWeight: 800, color: '#059669' }}>চার্জ: {s.price} ৳</p>
                      </div>
                    </div>
                  </div>
                  <input type="text" value={orderInput} onChange={e => setOrderInput(e.target.value)} placeholder={s.inputPlaceholder || 'এখানে লিখুন...'} style={{ width: '100%', padding: '13px', borderRadius: 13, border: '1.5px solid #ddd', marginBottom: 18 }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setActiveService(null)} style={{ flex: 1, padding: '13px', borderRadius: 13, background: '#f3f4f6' }}>বাতিল</button>
                    <button onClick={() => handlePlaceOrder(s)} disabled={submitting} style={{ flex: 1, padding: '13px', borderRadius: 13, background: '#059669', color: '#fff', fontWeight: 800 }}>
                      {submitting ? 'লোড হচ্ছে...' : 'অর্ডার করুন'}
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </>
  )
}