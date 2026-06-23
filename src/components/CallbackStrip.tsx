"use client"
import { useState } from 'react'
import { PhoneCall, PhoneOutgoing } from 'lucide-react'
import { submitLead } from '@/lib/api'

export default function CallbackStrip() {
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  async function handleCall() {
    if (!phone.trim()) return
    setStatus('loading')
    const res = await submitLead({ phone, source: 'callback_strip', client_type: 'buyer' })
    setStatus(res?.ok ? 'ok' : 'error')
  }

  return (
    <div className="bg-gold py-5">
      <div className="container">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white/22 rounded-full flex items-center justify-center flex-shrink-0">
              <PhoneCall size={22} className="text-white" />
            </div>
            <div>
              <div className="font-mont font-extrabold text-white text-[17px] tracking-tight">
                Oddzwonimy do 60 minut
              </div>
              <div className="text-white/80 text-[12px]">
                Zostaw numer — nasz doradca oddzwoni do Ciebie jeszcze dziś
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {status === 'ok' ? (
              <div className="bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-[13px]">
                ✓ Oddzwonimy wkrótce!
              </div>
            ) : (
              <>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+48 … wpisz numer telefonu"
                  className="bg-white/95 rounded-xl px-4 py-3 text-[13px] text-slate-700 w-52 outline-none border-none"
                />
                <button onClick={handleCall} disabled={status === 'loading'}
                  className="flex items-center gap-2 bg-navy text-white text-[12px] font-bold px-5 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60">
                  <PhoneOutgoing size={14} />
                  {status === 'loading' ? '…' : 'Zadzwoń do mnie'}
                </button>
                <a href="https://wa.me/48731554341" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#25D366] text-white text-[12px] font-bold px-4 py-3 rounded-xl hover:brightness-105 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21zm4.5-2.4a7 7 0 1 0-1.1-1.1l-.9 2 2-.9z"/>
                  </svg>
                  WhatsApp
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
