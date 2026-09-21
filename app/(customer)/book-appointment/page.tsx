'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { BUSINESS_INFO, SERVICES } from '@/lib/constants';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Sparkles,
  Scissors,
  Loader2,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';

export default function BookAppointment() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    service: SERVICES[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Set min date to today's date in YYYY-MM-DDThh:mm format
  const todayIso = new Date().toISOString().slice(0, 16);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      toast.error('Please fill in your name, phone number, and preferred date.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success('Appointment request received! LYCARONZ DESIGNS has been notified.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          date: '',
          service: SERVICES[0],
          notes: '',
        });
      } else {
        const data = await res.json();
        toast.error(data.error || "We couldn't complete your request. Please try again or book via WhatsApp.");
      }
    } catch {
      toast.error('Network error. Please try again or book via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const whatsappBookingUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to schedule a bespoke fitting session at Jemba Plaza.'
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#0A0D1F] text-white pt-24 xs:pt-28 sm:pt-36 pb-12 sm:pb-16 px-3 xs:px-4 relative overflow-hidden border-b border-amber-500/20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" aria-hidden="true" />
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <Logo size="lg" className="mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 font-black text-xs uppercase tracking-widest mb-3 border border-amber-400/30">
            <Sparkles size={14} className="text-amber-400" aria-hidden="true" />
            <span>Atelier Fitting Reservation</span>
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-5xl font-black tracking-tight mb-3 text-white">
            BOOK A <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">FITTING SESSION</span>
          </h1>
          <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto font-medium">
            Schedule a personalized one-on-one session at our Jemba Plaza atelier for custom measurements, bridal alterations, or suit styling.
          </p>
        </div>
      </section>

      {/* Booking Form & Info */}
      <main className="container-custom py-10 sm:py-16 flex-grow">
        <div className="max-w-4xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-200/80 overflow-hidden mb-12"
          >
            {/* Top Bar */}
            <div className="bg-[#0A0D1F] py-6 px-6 sm:px-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10">
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                  {submitted ? 'Request Confirmed' : 'Schedule Fitting'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Jemba Plaza Atelier, Kampala</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <Scissors size={14} aria-hidden="true" />
                <span>Custom Made-to-Measure</span>
              </div>
            </div>

            {/* Success State */}
            {submitted ? (
              <div className="p-8 sm:p-14 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={34} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Request Received!</h3>
                <p className="text-sm text-gray-600 font-medium max-w-md mx-auto mb-2">
                  Your fitting appointment request has been submitted successfully.
                </p>
                <p className="text-sm text-gray-800 font-bold max-w-md mx-auto mb-8">
                  LYCARONZ DESIGNS has been notified and will contact you within 24 hours to confirm your session.
                </p>
                <div className="flex flex-col xs:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Book Another Session
                  </button>
                  <a
                    href={whatsappBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <MessageCircle size={14} aria-hidden="true" />
                    Follow Up on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g. Grace Namusoke"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g. +256 705 241 179"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                      Bespoke Service *
                    </label>
                    <select
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      className="input-field cursor-pointer"
                    >
                      {SERVICES.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                    Preferred Date &amp; Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    min={todayIso}
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Atelier hours: Monday – Saturday, 8:00 AM – 7:00 PM
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                    Styling Notes / Garment Details
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Describe what you would like tailored (e.g. 3-piece suit, wedding gown alteration, Ankara flare dress)..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold py-4 text-xs sm:text-sm uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <CalendarCheck size={18} aria-hidden="true" />
                        <span>Confirm Appointment Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Quick Alternative WhatsApp Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0A0D1F] to-[#141C38] text-white flex flex-col sm:flex-row items-center justify-between gap-5 border border-white/10 shadow-lg mb-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-0.5">
                Prefer Instant Chat?
              </span>
              <h3 className="text-lg font-black text-white">Book Directly on WhatsApp</h3>
              <p className="text-xs text-gray-300 mt-1">
                Chat with our styling team in real time to coordinate an immediate fitting time.
              </p>
            </div>
            <a
              href={whatsappBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs uppercase tracking-widest shrink-0 transition-transform active:scale-95"
            >
              <MessageCircle size={16} aria-hidden="true" />
              <span>WhatsApp Booking</span>
            </a>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <MapPin size={20} aria-hidden="true" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-wider text-gray-900 mb-1">Atelier Studio</h4>
              <p className="text-xs text-gray-500 font-medium">{BUSINESS_INFO.location}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Phone size={20} aria-hidden="true" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-wider text-gray-900 mb-1">Call Us</h4>
              <p className="text-xs text-gray-500 font-medium">{BUSINESS_INFO.primaryPhone}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                <Clock size={20} aria-hidden="true" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-wider text-gray-900 mb-1">Fitting Hours</h4>
              <p className="text-xs text-gray-500 font-medium">Mon – Sat: 8:00 AM – 7:00 PM</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
