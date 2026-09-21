'use client';

import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  CheckCircle, 
  XCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  date: string;
  service: string;
  status: string;
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) {
        setAppointments(appointments.map((a: Appointment) => 
          a.id === id ? { ...a, status } : a
        ));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Appointments</h1>
        <p className="text-gray-500 font-medium">Manage fitting and consultation requests.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((appt: Appointment, i) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center w-full lg:w-auto">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Calendar size={32} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">{appt.name}</h3>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-500 uppercase tracking-tighter">
                    <span className="flex items-center gap-2"><Phone size={16} /> {appt.phone}</span>
                    <span className="flex items-center gap-2"><Clock size={16} /> {new Date(appt.date).toLocaleString()}</span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-gray-700">{appt.service}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => updateStatus(appt.id, 'confirmed')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm"
                >
                  <CheckCircle size={18} />
                  Confirm
                </button>
                <button 
                  onClick={() => updateStatus(appt.id, 'cancelled')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 text-center text-gray-400 font-bold uppercase tracking-widest italic">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
}
