'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-black flex items-center justify-center p-6">
      <div className="absolute top-10 left-10">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-all font-black uppercase tracking-widest text-xs">
          <ArrowLeft size={16} />
          Back to Store
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-16">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-gray-900">Admin <span className="text-primary">Portal</span></h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Secure Management Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-12 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none font-bold"
                  placeholder="admin@sharrontailors.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-12 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none font-bold"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-5 rounded-[2rem] text-xl shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  AUTHENTICATING...
                </>
              ) : (
                'ACCESS DASHBOARD'
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Protected by Industry Standard Encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}
