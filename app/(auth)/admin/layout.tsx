'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  Settings
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
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', href: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Appointments', href: '/admin/appointments', icon: <Calendar size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-primary text-white">
          <div className="flex items-center h-16 px-6 bg-primary-dark">
            <span className="text-2xl font-black tracking-tighter uppercase">ST Admin</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-black rounded-xl transition-all ${
                    pathname === item.href
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-black text-white/70 hover:bg-white/10 hover:text-white rounded-xl transition-all"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-primary text-white rounded-xl shadow-lg"
        >
          <Menu size={24} />
        </button>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-primary text-white p-6 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-10">
                  <span className="text-2xl font-black tracking-tighter uppercase">ST Admin</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/10 rounded-full">
                    <X size={24} />
                  </button>
                </div>
                <nav className="space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
                        pathname === item.href
                          ? 'bg-white text-primary shadow-xl'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-4">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="absolute bottom-10 left-6 right-6">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-6 py-4 text-white/60 hover:text-white rounded-2xl transition-all"
                  >
                    <LogOut size={20} className="mr-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
