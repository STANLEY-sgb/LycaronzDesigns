'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ClipboardList, 
  Settings, 
  Plus, 
  ExternalLink, 
  Phone, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    appointments: 0,
    pendingAppointments: 0,
    orders: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [prodRes, apptRes, ordRes] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }).catch(() => null),
          fetch('/api/appointments', { cache: 'no-store' }).catch(() => null),
          fetch('/api/orders', { cache: 'no-store' }).catch(() => null),
        ]);

        const prods = prodRes && prodRes.ok ? await prodRes.json() : [];
        const appts = apptRes && apptRes.ok ? await apptRes.json() : [];
        const ords = ordRes && ordRes.ok ? await ordRes.json() : [];

        setStats({
          products: Array.isArray(prods) ? prods.length : 0,
          appointments: Array.isArray(appts) ? appts.length : 0,
          pendingAppointments: Array.isArray(appts) 
            ? appts.filter((a: { status: string }) => a.status === 'pending').length 
            : 0,
          orders: Array.isArray(ords) ? ords.length : 0,
        });

        if (Array.isArray(appts)) {
          setRecentAppointments(appts.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { 
      name: 'Total Creations', 
      value: stats.products, 
      icon: <ShoppingBag size={22} />, 
      color: 'bg-blue-600',
      href: '/admin/products' 
    },
    { 
      name: 'Client Inquiries', 
      value: stats.orders, 
      icon: <ClipboardList size={22} />, 
      color: 'bg-amber-600',
      href: '/admin/orders' 
    },
    { 
      name: 'Appointments', 
      value: stats.appointments, 
      icon: <Calendar size={22} />, 
      color: 'bg-indigo-600',
      href: '/admin/appointments' 
    },
    { 
      name: 'Pending Fittings', 
      value: stats.pendingAppointments, 
      icon: <Clock size={22} />, 
      color: 'bg-rose-600',
      href: '/admin/appointments' 
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <Logo size="md" />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles size={11} className="text-amber-600" />
              <span>LYCARONZ Atelier Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 uppercase">
              Atelier Dashboard
            </h1>
            <p className="text-gray-500 font-medium text-xs sm:text-sm mt-0.5">
              Welcome to the LYCARONZ DESIGNS executive administration suite.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/products"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0A0D1F] text-amber-300 font-bold text-xs uppercase tracking-wider hover:bg-[#151B3B] transition-all shadow-md active:scale-95"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center p-3 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-amber-400 transition-all shadow-sm"
            title="Open Live Website"
          >
            <ExternalLink size={16} />
          </Link>
        </div>
      </header>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={stat.href}
              className="block bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200/80 hover:shadow-xl hover:border-amber-400/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl text-white ${stat.color} shadow-md group-hover:scale-105 transition-transform`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 group-hover:text-amber-600 transition-colors">
                  <span>View</span>
                  <ChevronRight size={12} />
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {loading ? '...' : stat.value}
              </p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">
                {stat.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Two-Column Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Recent Appointments */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200/80">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-900">
                Recent Fitting Requests
              </h2>
              <p className="text-xs text-gray-400">Latest atelier reservations</p>
            </div>
            <Link 
              href="/admin/appointments" 
              className="text-amber-600 font-bold text-xs uppercase tracking-wider hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="animate-spin text-amber-500 mx-auto mb-2" size={24} />
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading appointments...</span>
              </div>
            ) : recentAppointments.length > 0 ? (
              recentAppointments.map((appt) => (
                <div 
                  key={appt.id}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-gray-100/70 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900">{appt.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        appt.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : appt.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {appt.service} &bull; {new Date(appt.date).toLocaleDateString()}
                    </p>
                  </div>

                  <a 
                    href={`tel:${appt.phone.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-amber-600 shadow-sm"
                  >
                    <Phone size={12} />
                    <span>{appt.phone}</span>
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 font-medium text-xs">
                No fitting appointments found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Management Shortcuts */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200/80">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-900 mb-1">
            Atelier Controls
          </h2>
          <p className="text-xs text-gray-400 mb-6">Direct management shortcuts</p>

          <div className="grid grid-cols-1 gap-3">
            <Link 
              href="/admin/products"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#0A0D1F] text-amber-300 hover:bg-[#141C38] transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-white">Manage Products</h4>
                  <p className="text-[11px] text-gray-300">Add, edit pricing &amp; gallery photos</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/admin/orders"
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-amber-400 hover:bg-white transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <ClipboardList size={18} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-gray-900">Customer Orders</h4>
                  <p className="text-[11px] text-gray-500">Contact leads &amp; WhatsApp inquiries</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/admin/appointments"
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-amber-400 hover:bg-white transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-gray-900">Fitting Appointments</h4>
                  <p className="text-[11px] text-gray-500">Confirm &amp; manage fitting bookings</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/admin/settings"
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-amber-400 hover:bg-white transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Settings size={18} />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider text-gray-900">Security &amp; Credentials</h4>
                  <p className="text-[11px] text-gray-500">Update password and email credentials</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
