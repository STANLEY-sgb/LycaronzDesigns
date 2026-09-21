'use client';

import { useEffect, useState } from 'react';
import { 
  User, 
  Lock, 
  Save, 
  Loader2,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        if (session?.user) {
          setFormData(prev => ({
            ...prev,
            name: session.user.name || '',
            email: session.user.email || '',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Settings updated successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        setError(data.error || 'Failed to update settings');
        toast.error(data.error || 'Update failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Settings</h1>
        <p className="text-gray-500 font-medium">Customize your administrative account credentials.</p>
      </header>

      <div className="max-w-3xl">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field pl-12"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Admin Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-field pl-12"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-gray-800">
                <ShieldAlert size={20} className="text-accent" />
                Change Password (Optional)
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Current Password</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  className="input-field"
                  placeholder="Enter current password to verify"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="input-field"
                    placeholder="New secure password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="input-field"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-5 rounded-[2rem] text-xl shadow-2xl transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    UPDATING...
                  </>
                ) : (
                  <>
                    <Save size={24} />
                    SAVE CHANGES
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
