import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#2e1065] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center">
                <span className="text-white font-bold text-lg">স</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">সহজ ডিজিটাল সেবা</div>
                <div className="text-violet-400 text-xs">Shohoj Digital Sheba</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">বাংলাদেশের সকল সরকারি সেবা এখন এক জায়গায়। দ্রুত, সহজ এবং নির্ভরযোগ্য।</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-[#7c3aed] flex items-center justify-center hover:bg-[#8b5cf6] transition-colors"><Facebook size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#7c3aed] flex items-center justify-center hover:bg-red-500 transition-colors"><Youtube size={16} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-violet-300">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'হোম'], ['/auth/register', 'রেজিস্ট্রেশন'], ['/auth/login', 'লগইন'], ['/dashboard', 'ড্যাশবোর্ড'], ['/services', 'সেবাসমূহ']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-gray-300 hover:text-violet-300 transition-colors flex items-center gap-2"><span className="text-violet-500">›</span>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-violet-300">জনপ্রিয় সেবা</h3>
            <ul className="space-y-2 text-sm">
              {['NID কপি', 'স্মার্ট কার্ড', 'TIN ডাউনলোড', 'জন্ম নিবন্ধন', 'বায়োমেট্রিক তথ্য', 'ভোটার লিস্ট'].map(s => (
                <li key={s} className="text-gray-300 flex items-center gap-2"><span className="text-violet-500">✓</span>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-violet-300">যোগাযোগ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-300"><MapPin size={16} className="text-violet-400 mt-0.5 flex-shrink-0" /><span>ঢাকা, বাংলাদেশ</span></li>
              <li className="flex items-center gap-3 text-gray-300"><Phone size={16} className="text-violet-400 flex-shrink-0" /><a href="tel:01700000000" className="hover:text-violet-300">০১৭০০-০০০০০০</a></li>
              <li className="flex items-center gap-3 text-gray-300"><Mail size={16} className="text-violet-400 flex-shrink-0" /><span className="break-all">support@digitalshebabd.com</span></li>
            </ul>
            <div className="mt-4 p-3 bg-[#7c3aed] rounded-lg">
              <p className="text-xs text-gray-200">📞 সাপোর্ট সময়</p>
              <p className="text-sm font-medium">সকাল ৮টা - রাত ১০টা</p>
              <p className="text-xs text-violet-300">সপ্তাহে ৭ দিন</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#7c3aed] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-400 text-sm">© ২০২৬ সহজ ডিজিটাল সেবা। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-violet-300">গোপনীয়তা নীতি</Link>
            <Link href="/terms" className="hover:text-violet-300">শর্তাবলী</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
