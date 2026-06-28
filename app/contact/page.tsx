'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।')
  }

  return (
    <div className="min-h-screen bg-[#f6fdf9]">
      <Navbar />
      
      {/* Header */}
      <section className="py-20 hero-gradient text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 stripe-accent opacity-20" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-6 glow-green">যোগাযোগ করুন</h1>
          <p className="text-emerald-100 text-lg font-medium">যেকোনো প্রশ্ন বা সহযোগিতার জন্য আমাদের মেসেজ দিন</p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-8 rounded-3xl border border-emerald-100 shadow-sm">
              <h2 className="text-2xl font-black text-[#022c22] mb-8">তথ্য কেন্দ্র</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#ecfdf5] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="text-[#059669]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ফোন করুন</p>
                    <p className="text-[#022c22] font-black">+৮৮০ ১৭XXXX-XXXXXX</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#fffbeb] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="text-[#d97706]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ইমেইল</p>
                    <p className="text-[#022c22] font-black"></p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#f0fdfa] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-[#0d9488]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">ঠিকানা</p>
                    <p className="text-[#022c22] font-black">ঢাকা, বাংলাদেশ</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#f0fdf4] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-[#10b981]" size={20} />
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-[#022c22] p-8 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <MessageSquare className="mb-4 text-emerald-400" size={32} />
              <h3 className="text-xl font-bold mb-2">লাইভ সাপোর্ট</h3>
              <p className="text-emerald-100/70 text-sm mb-6">আমাদের সাপোর্ট টিমের সাথে সরাসরি কথা বলতে হোয়াটসঅ্যাপ ব্যবহার করুন।</p>
              <a href="https://wa.me/8801625400511" target="_blank" rel="noopener noreferrer" className="btn-gold px-6 py-3 text-sm inline-block w-full text-center">হোয়াটসঅ্যাপ মেসেজ</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-emerald-100 shadow-xl">
              <h2 className="text-2xl font-black text-[#022c22] mb-8">আমাদের বার্তা পাঠান</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">আপনার নাম</label>
                  <input type="text" placeholder="পুরো নাম লিখুন" required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ফোন নম্বর</label>
                  <input type="tel" placeholder="" required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-none text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">বিষয়</label>
                  <input type="text" placeholder="বার্তার বিষয় লিখুন" required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-none text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">আপনার বার্তা</label>
                  <textarea rows={5} placeholder="আপনার বিস্তারিত সমস্যা বা প্রশ্ন লিখুন..." required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-none text-sm resize-none"></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3">
                    <Send size={20} /> বার্তা পাঠান
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
