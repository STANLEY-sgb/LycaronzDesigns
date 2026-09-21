'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, Clock, RefreshCw, MessageCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string | null;
  status: string;
  refId: string;
  createdAt: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      setLoading(true);
      const res = await fetch('/api/inquiries', { cache: 'no-store' });
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }

  const filtered = inquiries.filter((i) =>
    filterStatus === 'all' ? true : i.status === filterStatus
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
              Contact Inbox
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 uppercase">
            Customer Inquiries
          </h1>
          <p className="text-gray-500 font-medium text-xs sm:text-sm mt-0.5">
            All general inquiries submitted via the Contact page.
          </p>
        </div>

        <button
          onClick={() => { fetchInquiries(); toast.info('Refreshing inquiries...'); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs hover:border-amber-400 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scroll-touch">
        {[
          { id: 'all',     label: 'All Inquiries' },
          { id: 'new',     label: 'New' },
          { id: 'replied', label: 'Replied' },
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

      {/* Inquiries List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="bg-white p-20 rounded-3xl border border-gray-200 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-amber-500" size={36} />
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Inquiries...</span>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((inq, i) => (
            <motion.div
              key={inq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-gray-200/80 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                      <Mail size={18} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">{inq.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      inq.status === 'new'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {inq.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-gray-500 pl-12">
                    <span className="font-bold text-gray-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                      {inq.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      {new Date(inq.createdAt).toLocaleDateString()} {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-mono text-gray-400 text-[10px]">{inq.refId}</span>
                  </div>

                  {inq.message && (
                    <p className="text-sm text-gray-700 font-medium pl-12 line-clamp-3 leading-relaxed">
                      &ldquo;{inq.message}&rdquo;
                    </p>
                  )}
                </div>

                {/* Right: Contact Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs uppercase tracking-wider hover:bg-blue-100 active:scale-95 transition-all"
                    title={inq.email}
                  >
                    <Mail size={14} />
                    <span className="hidden xs:inline truncate max-w-[140px]">{inq.email}</span>
                    <span className="xs:hidden">Reply</span>
                  </a>

                  {inq.phone && (
                    <>
                      <a
                        href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}! This is LYCARONZ DESIGNS regarding your inquiry.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#25D366] text-white hover:brightness-110 shadow-sm active:scale-95 transition-all"
                        title="WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </a>
                      <a
                        href={`tel:${inq.phone.replace(/\D/g, '')}`}
                        className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm active:scale-95 transition-all"
                        title="Call"
                      >
                        <Phone size={16} />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-300 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            No inquiries found.
          </div>
        )}
      </div>
    </div>
  );
}
