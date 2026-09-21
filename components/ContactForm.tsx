"use client";

import { useState } from 'react';

export default function ContactForm({ productId }: { productId?: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      alert('Please consent to share your contact details so we can reach you.');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, name, email, phone, message, consent }),
      });
      if (res.ok) {
        setStatus('success');
        setName(''); setEmail(''); setPhone(''); setMessage(''); setConsent(false);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input required value={name} onChange={e=>setName(e.target.value)} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input required value={phone} onChange={e=>setPhone(e.target.value)} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Message (optional)</label>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} className="input" />
      </div>
      <div className="flex items-start gap-2">
        <input id="consent" type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
        <label htmlFor="consent" className="text-sm">I consent to share my contact details so the business can respond. (Required)</label>
      </div>
      <div>
        <button type="submit" className="btn" disabled={status==='sending'}>{status==='sending'? 'Sending...' : 'Send'}</button>
        {status==='success' && <span className="ml-3 text-green-600">Sent — we will contact you soon.</span>}
        {status==='error' && <span className="ml-3 text-red-600">Failed to send. Try again later.</span>}
      </div>
    </form>
  );
}
