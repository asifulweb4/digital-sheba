'use client'
import { Fragment } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, MessageSquare, Video, MessageCircle, ArrowRight, Shield, Clock, Star } from 'lucide-react'

const quickLinks = [
  { href: '/', label: 'হোম' },
  { href: '/auth/register', label: 'রেজিস্ট্রেশন' },
  { href: '/auth/login', label: 'লগইন' },
  { href: '/dashboard', label: 'ড্যাশবোর্ড' },
  { href: '/dashboard/orders', label: 'অর্ডার লিস্ট' },
]

const popularServices = [
  'NID কপি', 'স্মার্ট কার্ড', 'TIN ডাউনলোড',
  'জন্ম নিবন্ধন', 'বায়োমেট্রিক তথ্য', 'ভোটার লিস্ট',
]

const trustBadges = [
  { icon: Shield, label: '১০০% নিরাপদ', color: '#34d399' },
  { icon: Clock, label: '২৪/৭ সেবা', color: '#fbbf24' },
  { icon: Star, label: 'বিশ্বস্ত প্ল্যাটফর্ম', color: '#14b8a6' },
]

export default function Footer() {
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #011a13 0%, #022c22 60%, #011a13 100%)' }}>

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 70%)', transform: 'translate(-40%,-40%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.14) 0%, transparent 70%)', transform: 'translate(40%,40%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', right: 0, width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.10) 0%, transparent 70%)', transform: 'translate(30%,-50%)', pointerEvents: 'none' }} />

      {/* Trust badges */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
          {trustBadges.map(({ icon: Icon, label, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '700', color }}>
              <Icon size={16} strokeWidth={2.5} style={{ color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px'
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #064e3b, #059669)',
                boxShadow: '0 4px 20px rgba(5,150,105,0.4)',
                flexShrink: 0
              }}>
                <span style={{ color: 'white', fontWeight: '900', fontSize: '22px' }}>স</span>
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: '900', fontSize: '18px', lineHeight: 1.2 }}>সহজ ডিজিটাল সেবা</div>
                <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#34d399' }}>Shohoj Digital Sheba</div>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '24px', color: '#9ca3af' }}>
              বাংলাদেশের সকল সরকারি সেবা এখন এক জায়গায়। দ্রুত, সহজ এবং সম্পূর্ণ নির্ভরযোগ্য।
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { href: 'https://youtube.com', hoverBg: '#dc2626', Icon: Video },
                { href: 'https://wa.me/8801889079173', hoverBg: '#16a34a', Icon: MessageCircle },
              ].map(({ href, hoverBg, Icon }) => (
                <a
                  key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#9ca3af', transition: 'all 0.3s ease', textDecoration: 'none'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = hoverBg;
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              color: 'white', fontWeight: '900', fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ width: '24px', height: '2px', borderRadius: '9999px', background: 'linear-gradient(90deg,#059669,#d97706)', display: 'inline-block' }} />
              দ্রুত লিংক
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '14px', fontWeight: '600',
                      color: '#d1d5db',
                      textDecoration: 'none', transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#34d399'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#d1d5db'}
                  >
                    <ArrowRight size={13} style={{ color: '#059669', flexShrink: 0 }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h3 style={{
              color: 'white', fontWeight: '900', fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ width: '24px', height: '2px', borderRadius: '9999px', background: 'linear-gradient(90deg,#059669,#d97706)', display: 'inline-block' }} />
              জনপ্রিয় সেবা
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {popularServices.map(s => (
                <li key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: '900', flexShrink: 0,
                    background: 'rgba(6,79,59,0.35)', color: '#34d399'
                  }}>✓</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#d1d5db' }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{
              color: 'white', fontWeight: '900', fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ width: '24px', height: '2px', borderRadius: '9999px', background: 'linear-gradient(90deg,#059669,#d97706)', display: 'inline-block' }} />
              যোগাযোগ
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(6,79,59,0.3)', border: '1px solid rgba(5,150,105,0.25)'
                }}>
                  <MapPin size={14} style={{ color: '#34d399' }} />
                </div>
                <span style={{ fontSize: '14px', color: '#d1d5db' }}>ঢাকা, বাংলাদেশ</span>
              </li>
              <li>
                <Link
                  href="https://wa.me/8801889079173"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontWeight: '700', fontSize: '14px', color: '#25D366',
                    textDecoration: 'none'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  WhatsApp এ মেসেজ দিন
                </Link>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(6,79,59,0.3)', border: '1px solid rgba(5,150,105,0.25)'
                }}>
                  <Mail size={14} style={{ color: '#34d399' }} />
                </div>
                <a
                  href="mailto:support@digitalshebabd.com"
                  style={{ fontSize: '14px', fontWeight: '600', color: '#d1d5db', textDecoration: 'none', wordBreak: 'break-all' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#34d399'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#d1d5db'}
                >
                  support@digitalshebabd.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '20px 24px',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: '12px'
        }}>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
            © ২০২৬{' '}
            <span style={{ fontWeight: '700', color: '#34d399' }}>সহজ ডিজিটাল সেবা</span>
            । সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
            {[
              { href: '/privacy', label: 'গোপনীয়তা নীতি' },
              { href: '/terms', label: 'শর্তাবলী' },
              { href: '/contact', label: 'যোগাযোগ' },
            ].map((item, i) => (
              <Fragment key={item.href}>
                {i > 0 && <span style={{ color: '#374151' }}>|</span>}
                <Link
                  href={item.href}
                  style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#34d399'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}
                >
                  {item.label}
                </Link>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}