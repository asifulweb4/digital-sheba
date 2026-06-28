'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, LogIn, UserPlus, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { getProfile, logoutAction } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'হোম' },
  { href: '/services', label: 'সেবাসমূহ' },
  { href: '/about', label: 'আমাদের সম্পর্কে' },
  { href: '/contact', label: 'যোগাযোগ' },
]

export default function Navbar() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)

    const fetchProfile = async () => {
      const data = await getProfile()
      setProfile(data)
      setLoading(false)
    }
    fetchProfile()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logoutAction()
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300`}>
      <div style={{ background: 'linear-gradient(90deg, #022c22, #064e3b, #065f46)' }} className="text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="hidden sm:flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            🇧🇩 বাংলাদেশের সহজ ডিজিটাল সেবা প্ল্যাটফর্ম
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Phone size={11} style={{ color: '#fbbf24' }} />
            <a href="tel:01625400511" className="font-bold tracking-wider transition-colors" style={{ color: '#fcd34d' }}>
              01625400511
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white/96 backdrop-blur-xl" style={{ borderBottom: '1px solid rgba(6,79,59,0.10)', boxShadow: scrolled ? '0 4px 28px rgba(2,44,34,0.12)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[68px]">
           
                     <Link href="/" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    textDecoration: "none",
                    flexShrink: 0,
                }}>
                    <Image
                        src="/logo.jpeg"
                        alt="Nagarik Seba Logo"
                        width={65}
                        height={65}
                        style={{ objectFit: "contain", borderRadius: "50%" }}
                    />
                </Link>
                

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} className="relative px-4 py-2 font-semibold text-sm rounded-xl transition-all duration-200 group" style={{ color: '#374151' }}>
                  {l.label}
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" style={{ background: 'linear-gradient(90deg, #064e3b, #d97706)' }} />
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {!loading && profile ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white btn-gold">
                      <ShieldCheck size={15} /> এডমিন
                    </Link>
                  )}
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm btn-primary">
                    <LayoutDashboard size={15} /> ড্যাশবোর্ড
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2" style={{ borderColor: '#ef4444', color: '#dc2626' }}>
                    <LogOut size={15} /> লগআউট
                  </button>
                </>
              ) : !loading && (
                <>
                  <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2" style={{ borderColor: 'rgba(6,79,59,0.3)', color: '#064e3b' }}>
                    <LogIn size={15} /> লগইন
                  </Link>
                  <Link href="/auth/register" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm btn-gold">
                    <UserPlus size={15} /> রেজিস্ট্রেশন
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-xl transition-all" style={{ color: '#064e3b' }}>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-4 py-5 space-y-1 shadow-xl">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="block py-3 px-3 rounded-xl font-semibold" onClick={() => setIsOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3 mt-2 border-t border-gray-100">
            {profile ? (
              <>
                <Link href="/dashboard" className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm btn-primary" onClick={() => setIsOpen(false)}>ড্যাশবোর্ড</Link>
                <button onClick={handleLogout} className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm border-2" style={{ borderColor: '#ef4444', color: '#dc2626' }}>লগআউট</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="flex-1 text-center py-2.5 rounded-xl border-2" style={{ borderColor: 'rgba(6,79,59,0.3)', color: '#064e3b' }} onClick={() => setIsOpen(false)}>লগইন</Link>
                <Link href="/auth/register" className="flex-1 text-center py-2.5 rounded-xl btn-gold text-sm font-bold" onClick={() => setIsOpen(false)}>রেজিস্ট্রেশন</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}