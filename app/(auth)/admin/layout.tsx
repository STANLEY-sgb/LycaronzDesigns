'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  ClipboardList,
  LogOut, 
  Menu, 
  X,
  Settings,
  ExternalLink,
  Sparkles,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={19} /> },
    { name: 'Products & Catalog', href: '/admin/products', icon: <ShoppingBag size={19} /> },
    { name: 'Orders & Inquiries', href: '/admin/orders', icon: <ClipboardList size={19} /> },
    { name: 'Appointments', href: '/admin/appointments', icon: <Calendar size={19} /> },
    { name: 'Contact Inbox', href: '/admin/inquiries', icon: <Mail size={19} /> },
    { name: 'Admin Settings', href: '/admin/settings', icon: <Settings size={19} /> },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72 bg-[#0A0D1F] text-white border-r border-white/10">
          
          {/* Brand Header */}
          <div className="flex items-center h-20 px-6 border-b border-white/10 gap-3">
            <Logo size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="font-black text-base tracking-tight text-white uppercase leading-none truncate">
                LYCARONZ <span className="text-amber-400">ADMIN</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">
                Atelier Control Suite
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col overflow-y-auto py-6 px-4">
            <nav className="space-y-1.5 flex-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-3 mb-2 block">
                Atelier Management
              </span>

              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                      isActive
                        ? 'bg-amber-400 text-gray-950 shadow-lg shadow-amber-500/20'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* View Live Store Link */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-4 py-3 text-xs font-black uppercase tracking-wider text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-all"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>View Public Store</span>
                </span>
                <ExternalLink size={14} className="text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Bottom Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-xs font-black uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
            >
              <LogOut size={18} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navigation & Drawer */}
      <div className="lg:hidden">
        {/* Mobile Header Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#0A0D1F] border-b border-white/10 px-3 xs:px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 xs:gap-2.5 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open admin menu"
              className="p-2 rounded-xl bg-white/10 text-white shrink-0"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-xs xs:text-sm tracking-tight text-white uppercase leading-none truncate">
                LYCARONZ <span className="text-amber-400">ADMIN</span>
              </span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 truncate">
                Atelier Control
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="text-[10px] xs:text-[11px] font-bold text-amber-300 hover:underline uppercase tracking-wider shrink-0"
          >
            Store &rarr;
          </Link>
        </div>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed inset-y-0 left-0 z-50 w-[min(18rem,92vw)] bg-[#0A0D1F] text-white p-5 xs:p-6 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <Logo size="sm" />
                      <span className="text-lg font-black tracking-tight uppercase text-white">
                        LYCARONZ <span className="text-amber-400">ADMIN</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => setIsSidebarOpen(false)} 
                      className="p-2 bg-white/10 rounded-xl text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl font-black uppercase tracking-wider text-xs transition-all ${
                          pathname === item.href
                            ? 'bg-amber-400 text-gray-950 shadow-md'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-2">
                  <Link
                    href="/"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-gray-300 hover:text-white"
                  >
                    <span>View Public Website</span>
                    <ExternalLink size={14} />
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-xs font-black uppercase tracking-wider text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <LogOut size={18} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 xs:p-4 sm:p-6 lg:p-10 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
