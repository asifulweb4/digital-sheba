'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, User, Lock, Bell, Shield, Smartphone,
  ChevronRight, Check, Eye, EyeOff, Save
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showOldPass, setShowOldPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    email: ''
  })

  const [passForm, setPassForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    balanceAlerts: true,
    promotions: false,
    smsAlerts: true
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const tabs = [
    { id: 'profile', label: 'প্রোফাইল', icon: <User size={16} /> },
    { id: 'password', label: 'পাসওয়ার্ড', icon: <Lock size={16} /> },
    { id: 'notifications', label: 'নোটিফিকেশন', icon: <Bell size={16} /> },
    { id: 'security', label: 'নিরাপত্তা', icon: <Shield size={16} /> },
  ]

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        body { background: #f4fbf7; min-height: 100vh; }
        .settings-wrap { max-width: 860px; margin: 0 auto; padding: 28px 20px 60px; }
        .back-link { display: inline-flex; align-items: center; gap: 6px; color: #006a4e; font-size: 13px; font-weight: 700; text-decoration: none; margin-bottom: 24px; }
        .back-link:hover { color: #004d38; }
        .page-title { font-size: 22px; font-weight: 900; color: #1f2937; margin-bottom: 24px; }
        .settings-layout { display: grid; grid-template-columns: 220px 1fr; gap: 20px; }
        @media (max-width: 640px) { .settings-layout { grid-template-columns: 1fr; } }

        .tab-sidebar { background: #fff; border-radius: 16px; border: 1px solid #e1eedf; padding: 10px; height: fit-content; box-shadow: 0 4px 20px rgba(0,106,78,0.03); }
        .tab-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 14px; border-radius: 10px; border: none; background: transparent; font-size: 13px; font-weight: 700; color: #4b5563; cursor: pointer; transition: all 0.2s; text-align: left; }
        .tab-btn:hover { background: #f0faf5; color: #006a4e; }
        .tab-btn.active { background: #006a4e; color: #fff; }

        .tab-content { background: #fff; border-radius: 16px; border: 1px solid #e1eedf; padding: 28px; box-shadow: 0 4px 20px rgba(0,106,78,0.03); }
        .section-title { font-size: 15px; font-weight: 800; color: #1f2937; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e1eedf; }

        .form-group { margin-bottom: 18px; }
        .form-label { font-size: 12px; font-weight: 700; color: #4b5563; margin-bottom: 6px; display: block; }
        .form-input { width: 100%; padding: 11px 14px; border-radius: 10px; border: 1.5px solid #cce3d3; font-size: 13px; color: #1f2937; outline: none; transition: all 0.2s; background: #fff; }
        .form-input:focus { border-color: #006a4e; background: #f0faf5; }
        .pass-wrap { position: relative; }
        .pass-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; }

        .save-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; border-radius: 12px; background: #006a4e; color: #fff; border: none; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
        .save-btn:hover { background: #004d38; }
        .save-btn.success { background: #059669; }

        .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f3f4f6; }
        .toggle-row:last-child { border-bottom: none; }
        .toggle-label { font-size: 13px; font-weight: 700; color: #1f2937; }
        .toggle-sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .toggle-switch { position: relative; width: 42px; height: 24px; flex-shrink: 0; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-slider { position: absolute; inset: 0; background: #e5e7eb; border-radius: 24px; cursor: pointer; transition: 0.3s; }
        .toggle-slider:before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: 0.3s; }
        input:checked + .toggle-slider { background: #006a4e; }
        input:checked + .toggle-slider:before { transform: translateX(18px); }

        .security-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f3f4f6; }
        .security-item:last-child { border-bottom: none; }
        .security-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 8px; }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-orange { background: #fef3c7; color: #92400e; }
      `}</style>

      <div className="settings-wrap">
        <Link href="/dashboard" className="back-link">
          <ArrowLeft size={14} /> ড্যাশবোর্ডে ফিরে যান
        </Link>

        <h1 className="page-title">⚙️ সেটিংস</h1>

        <div className="settings-layout">
          {/* Sidebar */}
          <div className="tab-sidebar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="tab-content">

            {/* প্রোফাইল */}
            {activeTab === 'profile' && (
              <>
                <p className="section-title">👤 প্রোফাইল তথ্য আপডেট</p>
                <div className="form-group">
                  <label className="form-label">পূর্ণ নাম</label>
                  <input className="form-input" value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} placeholder="আপনার পূর্ণ নাম" />
                </div>
                <div className="form-group">
                  <label className="form-label">মোবাইল নম্বর</label>
                  <input className="form-input" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="01XXXXXXXXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">ইমেইল (ঐচ্ছিক)</label>
                  <input className="form-input" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="example@email.com" />
                </div>
                <button onClick={handleSave} className={`save-btn ${saved ? 'success' : ''}`}>
                  {saved ? <><Check size={16} /> সংরক্ষিত হয়েছে!</> : <><Save size={16} /> পরিবর্তন সংরক্ষণ করুন</>}
                </button>
              </>
            )}

            {/* পাসওয়ার্ড */}
            {activeTab === 'password' && (
              <>
                <p className="section-title">🔒 পাসওয়ার্ড পরিবর্তন</p>
                <div className="form-group">
                  <label className="form-label">বর্তমান পাসওয়ার্ড</label>
                  <div className="pass-wrap">
                    <input className="form-input" type={showOldPass ? 'text' : 'password'} value={passForm.oldPassword} onChange={e => setPassForm({ ...passForm, oldPassword: e.target.value })} placeholder="••••••••" />
                    <button className="pass-toggle" onClick={() => setShowOldPass(!showOldPass)}>{showOldPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">নতুন পাসওয়ার্ড</label>
                  <div className="pass-wrap">
                    <input className="form-input" type={showNewPass ? 'text' : 'password'} value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} placeholder="••••••••" />
                    <button className="pass-toggle" onClick={() => setShowNewPass(!showNewPass)}>{showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input className="form-input" type="password" value={passForm.confirmPassword} onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })} placeholder="••••••••" />
                </div>
                <button onClick={handleSave} className={`save-btn ${saved ? 'success' : ''}`}>
                  {saved ? <><Check size={16} /> পাসওয়ার্ড পরিবর্তিত হয়েছে!</> : <><Lock size={16} /> পাসওয়ার্ড পরিবর্তন করুন</>}
                </button>
              </>
            )}

            {/* নোটিফিকেশন */}
            {activeTab === 'notifications' && (
              <>
                <p className="section-title">🔔 নোটিফিকেশন সেটিংস</p>
                {[
                  { key: 'orderUpdates', label: 'অর্ডার আপডেট', sub: 'অর্ডারের স্ট্যাটাস পরিবর্তন হলে জানান' },
                  { key: 'balanceAlerts', label: 'ব্যালেন্স সতর্কতা', sub: 'ব্যালেন্স কম হলে নোটিফাই করুন' },
                  { key: 'promotions', label: 'প্রমোশন ও অফার', sub: 'নতুন অফার ও ডিসকাউন্ট সম্পর্কে জানান' },
                  { key: 'smsAlerts', label: 'SMS নোটিফিকেশন', sub: 'মোবাইলে SMS পাঠান' },
                ].map(item => (
                  <div key={item.key} className="toggle-row">
                    <div>
                      <p className="toggle-label">{item.label}</p>
                      <p className="toggle-sub">{item.sub}</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={notifications[item.key as keyof typeof notifications]} onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </>
            )}

            {/* নিরাপত্তা */}
            {activeTab === 'security' && (
              <>
                <p className="section-title">🛡️ নিরাপত্তা তথ্য</p>
                {[
                  { label: 'ইমেইল যাচাই', sub: '', status: 'যাচাইকৃত', green: true },
                  { label: 'মোবাইল যাচাই', sub: '', status: 'যাচাইকৃত', green: true },
                  { label: 'NID যাচাই', sub: 'জাতীয় পরিচয়পত্র', status: 'অযাচাইকৃত', green: false },
                  { label: 'দুই স্তর যাচাই (2FA)', sub: 'অতিরিক্ত নিরাপত্তা', status: 'নিষ্ক্রিয়', green: false },
                ].map((item, i) => (
                  <div key={i} className="security-item">
                    <div>
                      <p className="toggle-label">{item.label}</p>
                      <p className="toggle-sub">{item.sub}</p>
                    </div>
                    <span className={`security-badge ${item.green ? 'badge-green' : 'badge-orange'}`}>{item.status}</span>
                  </div>
                ))}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}