'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Info, FileText } from 'lucide-react'
import { services } from '@/lib/services'
import { getFieldsForService, FormField } from '@/lib/serviceFields'
import { placeOrderAction, getProfile } from '@/lib/actions'

export default function ServiceFormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [service, setService] = useState<any>(null)
  const [fields, setFields] = useState<FormField[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const fetchServiceAndProfile = async () => {
      const p = await getProfile()
      if (!p) {
        router.push('/auth/login')
        return
      }
      setProfile(p)

      const s = services.find(sv => sv.id === params.id)
      if (s) {
        setService(s)
        setFields(getFieldsForService(s.id, s.inputLabel, s.inputPlaceholder))
      }
      setLoading(false)
    }
    fetchServiceAndProfile()
  }, [params.id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAutoFill = () => {
    if (params.id === 'server-copy') {
      setFormData({
        nidNumber: '8294729184',
        voterPin: '369026520',
        nameBn: 'মোঃ রফিকুল ইসলাম',
        nameEn: 'MD. ROFIQUL ISLAM',
        fatherName: 'আব্দুর রহমান',
        motherName: 'রহিমা বেগম',
        dob: '1985-10-15',
        bloodGroup: 'O+',
        photoUrl: 'https://example.com/photo.jpg',
        address: 'গ্রাম: পলাসপুর, ডাকঘর: পলাসপুর, থানা: কোতোয়ালী, জেলা: ঢাকা',
      })
    } else {
      // Basic autofill for others
      const dummyData: Record<string, string> = {}
      fields.forEach(f => {
        if (f.type === 'date') dummyData[f.name] = '1990-01-01'
        else if (f.type === 'select') dummyData[f.name] = f.options?.[0]?.value || ''
        else dummyData[f.name] = 'Test Data'
      })
      setFormData(dummyData)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check required fields
    const missingFields = fields.filter(f => f.required && !formData[f.name])
    if (missingFields.length > 0) {
      alert(`অনুগ্রহ করে বাধ্যতামূলক তথ্য দিন: ${missingFields.map(f => f.label).join(', ')}`)
      return
    }

    if ((profile?.balance || 0) < service.price) {
      alert('আপনার পর্যাপ্ত ব্যালেন্স নেই! ব্যালেন্স যোগ করার পেজে নিয়ে যাওয়া হচ্ছে।')
      router.push('/dashboard/balance')
      return
    }

    setSubmitting(true)
    
    // Convert form data to a readable string for inputData
    let inputDataString = ''
    fields.forEach(f => {
      if (formData[f.name]) {
        inputDataString += `${f.label}: ${formData[f.name]}\n`
      }
    })

    const res = await placeOrderAction(service, inputDataString.trim())
    if (!res.success) {
      alert(res.message)
      setSubmitting(false)
    } else {
      alert('অর্ডার সফল হয়েছে!')
      router.push('/dashboard/orders')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-forest-600 font-bold">লোড হচ্ছে...</p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <p className="text-red-500 font-bold">সার্ভিস পাওয়া যায়নি</p>
        <Link href="/dashboard" className="px-4 py-2 bg-forest-600 text-white rounded-lg">ড্যাশবোর্ডে ফিরে যান</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4fbf7] p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-forest-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-forest-100 relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-forest-600 font-bold text-xs tracking-widest uppercase mb-1 flex items-center gap-2">
                <FileText size={14} /> Service Terminal
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                {service.title} <span className="text-gray-400 font-normal">/ {service.titleEn}</span>
              </h1>
            </div>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 hover:border-red-200"
            >
              <ArrowLeft size={16} /> Exit System
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4 flex items-center gap-2">
            <Info size={16} className="text-forest-500" />
            Provide official identity variables to compile standard or digital documents.
          </p>
        </div>

        {/* Action Bar */}
        <div className="px-6 md:px-8 py-4 bg-forest-50 border-b border-forest-100 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-forest-200 text-sm font-bold text-forest-700 shadow-sm">
              সার্ভিস ফি: ৳ {service.price}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              আপনার ব্যালেন্স: <span className={profile.balance >= service.price ? 'text-forest-600 font-bold' : 'text-red-500 font-bold'}>৳ {profile.balance}</span>
            </div>
          </div>
          <button 
            onClick={handleAutoFill}
            type="button"
            className="text-xs font-bold text-forest-600 bg-forest-100 px-4 py-2 rounded-lg border border-forest-200 hover:bg-forest-200 transition-colors"
          >
            Autofill Sample (টেস্ট ডেটা ফিলাপ)
          </button>
        </div>

        {/* Form Section */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all text-sm bg-gray-50 focus:bg-white appearance-none"
                      required={field.required}
                    >
                      <option value="" disabled>{field.placeholder}</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'date' ? 'date' : 'text'}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 mt-8 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? 'প্রসেসিং হচ্ছে...' : (
                  <>
                    <CheckCircle size={18} /> অর্ডার কনফার্ম করুন (৳ {service.price})
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
