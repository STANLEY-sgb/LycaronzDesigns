'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { 
  ClipboardList, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  RotateCcw, 
  RefreshCw,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Order {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  status: string;
  createdAt: string;
  product?: {
    name: string;
    imageUrl?: string | null;
    price?: number | null;
  };
}

export default function OrdersPage() {
  const { data: orders, error, mutate, isLoading } = useSWR<Order[]>('/api/orders', fetcher, { 
    refreshInterval: 10000 
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  async function updateOrderStatus(id: string, newStatus: string) {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Order status updated to "${newStatus}"`);
        mutate();
      } else {
        toast.error('Failed to update order status');
      }
    } catch {
      toast.error('Network error updating order');
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = (orders || []).filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
              Real-time Inquiries
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 uppercase">
            Orders &amp; Inquiries
          </h1>
          <p className="text-gray-500 font-medium text-xs sm:text-sm mt-0.5">
            Manage customer requests, bespoke orders, and direct client leads.
          </p>
        </div>

        <button
          onClick={() => {
            mutate();
            toast.info('Refreshing inquiries...');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs hover:border-amber-400 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scroll-touch">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'new', label: 'New Inquiries' },
          { id: 'contacted', label: 'Contacted' },
          { id: 'completed', label: 'Completed' },
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

      {/* Orders List */}
      {isLoading ? (
        <div className="bg-white p-16 rounded-3xl border border-gray-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-amber-500" size={36} />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Orders...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-8 rounded-3xl border border-red-200 text-center text-red-600 text-sm font-bold">
          Failed to load orders. Please make sure you are logged in as admin.
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const rawPhone = order.phone.replace(/\D/g, '');
            const whatsappLink = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
              `Hello ${order.name}! We received your inquiry regarding "${order.product?.name || 'our tailoring'}" at LYCARONZ DESIGNS.`
            )}`;

            return (
              <div
                key={order.id}
                className="bg-white p-5 sm:p-7 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                {/* Order Information */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight">
                      {order.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'new'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : order.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium ml-auto sm:ml-0">
                      <Clock size={12} />
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Target Product Tag */}
                  {order.product && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800">
                      <ShoppingBag size={14} className="text-amber-600" />
                      <span>Inquired: <strong>{order.product.name}</strong></span>
                      {order.product.price && (
                        <span className="text-gray-500 font-normal">
                          (UGX {order.product.price.toLocaleString()})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Customer Message */}
                  {order.message && (
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                      &ldquo;{order.message}&rdquo;
                    </div>
                  )}

                  {/* Contact Info Pills */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <a
                      href={`tel:${rawPhone}`}
                      className="flex items-center gap-1.5 text-gray-700 font-bold hover:text-amber-600 transition-colors"
                    >
                      <Phone size={14} className="text-blue-500" />
                      <span>{order.phone}</span>
                    </a>

                    {order.email && (
                      <a
                        href={`mailto:${order.email}`}
                        className="flex items-center gap-1.5 text-gray-700 font-bold hover:text-amber-600 transition-colors"
                      >
                        <Mail size={14} className="text-amber-500" />
                        <span>{order.email}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  {/* WhatsApp Quick Action */}
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp</span>
                  </a>

                  {/* Call Quick Action */}
                  <a
                    href={`tel:${rawPhone}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                  >
                    <Phone size={14} />
                    <span>Call</span>
                  </a>

                  {/* Status Toggle Actions */}
                  {order.status !== 'contacted' && (
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => updateOrderStatus(order.id, 'contacted')}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs uppercase tracking-wider hover:bg-blue-100 active:scale-95 transition-all"
                    >
                      <CheckCircle size={14} />
                      <span>Contacted</span>
                    </button>
                  )}

                  {order.status !== 'completed' && (
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-green-50 text-green-700 border border-green-200 font-bold text-xs uppercase tracking-wider hover:bg-green-100 active:scale-95 transition-all"
                    >
                      <CheckCircle size={14} />
                      <span>Complete</span>
                    </button>
                  )}

                  {order.status !== 'new' && (
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => updateOrderStatus(order.id, 'new')}
                      className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                      title="Mark as New"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-300 text-center space-y-2">
          <ClipboardList size={36} className="mx-auto text-gray-300" />
          <h3 className="font-black text-gray-700 text-base uppercase tracking-tight">No Orders In This View</h3>
          <p className="text-xs text-gray-400">
            {filterStatus === 'all' 
              ? 'New inquiries from product pages will show up here.' 
              : `No orders currently marked as "${filterStatus}".`}
          </p>
        </div>
      )}
    </div>
  );
}
