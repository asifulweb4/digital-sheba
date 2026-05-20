import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ServicesClient from './ServicesClient'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  let data: any[] = []

  try {
    const { getAllServices } = await import('@/lib/queries')
    data = await getAllServices()
  } catch (error) {
    console.error('Services fetch failed:', error)
    data = []
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="hero-gradient py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-3">আমাদের সেবাসমূহ</h1>
        <p className="text-violet-100 text-lg">৪২+ সরকারি সেবা এক জায়গায়</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ServicesClient initialServices={data} />
      </div>
      <Footer />
    </div>
  )
}