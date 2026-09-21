'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  ShoppingBag, 
  Calendar, 
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    appointments: 0,
    pendingAppointments: 0,
  });
  const seen = useRef<Record<string, boolean>>({});
  const seenVisits = useRef<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchStats() {
      try {
        const prodRes = await fetch('/api/products');
        const prods = await prodRes.json();
        
        const apptRes = await fetch('/api/appointments');
        const appts = await apptRes.json();
        
        setStats({
          products: prods.length,
          appointments: appts.length,
          pendingAppointments: appts.filter((a: { status: string }) => a.status === 'pending').length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    fetchStats();

    // Poll for new orders and notify
    async function pollOrders() {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) return;
        const orders = await res.json();
        for (const o of orders) {
          if (!seen.current[o.id]) {
            // new order
            toast(`${o.name} requested ${o.product?.name || o.productId}`);
            seen.current[o.id] = true;
          }
        }
      } catch {
        // ignore polling errors
      }
    }

    // Poll for recent visits and notify
    async function pollVisits() {
      try {
        const res = await fetch('/api/visits');
        if (!res.ok) return;
        const visits = await res.json();
        for (const v of visits) {
          const key = `${v.ip}-${v.time}`;
          if (!seenVisits.current[key]) {
            toast(`Visitor on ${v.path} — ${new Date(v.time).toLocaleString()}`);
            seenVisits.current[key] = true;
          }
        }
      } catch {
        // ignore
      }
    }

    pollOrders();
    pollVisits();
    const id = setInterval(() => { pollOrders(); pollVisits(); }, 5000);
    return () => { clearInterval(id); };
  }, []);

  const statCards = [
    { name: 'Total Products', value: stats.products, icon: <ShoppingBag size={24} />, color: 'bg-blue-500' },
    { name: 'Total Appointments', value: stats.appointments, icon: <Calendar size={24} />, color: 'bg-purple-500' },
    { name: 'Pending Requests', value: stats.pendingAppointments, icon: <Clock size={24} />, color: 'bg-yellow-500' },
    { name: 'Site Visitors', value: '1,284', icon: <TrendingUp size={24} />, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Dashboard</h1>
        <p className="text-gray-500 font-medium">Welcome back to Lycaronz Designs Admin Panel.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl text-white ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Live Stats</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight">Recent Appointments</h2>
            <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            <div className="text-center py-10 text-gray-400 font-medium">
              No recent activity found.
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center justify-between p-6 rounded-3xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all text-primary">
              <span className="font-black uppercase tracking-widest text-sm">Add Product</span>
              <ChevronRight size={20} />
            </button>
            <button className="flex items-center justify-between p-6 rounded-3xl bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-all text-secondary">
              <span className="font-black uppercase tracking-widest text-sm">Manage Orders</span>
              <ChevronRight size={20} />
            </button>
            <button className="flex items-center justify-between p-6 rounded-3xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-all text-accent">
              <span className="font-black uppercase tracking-widest text-sm">Site Settings</span>
              <ChevronRight size={20} />
            </button>
            <button className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all text-gray-600">
              <span className="font-black uppercase tracking-widest text-sm">Help Center</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
