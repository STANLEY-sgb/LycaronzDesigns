'use client';

import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  MessageCircle,
  CheckCircle, 
  XCircle,
  CheckCheck,
  RotateCcw,
  Loader2,
  RefreshCw,
  Scissors
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  date: string;
  service: string;
  notes?: string | null;
  status: string;
  createdAt?: string;
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments', { cache: 'no-store' });
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) {
        toast.success(`Appointment status updated to "${status}"`);
        setAppointments(appointments.map((a: Appointment) => 
          a.id === id ? { ...a, status } : a
        ));
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
              Atelier Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 uppercase">
            Appointments &amp; Fittings
          </h1>
          <p className="text-gray-500 font-medium text-xs sm:text-sm mt-0.5">
            Manage bespoke fittings, wedding alterations, and in-person consultations.
          </p>
        </div>

        <button
          onClick={() => {
            fetchAppointments();
            toast.info('Refreshing schedule...');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs hover:border-amber-400 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scroll-touch">
        {[
          { id: 'all', label: 'All Appointments' },
          { id: 'pending', label: 'Pending' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              filterStatus === tab.id
                ? 'bg-[#0A0D1F] text-amber-300 shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="bg-white p-20 rounded-3xl border border-gray-200 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-amber-500" size={36} />
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Fitting Schedule...</span>
          </div>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt, i) => {
            const rawPhone = appt.phone.replace(/\D/g, '');
            const whatsappLink = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
              `Hello ${appt.name}! This is LYCARONZ DESIGNS regarding your appointment for ${appt.service} on ${new Date(appt.date).toLocaleDateString()}.`
            )}`;

            return (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-gray-200/80 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full lg:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                    <Calendar size={24} />
                  </div>
                  
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-900 truncate">
                        {appt.name}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        appt.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        appt.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        appt.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {appt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-gray-500">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <Clock size={13} className="text-amber-500" />
                        {new Date(appt.date).toLocaleDateString()} at {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-md text-gray-800">
                        <Scissors size={12} className="text-gray-500" />
                        {appt.service}
                      </span>
                    </div>

                    {appt.notes && (
                      <p className="text-xs text-gray-600 font-medium italic mt-1 line-clamp-2">
                        &ldquo;{appt.notes}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center gap-3 pt-1 text-xs">
                      <a 
                        href={`tel:${rawPhone}`}
                        className="flex items-center gap-1 text-gray-700 hover:text-amber-600 font-bold"
                      >
                        <Phone size={13} className="text-blue-500" />
                        <span>{appt.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Status and Contact Controls */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#25D366] text-white hover:brightness-110 shadow-sm active:scale-95 transition-all"
                    title="Message Client on WhatsApp"
                  >
                    <MessageCircle size={16} />
                  </a>

                  <a
                    href={`tel:${rawPhone}`}
                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm active:scale-95 transition-all"
                    title="Call Client"
                  >
                    <Phone size={16} />
                  </a>

                  {appt.status !== 'confirmed' && (
                    <button 
                      disabled={updatingId === appt.id}
                      onClick={() => updateStatus(appt.id, 'confirmed')}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-100 active:scale-95 transition-all"
                    >
                      <CheckCircle size={14} />
                      <span>Confirm</span>
                    </button>
                  )}

                  {appt.status !== 'completed' && (
                    <button 
                      disabled={updatingId === appt.id}
                      onClick={() => updateStatus(appt.id, 'completed')}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-green-100 active:scale-95 transition-all"
                    >
                      <CheckCheck size={14} />
                      <span>Completed</span>
                    </button>
                  )}

                  {appt.status !== 'cancelled' && (
                    <button 
                      disabled={updatingId === appt.id}
                      onClick={() => updateStatus(appt.id, 'cancelled')}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-100 active:scale-95 transition-all"
                    >
                      <XCircle size={14} />
                      <span>Cancel</span>
                    </button>
                  )}

                  {appt.status !== 'pending' && (
                    <button
                      disabled={updatingId === appt.id}
                      onClick={() => updateStatus(appt.id, 'pending')}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                      title="Reset to Pending"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-300 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            No fitting appointments found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
