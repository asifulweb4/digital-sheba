'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { services as localServices, categories } from '@/lib/services'
import { Search, ArrowRight, Users, UserCheck, CreditCard, Layers } from 'lucide-react'

const stats = [
  { icon: Layers, value: '৭২+', label: 'মোট সেবা সংখ্যা', color: '#10b981', bgColor: 'bg-emerald-50/80' },
  { icon: Users, value: '৬,৩৯,১৪৮', label: 'মোট ব্যবহারকারী', color: '#f59e0b', bgColor: 'bg-amber-50/80' },
  { icon: UserCheck, value: '৫,৭২৫', label: 'মোট লেনদেন', color: '#10b981', bgColor: 'bg-emerald-50/80' },
  { icon: CreditCard, value: '৯৯২', label: 'মোট পেমেন্ট', color: '#6366f1', bgColor: 'bg-indigo-50/80' },
]

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const displayServices = localServices || []

  const filteredServices = displayServices.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.titleEn && s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCat && matchSearch
  })

  const hasAllCategory = categories.some(cat => cat.id === 'all' || cat.label.includes('সকল সেবা'))

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f4f8f6', fontFamily: "'Hind Siliguri', sans-serif" }}>
      <Navbar />

      {/* ══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative w-full bg-[#012217] overflow-hidden pt-6 pb-28 md:pt-12 md:pb-24 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-emerald-400/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* বামপাশের টেক্সট এরিয়া */}
          <div className="md:col-span-7 text-center md:text-left text-white flex flex-col items-center md:items-start order-2 md:order-1">
            <span className="text-[#facc15] font-black text-xs sm:text-sm mb-3 tracking-widest uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">
              বাংলাদেশের সবচেয়ে নির্ভরযোগ্য প্ল্যাটফর্ম
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black mb-5 leading-[1.15] tracking-tight">
              নির্ভরযোগ্য <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">ডিজিটাল সেবা</span>
            </h1>

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-black text-xs sm:text-sm mb-6 shadow-md"
              style={{ background: '#facc15', color: '#012217' }}>
              <span>দ্রুত</span> • <span>সহজ</span> • <span>নিরাপদ</span>
            </div>

            <div className="space-y-3 mb-8 text-left w-full max-w-sm md:max-w-none mx-auto md:mx-0">
              {[
                'সকল সেবা এক প্ল্যাটফর্মে',
                '২৪/৭ দ্রুত কাস্টমার সার্ভিস',
                '১০০% নিরাপদ লেনদেন নিশ্চিতকরণ'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 md:bg-transparent p-3 md:p-0 rounded-2xl md:rounded-none">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-emerald-100/90">{text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm sm:text-base transition-all duration-300 hover:brightness-105 active:scale-98 shadow-xl w-full sm:w-auto justify-center"
              style={{
                background: 'linear-gradient(180deg, #ffda22 0%, #eab308 100%)',
                color: '#012217',
                boxShadow: '0 8px 30px rgba(250,204,21,0.35)'
              }}
            >
              এখনই অ্যাকাউন্ট খুলুন
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* ডানপাশের ইমেজ এরিয়া */}
          <div className="md:col-span-5 flex justify-center md:justify-end items-center order-1 md:order-2 w-full">
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-full aspect-[4/4.2] rounded-[2.5rem] overflow-hidden dynamic-float-banner">
              <Image 
                src="/bg.png"
                alt="সহজ ডিজিটাল সেবা ব্যানার"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover scale-[1.02]"
                priority
              />
            </div>
          </div>

        </div>

        <style>{`
          @keyframes floatBg {
            0% { transform: translateY(0px); filter: drop-shadow(0 15px 20px rgba(16,185,129,0.15)); }
            50% { transform: translateY(-12px); filter: drop-shadow(0 25px 35px rgba(16,185,129,0.3)); }
            100% { transform: translateY(0px); filter: drop-shadow(0 15px 20px rgba(16,185,129,0.15)); }
          }
          .dynamic-float-banner {
            animation: floatBg 4.5s ease-in-out infinite;
          }
          
          /* ══════════════ আল্ট্রা-লাক্সারি আল্ট্রা-ক্লিন শ্যাডো ফিক্স ══════════════ */
          
          /* মেইন কন্টেইনার শ্যাডো */
          .brand-gradient-shadow {
            box-shadow: 0 12px 40px rgba(1, 34, 23, 0.04);
          }
          
          /* স্ট্যাটাস কার্ড: বর্ডারলেস ও স্মুথ শ্যাডো */
          .stat-card-clean {
            box-shadow: 0 4px 20px rgba(1, 34, 23, 0.02);
          }
          .stat-card-clean:hover {
            box-shadow: 0 15px 35px -5px rgba(1, 34, 23, 0.08), 0 5px 15px -3px rgba(16, 185, 129, 0.04) !important;
          }
          
          /* সার্ভিস বক্স: একদম ক্লিন বর্ডার ছাড়া ডিফাইন করা */
          .service-box-clean {
            box-shadow: 0 6px 20px rgba(1, 34, 23, 0.02);
          }
          
          /* হোভার করলে ছড়াবে চমৎকার ব্র্যান্ডেড ডার্ক-গ্রিন ও লাইট-গ্রিন মিক্সড গ্রেডিয়েন্ট গ্লো শ্যাডো */
          .service-box-clean:hover {
            box-shadow: 0 20px 35px -8px rgba(1, 34, 23, 0.09), 0 8px 20px -6px rgba(16, 185, 129, 0.06) !important;
          }
        `}</style>
      </section>

      {/* ══════════════════════ DYNAMIC STATS CARDS ═══════════════════════ */}
      <section className="relative z-20 max-w-5xl w-full mx-auto px-4 -mt-8 mb-20" style={{ top: '20px' }}>
        <div className="bg-white rounded-[2rem] p-5 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 brand-gradient-shadow">
          {stats.map(({ icon: Icon, value, label, color, bgColor }, i) => (
            <div key={i} 
              className="flex flex-col items-center text-center p-4 sm:p-5 bg-white rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 group cursor-pointer stat-card-clean"
            >
              <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                <Icon size={22} style={{ color: color }} />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                {value}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-400 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ ALL SERVICES / PREMIUM GRID ═════════════════ */}
      <section className="py-2 max-w-5xl w-full mx-auto px-4 flex-1">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            জনপ্রিয় সেবাসমূহ
          </h2>
          <Link href="#all-services" className="text-emerald-600 font-extrabold text-xs sm:text-sm flex items-center gap-1 hover:text-emerald-800 transition-colors">
            সব দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        {/* ক্যাটাগরি ফিল্টার পিলস */}
        <div className="mb-6 flex flex-wrap gap-2">
          {!hasAllCategory && (
            <button 
              onClick={() => setActiveCategory('all')}
              className="transition-all duration-200 active:scale-95 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black shadow-sm"
              style={{
                cursor: 'pointer',
                ...(activeCategory === 'all' 
                  ? { background: '#012217', color: '#fff' } 
                  : { background: '#fff', color: '#64748b', boxShadow: '0 4px 12px rgba(1,34,23,0.02)' }
                )
              }}
            >
              ⚡ সকল সেবা
            </button>
          )}
          
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="transition-all duration-200 active:scale-95 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black shadow-sm"
              style={{
                cursor: 'pointer',
                ...(activeCategory === cat.id
                  ? { background: '#012217', color: '#fff' }
                  : { background: '#fff', color: '#64748b', boxShadow: '0 4px 12px rgba(1,34,23,0.02)' }
                )
              }}
            >
              <span className="mr-1">{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* সার্চ বার */}
        <div className="mb-8 relative w-full max-w-md shadow-sm rounded-2xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="সার্ভিস বা মডিউল সার্চ করুন..." 
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-sm outline-none focus:ring-4 focus:ring-emerald-100/40 transition-all shadow-sm focus:shadow-md"
          />
        </div>

        {/* সার্ভিস গ্রিড লেআউট */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5" id="all-services">
          {filteredServices.map(s => (
            <Link 
              key={s.id} 
              href="/dashboard"
              className="group bg-white rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-1 service-box-clean"
            >
              {/* আইকন সার্কেল */}
              <div className="w-14 h-14 rounded-full text-emerald-700 bg-[#f4f8f6] flex items-center justify-center text-2xl mb-4 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#e6f0ec] group-hover:text-[#012217] shadow-inner">
                {s.icon || '📄'}
              </div>
              
              {/* সার্ভিস টাইটেল */}
              <p className="text-xs sm:text-sm font-black text-slate-700 line-clamp-2 h-10 mb-4 flex items-center justify-center leading-snug transition-colors duration-300 group-hover:text-black">
                {s.title}
              </p>
              
              {/* প্রাইস বাটন */}
              <div className="mt-auto px-5 py-1.5 bg-emerald-50 text-emerald-800 rounded-full font-black text-xs min-w-[75px] transition-all duration-300 group-hover:bg-[#012217] group-hover:text-white shadow-sm">
                ৳ {s.price}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════ রেফারেল ব্যানার ═══════════════════ */}
      <section className="my-12 max-w-5xl w-full mx-auto px-4">
        <div className="rounded-[2rem] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl"
          style={{ background: 'linear-gradient(135deg, #012217 0%, #024b30 100%)' }}>
          <div className="absolute right-0 top-0 bottom-0 w-40 opacity-10 bg-[radial-gradient(circle,_#facc15_0%,_transparent_75%)] pointer-events-none" />
          
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row relative z-10">
            <span className="text-4xl">🎁</span>
            <div>
              <span className="text-[10px] font-black text-amber-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/40 uppercase tracking-wider">নতুন অফার</span>
              <h3 className="text-xl font-black mt-2">রেফার করে আনলিমিটেড ইনকাম</h3>
              <p className="text-xs text-emerald-200/90 mt-0.5">প্রতি সফল রেফারে আপনার ওয়ালেটে যোগ হবে আকর্ষণীয় বোনাস</p>
            </div>
          </div>
          <Link href="/dashboard" className="px-6 py-3 bg-amber-400 text-slate-950 text-xs sm:text-sm font-black rounded-xl hover:bg-amber-300 transition-all active:scale-95 shrink-0 shadow-lg relative z-10">
            বিস্তারিত জানুন →
          </Link>
        </div>
      </section>

      {/* ════════════════════ সেফটি ও ট্রাস্ট ব্যাজ ═══════════════════ */}
      <section className="mb-16 max-w-5xl w-full mx-auto px-4">
        <div className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-xl shadow-inner shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-800">নিরাপদ লেনদেন ও ১০০% নিশ্চিত সেবা</h4>
              <p className="text-xs text-slate-400 mt-0.5">আপনার ব্যক্তিগত সকল তথ্য এবং পেমেন্ট ট্রানজেকশন সম্পূর্ণ সুরক্ষিত ও এন্ড-টু-এন্ড এনক্রিপ্টেড</p>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 font-black text-xs rounded-full flex items-center gap-1 border border-emerald-100 shrink-0">
            <span>🔒 ১০০%</span> নিরাপদ
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}