'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Menu, X, LogOut, User, Search, Bell,
  Wallet, Settings, Clock, Send, LogIn, UserPlus, ShieldCheck,
  ChevronRight, Star, Zap, TrendingUp, Award, Layers
} from 'lucide-react'
import { getProfile, placeOrderAction, logoutAction } from '@/lib/actions'
import { services, categories } from '@/lib/services'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4fbf7' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 16px', border: '4px solid rgba(16,185,129,0.3)', borderTopColor: '#006a4e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#006a4e', fontWeight: 700, fontSize: 15 }}>লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        /* ব্রাউজারের সব ডিফল্ট ও কাস্টম টপ বর্ডার/লাইন লেআউট রিসেট */
        html, body { 
          width: 100%; 
          min-height: 100vh; 
          background: #f4fbf7 !important; 
          color: #1f2937; 
          margin: 0 !important; 
          padding: 0 !important; 
          border: none !important;
          outline: none !important;
        }
        * { box-sizing: border-box; font-family: inherit; margin: 0; padding: 0; }
        
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
        
        .dash-container { max-width: 1240px; margin: 0 auto; padding: 0 20px; }
        .top-navbar { background: #fff; border-radius: 16px; border: 1px solid #e1eedf; padding: 12px 24px; margin-top: 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 20px rgba(0, 106, 78, 0.03); }
        .nav-links { display: flex; gap: 6px; background: #e8f4ee; padding: 4px; border-radius: 10px; align-items: center; }
        .nav-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #374151; border: none; background: transparent; cursor: pointer; text-decoration: none; transition: all 0.2s; }
        .nav-btn.active { background: #fff; color: #006a4e; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .nav-btn.admin { border: 1px dashed rgba(217,119,6,0.5); background: rgba(217,119,6,0.06); color: #b45309; }
        .nav-btn.admin:hover { background: rgba(217,119,6,0.12); }
        
        .user-badge { display: flex; align-items: center; gap: 10px; background: #e8f4ee; padding: 6px 14px; border-radius: 12px; }
        
        .hero-section { display: grid; grid-template-columns: 1.8fr 1fr; gap: 20px; margin-top: 24px; }
        @media (max-width: 900px) { .hero-section { grid-template-columns: 1fr; } }
        .welcome-card { background: #005a3e; border-radius: 20px; padding: 32px; color: #fff; display: flex; flex-direction: column; justify-content: center; position: relative; }
        .balance-box { background: #fff; border-radius: 20px; border: 1px solid #e1eedf; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 20px rgba(0, 106, 78, 0.03); }
        .logout-btn { width: 100%; text-align: center; border: 1px solid #ffd6d6; background: #fff5f5; color: #dc2626; padding: 10px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .logout-btn:hover { background: #fee2e2; }

        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 24px; }
        @media (max-width: 640px) { .stats-row { grid-template-columns: 1fr; gap: 12px; } }
        .stat-card { background: #fff; border-radius: 16px; border: 1px solid #e1eedf; padding: 20px 24px; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 20px rgba(0, 106, 78, 0.02); }
        
        .filter-search-bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 32px; margin-bottom: 24px; flex-wrap: wrap; }
        .categories-holder { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }
        .cat-toggle-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; border: 1px solid #cce3d3; background: #fff; color: #374151; }
        .search-wrapper { position: relative; width: 100%; max-width: 280px; }
        @media (max-width: 640px) { .search-wrapper { max-width: 100%; } }
        .search-input { width: 100%; padding: 10px 14px 10px 38px; border-radius: 12px; border: 1px solid #cce3d3; background: #fff; font-size: 13px; outline: none; transition: all 0.2s; }
        .search-input:focus { border-color: #006a4e; background: #fff; }

        .service-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; padding-bottom: 40px; }
        @media (max-width: 1200px) { .service-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 900px) { .service-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px) { .service-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
        
        .service-card-db { background: #fff; border: 1px solid #e2f0e7; border-bottom: 3px solid #e2f0e7; border-radius: 20px; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer; width: 100%; transition: all 0.25s ease-out; box-shadow: 0 4px 12px rgba(0, 106, 78, 0.02); position: relative; }
        .service-card-db:hover { transform: translateY(-5px); border-color: #006a4e; border-bottom-color: #006a4e; box-shadow: 0 12px 24px rgba(0, 106, 78, 0.08); }
        
        .card-icon-holder { background: #f4fbf7; color: #006a4e; transition: all 0.25s ease-out; }
        .service-card-db:hover .card-icon-holder { background: #006a4e; color: #fff; transform: scale(1.05); }
        
        .price-tag { display: inline-flex; align-items: center; background: #e6f7f0; color: #006a4e; border-radius: 8px; padding: 4px 14px; font-size: 12px; font-weight: 800; margin-top: auto; transition: all 0.25s ease-out; }
        .service-card-db:hover .price-tag { background: #006a4e; color: #fff; }

        .modal-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0, 43, 31, 0.4); backdrop-filter: blur(6px); }
        .modal-box { background: #fff; border-radius: 24px; width: 100%; max-width: 420px; padding: 28px; box-shadow: 0 30px 70px rgba(0,43,31,0.15); animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid #e1eedf; }
      `}</style>

      {/* এই ফাইলে টপ লাইনের সমস্ত ডিভ ও মার্কআপ সম্পূর্ণ রিমুভড */}
      <div className="dash-container">
        {/* টপ হেডার বার */}
        <header className="top-navbar">
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#006a4e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' }}>স</div>
            <div>
              <p style={{ color: '#006a4e', fontWeight: 800, fontSize: 15, margin: 0, lineHeight: 1.2 }}>সহজ ডিজিটাল সেবা</p>
              <p style={{ color: '#6b7280', fontSize: 9, fontWeight: 600, margin: 0, letterSpacing: '0.04em' }}>SHOHOJ DIGITAL SHEBA</p>
            </div>
          </Link>

          <div className="nav-links">
            <Link href="/dashboard" className="nav-btn active"><Home size={14} /> কনসোল হোম</Link>
            <Link href="/dashboard/profile" className="nav-btn"><User size={14} /> প্রোফাইল</Link>
            <Link href="/dashboard/orders" className="nav-btn"><Clock size={14} /> অর্ডার ট্র্যাকিং</Link>
            <Link href="/dashboard/settings" className="nav-btn"><Settings size={14} /> সেটিংস</Link>
            
            {profile?.role === 'admin' && (
              <Link href="/admin" className="nav-btn admin">
                <ShieldCheck size={14} /> এডমিন প্যানেল
              </Link>
            )}
          </div>

          <div className="user-badge">
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#006a4e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
              {profile?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', margin: 0 }}>{profile?.fullName || 'Asiful Islam'}</p>
              <p style={{ fontSize: 10, color: '#006a4e', fontWeight: 600, margin: 0 }}>ব্যালেন্স: ৳ {profile?.balance || 0}</p>
            </div>
          </div>
        </header>

        {/* স্বাগতম ব্যানার এবং ওয়ালেট ব্যালেন্স */}
        <section className="hero-section">
          <div className="welcome-card">
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              স্বাগতম, {profile?.fullName?.split(' ')[0] || 'Asiful'}! 👋
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              আপনার প্রয়োজনীয় সরকারি ই-সেবা, ভেরিফিকেশন বা online কপি ডাউনলোড করতে নিচের মডিউলগুলো ব্যবহার করুন।
            </p>
          </div>

          <div className="balance-box">
            <div>
              <p style={{ color: '#4b5563', fontSize: 12, fontWeight: 700, margin: '0 0 4px 0' }}>বর্তমান ওয়ালেট ব্যালেন্স</p>
              <p style={{ color: '#006a4e', fontSize: 32, fontWeight: 900, margin: 0 }}>
                ৳ {profile?.balance || 0}
              </p>
            </div>
            <button onClick={handleLogout} className="logout-btn" style={{ marginTop: 16 }}>
              লগআউট সেশন
            </button>
          </div>
        </section>

        {/* কাউন্টার স্ট্যাটস কার্ড */}
        <section className="stats-row">
          <div className="stat-card">
            <div style={{ fontSize: 24, background: '#f0f4f8', width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏛️</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#006a4e', margin: 0 }}>৭২টি</p>
              <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, margin: 0 }}>মোট ডিজিটাল সেবা</p>
            </div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 24, background: '#fff9db', width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏳</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#d97706', margin: 0 }}>০টি</p>
              <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, margin: 0 }}>চলমান অর্ডার</p>
            </div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 24, background: '#e6fcf5', width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✅</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#099268', margin: 0 }}>০টি</p>
              <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, margin: 0 }}>সফল ডেলিভারি</p>
            </div>
          </div>
        </section>

        {/* ফিল্টার এবং সার্চ বার */}
        <section className="filter-search-bar">
          <div className="categories-holder">
            <button 
              onClick={() => setActiveCategory('all')}
              className="cat-toggle-btn"
              style={activeCategory === 'all' 
                ? { background: '#006a4e', color: '#fff', borderColor: '#006a4e' } 
                : {}
              }
            >
              🟢 অল মডিউলস
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="cat-toggle-btn"
                style={activeCategory === cat.id
                  ? { background: '#006a4e', color: '#fff', borderColor: '#006a4e' }
                  : {}
                }
              >
                <span style={{ marginRight: '4px' }}>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          <div className="search-wrapper">
            <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="সার্ভিস বা মডিউল সার্চ করুন..." 
              className="search-input"
            />
          </div>
        </section>

        {/* সার্ভিস গ্রিড */}
        <section className="service-grid">
          {filteredServices.map((service: any) => (
            <button key={service.id} onClick={() => setActiveService(service.id)} className="service-card-db">
              <div className="card-icon-holder" style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>
                {service.icon || '📄'}
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1f2937', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                {service.title}
              </p>
              <div className="price-tag">
                ৳ {service.price}
              </div>
            </button>
          ))}
        </section>
      </div>

      {/* মোডাল উইন্ডো */}
      {activeService && (
        <div className="modal-overlay" onClick={() => setActiveService(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            {(() => {
              const s = services.find((sv: any) => sv.id === activeService)
              if (!s) return null
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ background: '#e6f7f0', width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                        {s.icon || '📄'}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1f2937', margin: 0 }}>{s.title}</h3>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#006a4e', margin: '2px 0 0 0' }}>চার্জ: {s.price} ৳</p>
                      </div>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={orderInput} 
                    onChange={e => setOrderInput(e.target.value)} 
                    placeholder={s.inputPlaceholder || 'এখানে প্রয়োজনীয় তথ্য দিন...'} 
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #cce3d3', marginBottom: 20, fontSize: 13, outline: 'none' }} 
                  />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setActiveService(null)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#f3f4f6', border: 'none', color: '#4b5563', fontWeight: 700, cursor: 'pointer' }}>বাতিল</button>
                    <button onClick={() => handlePlaceOrder(s)} disabled={submitting} style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#006a4e', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
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