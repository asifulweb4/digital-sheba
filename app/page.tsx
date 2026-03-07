'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { services, categories, stats } from '@/lib/services'
import { Search, ArrowRight, CheckCircle, Star, Zap, Shield, Clock } from 'lucide-react'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#7c3aed] to-[#8b5cf6]">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-white opacity-10 blur-[120px]"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-violet-200 opacity-20 blur-[150px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 text-sm border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <span className="w-2.5 h-2.5 bg-[#c026d3] rounded-full animate-pulse shadow-[0_0_10px_rgb(192,38,211)]"></span>
                <span className="font-bold tracking-wide">🇧🇩 সহজ ডিজিটাল সেবা প্ল্যাটফর্ম</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-8 drop-shadow-lg tracking-tight">
                সকল সরকারি সেবা
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-[#c026d3] drop-shadow-none py-2">এক জায়গায়</span>
              </h1>
              <p className="text-violet-50 text-xl leading-relaxed mb-10 font-medium max-w-xl opacity-90">
                NID, স্মার্টকার্ড, TIN, জন্ম নিবন্ধন সহ ৪২টিরও বেশি সরকারি সেবা এখন আপনার হাতের মুঠোয়।
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/dashboard" className="flex items-center justify-center gap-3 px-10 py-4.5 bg-white text-[#2e1065] font-black rounded-2xl hover:bg-violet-50 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgb(124,58,237,0.3)] hover:-translate-y-1 text-lg group">
                  সেবা দেখুন <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/auth/login" className="flex items-center justify-center gap-3 px-10 py-4.5 bg-white/10 backdrop-blur-xl text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 shadow-lg hover:-translate-y-1 text-lg">
                  লগইন করুন
                </Link>
              </div>
              <div className="flex flex-wrap gap-5 mt-10 text-sm text-violet-100 font-medium">
                <span className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"><CheckCircle size={18} className="text-[#c026d3]" /> ১০০% নিরাপদ</span>
                <span className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"><CheckCircle size={18} className="text-[#c026d3]" /> ২৪/৭ সেবা</span>
                <span className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"><CheckCircle size={18} className="text-[#c026d3]" /> তাৎক্ষণিক ফলাফল</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-7 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_15px_40px_rgb(255,255,255,0.15)] group">
                  <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform">{stat.icon}</div>
                  <div className="text-3xl font-black text-white drop-shadow-md">{stat.value}</div>
                  <div className="text-violet-100 font-medium text-sm mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-amber-500" size={36} />, title: 'দ্রুত সেবা', desc: 'মাত্র কয়েক মিনিটের মধ্যে আপনার প্রয়োজনীয় সেবা পান', color: 'from-amber-50 to-orange-50' },
            { icon: <Shield className="text-[#7c3aed]" size={36} />, title: 'সম্পূর্ণ নিরাপদ', desc: 'Supabase দ্বারা সুরক্ষিত। আপনার তথ্য সম্পূর্ণ গোপনীয়', color: 'from-violet-50 to-fuchsia-50' },
            { icon: <Clock className="text-violet-500" size={36} />, title: '২৪/৭ সহায়তা', desc: 'দিনরাত যেকোনো সময় আমাদের সহায়তা পাওয়া যায়', color: 'from-violet-50 to-cyan-50' },
          ].map((f, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(124,58,237,0.08)] border border-white hover:-translate-y-2 transition-all duration-300 text-center group">
              <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-inner`}>{f.icon}</div>
              <h3 className="text-2xl font-black text-gray-800 mb-3">{f.title}</h3>
              <p className="text-gray-500 text-base leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR */}
      <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Star className="text-yellow-500" size={24} fill="currentColor" />
          <h2 className="text-2xl font-bold text-gray-800">জনপ্রিয় সেবাসমূহ</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {services.filter(s => s.popular).map(s => (
            <Link key={s.id} href="/dashboard" className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-5 text-center border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-violet-200 hover:shadow-[0_15px_35px_rgb(124,58,237,0.1)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className={`relative z-10 w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-[3deg] transition-transform duration-300 shadow-[0_4px_15px_rgb(0,0,0,0.1)]`}>{s.icon}</div>
              <p className="relative z-10 text-sm font-bold text-gray-800 leading-tight">{s.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ALL SERVICES */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">সকল সেবাসমূহ</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="সেবা খুঁজুন..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm w-56" />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mb-8">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md ${activeCategory === cat.id ? 'bg-[#7c3aed] text-white shadow-[0_4px_15px_rgb(124,58,237,0.3)] scale-105' : 'bg-white/80 backdrop-blur-md text-gray-600 border border-white hover:border-[#7c3aed]/30 hover:text-[#7c3aed]'}`}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredServices.map(s => (
            <Link key={s.id} href="/dashboard" className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-5 text-center border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-violet-200 hover:shadow-[0_15px_35px_rgb(124,58,237,0.1)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className={`relative z-10 w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-[3deg] transition-transform duration-300 shadow-[0_4px_15px_rgb(0,0,0,0.1)]`}>{s.icon}</div>
              <p className="relative z-10 text-sm font-bold text-gray-800 leading-tight mb-2 line-clamp-2">{s.title}</p>
              <div className="relative z-10 inline-flex items-center justify-center bg-gradient-to-r from-violet-50 to-fuchsia-50 text-[#7c3aed] px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide border border-violet-100/60 shadow-inner">
                <span className="mr-0.5 opacity-60">৳</span> {s.price}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#4c1d95] to-[#7c3aed] my-12 mx-4 sm:mx-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white blur-3xl"></div></div>
        <div className="relative text-center text-white max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">আজই শুরু করুন</h2>
          <p className="text-violet-100 text-lg mb-8">বিনামূল্যে অ্যাকাউন্ট খুলুন এবং সকল সরকারি সেবা উপভোগ করুন</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#7c3aed] font-bold rounded-xl hover:bg-violet-50 transition-all shadow-lg text-lg">
            সেবাসমূহ দেখুন <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
