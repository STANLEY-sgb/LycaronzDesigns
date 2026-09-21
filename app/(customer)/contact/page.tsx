'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { BUSINESS_INFO } from '@/lib/constants';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    consent: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in your name, email, and phone number.');
      return;
    }
    if (!formData.consent) {
      toast.error('Please agree to share your contact details so we can reach you.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Thank you! Your message has been sent to our atelier directors.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
          consent: true,
        });
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to send message. Please try again.');
      }
    } catch {
      toast.error('Network error. You can also contact us directly via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to get in touch regarding tailoring services.'
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#0A0D1F] text-white pt-24 xs:pt-28 sm:pt-36 pb-12 sm:pb-16 px-3 xs:px-4 relative overflow-hidden border-b border-amber-500/20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <Logo size="lg" className="mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 font-black text-xs uppercase tracking-widest mb-3 border border-amber-400/30">
            <Sparkles size={14} className="text-amber-400" />
            <span>Connect With Us</span>
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-5xl font-black tracking-tight mb-3 text-white">
            CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">OUR ATELIER</span>
          </h1>
          <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto font-medium">
            We welcome personal consultations, custom design inquiries, wedding alteration bookings, and fitting appointments at Jemba Plaza.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container-custom py-10 sm:py-16 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Contact Details & Cards */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                Atelier Directory
              </h2>

              {/* Call Us */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-gray-400">Direct Telephone</h4>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    <a href={`tel:${BUSINESS_INFO.primaryPhoneRaw}`} className="hover:text-amber-600 transition-colors">
                      {BUSINESS_INFO.phone}
                    </a>
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-gray-400">WhatsApp Concierge</h4>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {BUSINESS_INFO.whatsapp}
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-black text-[#25D366] hover:underline mt-1"
                  >
                    <span>Instant WhatsApp Chat &rarr;</span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-gray-400">Atelier Inquiries</h4>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-amber-600 transition-colors">
                      {BUSINESS_INFO.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-gray-400">Boutique Location</h4>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {BUSINESS_INFO.location}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5 pt-2 border-t border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-gray-400">Operating Schedule</h4>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">{BUSINESS_INFO.workingHours}</p>
                  <p className="text-[11px] text-gray-500">Sunday: Closed for bespoke design crafting</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-200 h-[240px] sm:h-[280px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.757833005838!2d32.57688137496426!3d0.3129189996840003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb943d63b2f9%3A0x6d9f6f6f6f6f6f6f!2sJemba%20Plaza!5e0!3m2!1sen!2sug!4v1714500000000!5m2!1sen!2sug" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                title="Lycaronz Designs Map"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/80 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-6 font-medium">
                Whether you need a custom suit quotation, an African Ankara dress made to measure, or wedding gown alterations, our atelier team will respond promptly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Christine Namukasa"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g. +256 705 241 179"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@example.com"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Service Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="input-field cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Custom African Ankara Gown">Custom African Ankara Gown</option>
                      <option value="Bespoke Suit Tailoring">Bespoke Suit Tailoring</option>
                      <option value="Bridal Alterations">Bridal Alterations &amp; Detachable Train</option>
                      <option value="Fitting Consultation">In-Person Fitting Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Describe your design idea, preferred styling, or fitting requirements..."
                    className="input-field resize-none"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                    I agree to share my contact information with LYCARONZ DESIGNS so they can contact me regarding my inquiry.
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold py-4 text-xs sm:text-sm uppercase tracking-widest disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Sending to Atelier...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
