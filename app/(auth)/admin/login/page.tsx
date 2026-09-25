'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import Logo from '@/components/Logo';
import { signIn } from 'next-auth/react';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const signInError = searchParams.get('error');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/admin/dashboard',
      });
    } catch {
      setError('Sign-in did not finish. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D1F] flex items-center justify-center p-4 xs:p-6 relative overflow-hidden selection:bg-amber-400 selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Return to Store Link */}
      <div className="absolute top-4 left-3 xs:top-6 xs:left-6 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors font-black uppercase tracking-widest text-[10px] xs:text-xs"
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 pt-12 xs:pt-0 px-0"
      >
        <div className="bg-white rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden p-5 xs:p-6 sm:p-10 border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-6 xs:mb-8">
            <Logo size="lg" priority className="mx-auto mb-4" />
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-tight uppercase text-gray-900 leading-tight">
              LYCARONZ <span className="text-amber-600">ADMIN</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] mt-1">
              Atelier Management Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                Staff Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="admin@lycaronzdesigns.com"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {(error || signInError) && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center border border-red-200"
              >
                {error || 'Invalid credentials. Please verify your email and password.'}
              </motion.div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-4 text-xs sm:text-sm shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Verifying Access...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Access Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Encrypted Session Authentication</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
