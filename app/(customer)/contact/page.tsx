'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { BUSINESS_INFO } from '@/lib/constants';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">We&apos;d love to hear from you. Get in touch for custom designs and fittings.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Call Us</h4>
                    <p className="text-gray-600">{BUSINESS_INFO.phone.split('/').map((p,i)=> (<span key={i}><a href={`tel:${p.replace(/\D/g,'')}`} className="hover:underline">{p.trim()}</a>{i < BUSINESS_INFO.phone.split('/').length -1 ? ' / ' : ''}</span>))}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">WhatsApp</h4>
                    <p className="text-gray-600">{BUSINESS_INFO.whatsapp.split('/').map((w,i)=> (<span key={i}><a href={`https://wa.me/${w.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline">{w.trim()}</a>{i < BUSINESS_INFO.whatsapp.split('/').length -1 ? ' / ' : ''}</span>))}</p>
                    <a 
                      href={`https://wa.me/${BUSINESS_INFO.whatsapp.split('/')[0].replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-medium hover:underline"
                    >
                      Chat now
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Email</h4>
                    <p className="text-gray-600">{BUSINESS_INFO.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Location</h4>
                    <p className="text-gray-600">{BUSINESS_INFO.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Business Hours</h4>
                    <p className="text-gray-600">Mon - Sat: 8:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Sun: Closed</p>
                  </div>
                </div>
              </div>

              {/* Google Maps Iframe */}
              <div className="rounded-2xl overflow-hidden shadow-md h-[300px] bg-gray-200">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.757833005838!2d32.57688137496426!3d0.3129189996840003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb943d63b2f9%3A0x6d9f6f6f6f6f6f6f!2sJemba%20Plaza!5e0!3m2!1sen!2sug!4v1714500000000!5m2!1sen!2sug" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition">
                      <option>General Inquiry</option>
                      <option>Custom Design Quote</option>
                      <option>Appointment Request</option>
                      <option>Alterations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-primary py-3 rounded-lg font-bold text-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
