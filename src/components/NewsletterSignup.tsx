'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thanks for subscribing! Check your email for ocean updates.');
        setIsSuccess(true);
        setEmail('');
        setName('');
      } else {
        setMessage(data.error || 'Failed to subscribe');
        setIsSuccess(false);
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="text-3xl">📧</span>
            <h2 className="text-3xl font-bold text-white">
              Join Our Ocean Family
            </h2>
            <span className="text-3xl">🌊</span>
          </div>
          <p className="text-cyan-100 text-lg">
            Get exclusive deals, new product alerts, and marine conservation updates!
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg text-center ${
            isSuccess
              ? 'bg-green-100 border border-green-300 text-green-800'
              : 'bg-red-100 border border-red-300 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="bg-white/90 border-white/50"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="bg-white/90 border-white/50"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-white text-teal-600 hover:bg-gray-100 font-semibold whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          <p className="text-xs text-cyan-100 mt-3 text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}
