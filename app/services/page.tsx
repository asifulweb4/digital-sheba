'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { services, categories } from '@/lib/services'
import { Search } from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
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
      <div className="hero-gradient py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-3">আমাদের সেবাসমূহ</h1>
        <p className="text-violet-100 text-lg">৪২+ সরকারি সেবা এক জায়গায়</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="সেবা খুঁজুন..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-[#7c3aed] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#7c3aed]'}`}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredServices.map(s => (
            <Link key={s.id} href="/auth/register" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 service-card group">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">{s.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{s.titleEn}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.description}</p>
                </div>
              </div>
              {s.popular && <div className="mt-3 inline-flex items-center gap-1 bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-full">⭐ জনপ্রিয়</div>}
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
