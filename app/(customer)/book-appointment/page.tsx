'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BUSINESS_INFO, SERVICES } from '@/lib/constants';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Appointment booked successfully! We will contact you soon.');
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
        toast.error(data.error || 'Failed to book appointment');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-[#6B4C9A] py-8 px-8 text-white text-center">
              <h1 className="text-3xl font-bold">Book an Appointment</h1>
              <p className="mt-2 opacity-90">Schedule a session for a perfect fit</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+256 700 000 000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="input-field"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                <input
                  type="datetime-local"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Special Requests</label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Describe what you need..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary py-4 text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </form>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-[#6B4C9A] font-bold text-xl mb-2">Visit Us</div>
              <p className="text-gray-600 text-sm">{BUSINESS_INFO.location}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-[#6B4C9A] font-bold text-xl mb-2">Call Us</div>
              <p className="text-gray-600 text-sm">{BUSINESS_INFO.phone}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-[#6B4C9A] font-bold text-xl mb-2">WhatsApp</div>
              <p className="text-gray-600 text-sm">{BUSINESS_INFO.whatsapp}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
