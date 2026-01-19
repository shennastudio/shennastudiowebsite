'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Waves, UserPlus, Gift, Heart, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to login page
      router.push('/login?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Coral Reef Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/reefparallaxscroll.jpg"
          alt="Vibrant coral reef in the ocean"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-teal-900/50 to-cyan-900/60" />

        {/* Branding and Benefits on Image */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          {/* Top Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Waves className="h-10 w-10" />
              <h1 className="text-4xl font-bold">Shenna&apos;s Studio</h1>
            </div>
            <p className="text-xl text-cyan-100 max-w-md">
              Handcrafted Ocean Bracelets Supporting Marine Life
            </p>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Join Our Ocean Community</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-slate-900/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Gift className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <h3 className="font-semibold text-lg">100 Welcome Points</h3>
                  <p className="text-cyan-100 text-sm">Start earning rewards immediately</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Heart className="h-6 w-6 flex-shrink-0 text-rose-400" />
                <div>
                  <h3 className="font-semibold text-lg">Support Conservation</h3>
                  <p className="text-cyan-100 text-sm">10% of every purchase protects ocean life</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Sparkles className="h-6 w-6 flex-shrink-0 text-purple-400" />
                <div>
                  <h3 className="font-semibold text-lg">Exclusive Perks</h3>
                  <p className="text-cyan-100 text-sm">Early access to new designs & special offers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Waves className="h-10 w-10 text-cyan-500" />
              <h1 className="text-3xl font-bold text-white">Shenna&apos;s Studio</h1>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-cyan-900/30 to-teal-900/30 rounded-full border border-cyan-800">
                <UserPlus className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Join our ocean-loving community today
            </p>
          </div>

          {/* Signup Bonus Banner - Mobile */}
          <div className="lg:hidden bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Gift className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-yellow-400">100 Welcome Points!</p>
                <p className="text-xs text-yellow-500/80">Get started with bonus rewards</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-900/20 border border-red-800 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-400">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Shenna Rodriguez"
                className="appearance-none block w-full px-4 py-3 border border-slate-700 bg-slate-900 rounded-lg placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="appearance-none block w-full px-4 py-3 border border-slate-700 bg-slate-900 rounded-lg placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="At least 8 characters"
                className="appearance-none block w-full px-4 py-3 border border-slate-700 bg-slate-900 rounded-lg placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="appearance-none block w-full px-4 py-3 border border-slate-700 bg-slate-900 rounded-lg placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-900/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create My Account
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Already have account */}
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}