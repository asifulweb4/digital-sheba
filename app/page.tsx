'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { services, categories } from '@/lib/services'
import { Search, ArrowRight, Zap, Users, UserCheck, Building2, Shield, Headphones, ThumbsUp, Award, Star, CheckCircle2 } from 'lucide-react'

const stats = [
  { icon: Zap, value: '৭২+', label: 'মোট সেবা সংখ্যা', gradFrom: '#064e3b', gradTo: '#059669' },
  { icon: Users, value: '৬,৩৯,৭১৪', label: 'মোট ব্যবহারকারী', gradFrom: '#065f46', gradTo: '#10b981' },
  { icon: UserCheck, value: '৫,২৭২৫', label: 'মোট উদ্যোক্তা', gradFrom: '#d97706', gradTo: '#f59e0b' },
  { icon: Building2, value: '৭৭২', label: 'মোট সেন্টার', gradFrom: '#0d9488', gradTo: '#14b8a6' },
]

const coreServices = [
  {
    icon: '🪪', title: 'NID সেবা',
    desc: 'ভোটার আইডি কার্ড তৈরি ও হারানো আইডি কার্ড ডাউনলোড করুন',
    bg: '#ecfdf5', border: '#a7f3d0', iconBg: '#d1fae5', tag: 'জনপ্রিয়', tagColor: '#064e3b',
  },
  {
    icon: '💳', title: 'স্মার্টকার্ড সেবা',
    desc: 'স্মার্টকার্ড ডাউনলোড এবং আপগ্রেড করতে আবেদন করুন',
    bg: '#fffbeb', border: '#fde68a', iconBg: '#fef3c7', tag: 'নতুন', tagColor: '#92400e',
  },
  {
    icon: '📋', title: 'জন্ম নিবন্ধন সেবা',
    desc: 'অনলাইনে জন্ম নিবন্ধন সনদ ডাউনলোড এবং সংশোধন করুন',
    bg: '#f0fdfa', border: '#99f6e4', iconBg: '#ccfbf1', tag: 'দ্রুত', tagColor: '#0f766e',
  },
  {
    icon: '📄', title: 'TIN সেবা',
    desc: 'ইলেক্ট্রনিক ট্যাক্স আইডেন্টিফিকেশন নম্বর রেজিস্ট্রেশন',
    bg: '#ecfdf5', border: '#a7f3d0', iconBg: '#d1fae5', tag: 'সহজ', tagColor: '#064e3b',
  },
]

const whyUs = [
  { Icon: Shield, title: 'সরল ও দ্রুত প্রক্রিয়া', desc: 'আমাদের অনলাইন প্ল্যাটফর্ম ব্যবহার করে ঘরে বসেই আবেদন করুন', accent: '#064e3b', bg: '#ecfdf5', border: '#a7f3d0' },
  { Icon: Headphones, title: '২৪/৭ গ্রাহক সেবা', desc: 'আমাদের দক্ষ সাপোর্ট টিম সর্বদা আপনার পাশে থেকে সেবা দিতে প্রস্তুত', accent: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  { Icon: ThumbsUp, title: 'নির্ভরযোগ্য ও নিরাপদ', desc: 'আমাদের নিরাপদ প্ল্যাটফর্ম আপনার পরিচয়পত্র ও তথ্য সুরক্ষিত রাখে', accent: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { Icon: Award, title: 'সেরা মানের সেবা', desc: 'আমাদের বিশেষ টিন সেবা গ্রহণ করে অংশীদারদের সুবিধা উপভোগ করুন', accent: '#065f46', bg: '#ecfdf5', border: '#a7f3d0' },
]

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen" style={{ background: '#f6fdf9' }}>
      <Navbar />

{/* ══════════════════════ HERO ═══════════════════════ */}
      <section className="relative w-full min-h-[500px] py-12 overflow-hidden flex items-center justify-center">
      
      {/* Background Image */}
      <Image 
        src="/banner2.png" 
        alt="Background Banner"
        fill
        className="object-cover" // ছবিটি পুরো এরিয়া জুড়ে কভার করবে
        priority
      />

      <div className="absolute inset-0 bg-black/40 z-0"></div>
            


        {/* Grid dots */}
        <div className="absolute inset-0 grid-dots opacity-25 pointer-events-none" />

        {/* Diagonal stripe texture */}
        <div className="absolute inset-0 stripe-accent pointer-events-none opacity-60" />

        {/* Glowing orbs */}
        <div className="absolute top-[-100px] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-80px] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 65%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.07) 0%, transparent 55%)' }} />

        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-28 sm:pt-24 sm:pb-36 text-center text-white">

          {/* Shimmer badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-7 animate-fade-up border"
            style={{
              background: 'linear-gradient(90deg, rgba(245,158,11,0.15) 25%, rgba(251,191,36,0.32) 50%, rgba(245,158,11,0.15) 75%)',
              backgroundSize: '200% auto',
              animation: 'goldShimmer 3s linear infinite, fadeInUp 0.6s ease-out both',
              borderColor: 'rgba(251,191,36,0.35)',
              color: '#fde68a',
            }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#fbbf24' }} />
            <span className="text-sm font-bold tracking-wide">🇧🇩 বাংলাদেশের সহজ ডিজিটাল সেবা প্ল্যাটফর্ম</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 leading-[1.05] tracking-tight animate-float glow-green">
            সহজ ডিজিটাল সেবা
          </h1>

          {/* Gold accent line */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-16 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706)' }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#fcd34d' }}>সহজ · দ্রুত · নির্ভরযোগ্য</span>
            <div className="h-px w-16 rounded-full" style={{ background: 'linear-gradient(270deg, transparent, #d97706)' }} />
          </div>

          <p className="text-emerald-200 text-base sm:text-xl mb-2 font-semibold animate-fade-up" style={{ animationDelay: '0.1s' }}>
            ৬ লাখ+ ব্যবহারকারী আমাদের সাথে যুক্ত
          </p>
          <p className="text-emerald-300/80 text-sm sm:text-lg mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            NID, স্মার্টকার্ড, TIN সহ ৪২টিরও বেশি সরকারি সেবা — এখন ঘরে বসেই
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-black text-lg transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                color: '#022c22',
                boxShadow: '0 8px 36px rgba(217,119,6,0.50)',
              }}
            >
              ফ্রি একাউন্ট খুলুন
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.22)', color: '#fff' }}
            >
              সেবাসমূহ দেখুন
            </Link>
          </div>

          {/* Service chips */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {['🪪 NID সেবা', '💳 স্মার্টকার্ড', '📋 জন্ম নিবন্ধন', '📄 TIN', '✅ ১০০% নিরাপদ', '⚡ দ্রুত সেবা'].map(chip => (
              <span key={chip}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#d1fae5' }}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Wavy bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,45 C360,90 720,0 1080,45 C1260,68 1380,18 1440,45 L1440,90 L0,90 Z" fill="#f6fdf9" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════ STATS ══════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 -mt-12 sm:-mt-10 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map(({ icon: Icon, value, label, gradFrom, gradTo }, i) => (
            <div
              key={i}
              className="stat-card relative bg-white rounded-[20px] p-4 sm:p-6 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
              style={{ boxShadow: '0 4px 20px rgba(2,44,34,0.06)', border: '1px solid rgba(6,79,59,0.06)' }}
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md transition-transform duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
                <Icon size={20} className="text-white w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </div>
              <div className="text-lg sm:text-2xl font-black leading-tight" style={{ color: '#022c22' }}>{value}</div>
              <div className="text-[10px] sm:text-xs mt-1 font-semibold" style={{ color: '#6b7280' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ CORE SERVICES ══════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="tag-green mb-4 inline-block">আমাদের প্রধান সেবা</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mt-4 section-title" style={{ color: '#022c22' }}>
            NID, স্মার্টকার্ড, TIN, জন্ম নিবন্ধন সহ
          </h2>
          <p className="mt-5 text-base font-medium max-w-lg mx-auto" style={{ color: '#6b7280' }}>
            ৪২টিরও বেশি সরকারি সেবা এখন আপনার হাতের মুঠোয়
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {coreServices.map((cs, i) => (
            <Link key={i} href="/dashboard"
              className="group relative rounded-[20px] p-4 sm:p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col items-center sm:items-start text-center sm:text-left"
              style={{ background: cs.bg, border: `1px solid ${cs.border}`, boxShadow: '0 2px 14px rgba(2,44,34,0.06)' }}
            >
              {/* Tag */}
              <span className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black"
                style={{ background: '#fff', color: cs.tagColor, border: `1px solid ${cs.border}` }}>
                {cs.tag}
              </span>

              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-2 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300"
                style={{ background: cs.iconBg }}>
                {cs.icon}
              </div>
              <h3 className="font-black mb-1 sm:mb-2 text-xs sm:text-sm" style={{ color: '#022c22' }}>{cs.title}</h3>
              <p className="text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-3 hidden sm:block" style={{ color: '#6b7280' }}>{cs.desc}</p>
              <div className="inline-flex items-center justify-center sm:justify-start gap-1 text-[10px] sm:text-xs font-bold w-full" style={{ color: cs.tagColor }}>
                আবেদন <ArrowRight size={10} className="sm:w-3 sm:h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════ WHY US ═══════════════════════ */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="tag-gold inline-block mb-4">কেন বেছে নেবেন</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mt-4 section-title" style={{ color: '#022c22' }}>
              কেন আমাদের সেবা ব্যবহার করবেন?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map(({ Icon, title, desc, accent, bg, border }, i) => (
              <div key={i}
                className="group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2"
                style={{ background: bg, border: `1px solid ${border}`, boxShadow: '0 2px 14px rgba(2,44,34,0.06)' }}>
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm"
                  style={{ background: '#fff', border: `1.5px solid ${border}` }}>
                  <Icon size={28} strokeWidth={1.8} style={{ color: accent }} />
                </div>
                <h3 className="font-black text-sm mb-2" style={{ color: '#022c22' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ ALL SERVICES ═════════════════ */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black" style={{ color: '#022c22' }}>সকল সেবাসমূহ</h2>
            <p className="text-sm mt-1 font-medium" style={{ color: '#6b7280' }}>
              {filteredServices.length}টি সেবা পাওয়া গেছে
            </p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#059669' }} />
            <input
              type="text"
              placeholder="সেবা খুঁজুন..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl text-sm w-60 font-medium transition-all bg-white"
              style={{ border: '1.5px solid rgba(6,79,59,0.18)', color: '#022c22' }}
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
              style={
                activeCategory === cat.id
                  ? { background: 'linear-gradient(135deg, #064e3b, #059669)', color: '#fff', boxShadow: '0 4px 16px rgba(5,150,105,0.3)', transform: 'scale(1.05)' }
                  : { background: '#fff', color: '#374151', border: '1.5px solid rgba(6,79,59,0.15)' }
              }
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Service grid */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {filteredServices.map(s => (
            <Link key={s.id} href="/dashboard"
              className="group bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(2,44,34,0.06)', border: '1px solid rgba(6,79,59,0.08)' }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(236,253,245,0.9), rgba(209,250,229,0.6))' }} />
              <div className="relative">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${s.color} rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl mx-auto mb-1.5 sm:mb-2 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                  {s.icon}
                </div>
                <p className="text-[10px] sm:text-xs font-bold leading-tight mb-1.5 sm:mb-2 line-clamp-2" style={{ color: '#022c22' }}>{s.title}</p>
                <div className="price-tag" style={{ padding: '0.15rem 0.4rem', fontSize: '0.6rem' }}>
                  <span className="mr-0.5 opacity-60">৳</span>{s.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════ CTA BANNER ═══════════════════ */}
      <section className="my-12 mx-4 sm:mx-8 xl:mx-auto max-w-6xl">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #022c22 0%, #064e3b 35%, #065f46 65%, #059669 88%, #0d9488 100%)',
            boxShadow: '0 24px 80px rgba(2,44,34,0.45)',
          }}
        >
          {/* Grid dots */}
          <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
          {/* Stripe texture */}
          <div className="absolute inset-0 stripe-accent opacity-40 pointer-events-none" />
          {/* Gold orb */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.20) 0%, transparent 65%)' }} />
          {/* Green orb */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 65%)' }} />

          <div className="relative flex flex-col lg:flex-row items-center justify-between px-8 sm:px-14 py-14 gap-10">
            <div className="text-white max-w-md">
              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" stroke="none" />)}
                </div>
                <span className="text-sm font-semibold" style={{ color: '#d1fae5' }}>৩ লক্ষ+ ব্যবহারকারীর বিশ্বাস</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">
                তাহলে আর দেরি কেন?
              </h2>
              <p className="text-lg mb-6 font-medium" style={{ color: '#a7f3d0' }}>
                আজই সহজ ডিজিটাল সেবায় আকাউন্ট খুলুন!
              </p>

              {/* Checkmarks */}
              <div className="space-y-2 mb-8">
                {['সম্পূর্ণ বিনামূল্যে রেজিস্ট্রেশন', 'তাৎক্ষণিক সেবা প্রক্রিয়াকরণ', '১০০% নিরাপদ ও নির্ভরযোগ্য'].map(pt => (
                  <div key={pt} className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} style={{ color: '#34d399' }} strokeWidth={2.5} />
                    <span className="text-sm font-semibold" style={{ color: '#d1fae5' }}>{pt}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-lg transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                  color: '#022c22',
                  boxShadow: '0 8px 32px rgba(217,119,6,0.50)',
                }}
              >
                ফ্রি একাউন্ট খুলুন
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative flex-shrink-0 w-64 sm:w-80">
              <Image
                src="/woman-cta.png"
                alt="নাগরিক সেবা"
                width={320}
                height={400}
                className="object-contain drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════ FOOTER SERVICE ICONS ════════════ */}
      <section className="pb-8 max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { icon: '🪪', label: 'NID সেবা' },
            { icon: '💳', label: 'স্মার্টকার্ড সেবা' },
            { icon: '📋', label: 'জন্ম নিবন্ধন সেবা' },
            { icon: '📄', label: 'TIN সেবা' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer" style={{ color: '#6b7280' }}>
              <div
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:-translate-y-1.5"
                style={{ boxShadow: '0 2px 10px rgba(2,44,34,0.07)', border: '1px solid rgba(6,79,59,0.10)' }}
              >
                {item.icon}
              </div>
              <span className="text-xs font-bold group-hover:text-forest-800 transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}