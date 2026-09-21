'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">About Lycaronz Designs</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated to the art of tailoring, we bring your fashion dreams to life with precision, 
              passion, and a perfect fit.
            </p>
          </motion.div>

          {/* Story Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in the heart of Kampala, Lycaronz Designs began with a simple mission: 
                  to provide high-quality, custom-tailored clothing that makes people feel confident 
                  and comfortable.
                </p>
                <p>
                  Over the years, we have grown into a trusted name for elegant African fashion, 
                  corporate wear, and exquisite bridal alterations. Our location at Jemba Plaza 
                  has become a hub for creativity and craftsmanship.
                </p>
                <p>
                  Every garment we create is a result of meticulous attention to detail and 
                  a deep understanding of our clients&apos; unique styles.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-primary flex items-center justify-center text-white text-4xl font-bold"
            >
              <span className="text-center p-8">Lycaronz Designs<br/>Since 2026</span>
            </motion.div>
          </div>

          {/* Values Section */}
          <div className="bg-gray-50 rounded-3xl p-12 mb-24">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Quality',
                  desc: 'We use the finest materials and traditional techniques to ensure durability and elegance.',
                  icon: '✨'
                },
                {
                  title: 'Precision',
                  desc: 'A perfect fit is non-negotiable. We measure twice and cut once for ultimate accuracy.',
                  icon: '📏'
                },
                {
                  title: 'Customer First',
                  desc: 'Your satisfaction is our priority. We listen, advise, and deliver beyond expectations.',
                  icon: '🤝'
                }
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white p-8 rounded-xl shadow-sm text-center"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Services Teaser */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Experience the Difference</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether it&apos;s a custom suit, an Ankara dress, or a simple alteration, 
              we are here to help you look your best.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/products" className="btn-primary">View Products</a>
              <a href="/contact" className="btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
