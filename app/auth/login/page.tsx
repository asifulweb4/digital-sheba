'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LogIn, Mail, Lock, CheckCircle, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [justRegistered, setJustRegistered] = useState(false)

  // identifier ব্যবহার করছি ইমেইল বা ফোন দুটোর জন্যই
  const [form, setForm] = useState({ identifier: '', password: '' })

  useEffect(() => {
    if (searchParams.get('registered') === 'true') setJustRegistered(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
    })
  }, [searchParams, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.identifier || !form.password) { setError('ইমেইল/ফোন ও পাসওয়ার্ড দিন'); return }

    setLoading(true)

    let emailToLogin = form.identifier;

    // লজিক: ইনপুটে @ না থাকলে ফোন হিসেবে ধরে প্রোফাইল খুঁজুন
    if (!form.identifier.includes('@')) {
      const { data: profile_email, error: profileError } = await supabase
        .rpc('get_email_by_phone', { p_phone: form.identifier });

      if (profileError || !profile_email || profile_email.length === 0) {
        setError('এই ফোন নাম্বারটি খুঁজে পাওয়া যায়নি');
        setLoading(false);
        return;
      }

      emailToLogin = profile_email[0].email;
      if (!emailToLogin) {
        setError('এই প্রোফাইলে কোনো ইমেইল পাওয়া যায়নি। দয়া করে ইমেইল দিয়ে লগইন করুন।');
        setLoading(false);
        return;
      }
    }

    // লগইন করুন
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailToLogin,
      password: form.password,
    })

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError('ইমেইল/ফোন বা পাসওয়ার্ড সঠিক নয়')
      } else {
        setError(signInError.message)
      }
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  // ... (JSX কোড আগের মতোই থাকবে, শুধু input name="identifier" এবং লেবেল পরিবর্তন করুন)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#dcfce7] flex">
      {/* ... Left Panel ... */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* ... (একই কোড) ... */}
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* ... Mobile Logo ... */}
          <div className="lg:hidden text-center mb-8">
            {/* ... (একই কোড) ... */}
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">লগইন করুন</h2>
            <p className="text-gray-500 mt-2">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল বা ফোন নাম্বার</label>
              <div className="relative">
                <Phone size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="identifier" // identifier নামে state update হবে
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder="example@gmail.com বা 01XXXXXXX"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm"
                  required
                />
              </div>
            </div>

            {/* ... Password Input, Error Message, Submit Button (একই কোড) ... */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
                <Link href="/auth/forgot" className="text-xs text-[#1a7a3c] hover:underline">পাসওয়ার্ড ভুলে গেছেন?</Link>
              </div>
              <div className="relative">
                <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="আপনার পাসওয়ার্ড" className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 btn-primary text-white font-bold rounded-xl text-lg">
              {loading ? <><div className="w-5 h-5 spinner"></div> লগইন হচ্ছে...</> : <><LogIn size={20} /> লগইন করুন</>}
            </button>
            {/* ... (একই কোড) ... */}
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center">
        <div className="w-12 h-12 spinner border-4 border-[#1a7a3c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}