'use client';

import { useState, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-data';

type BraceletSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
type ColorPreference = 'ocean' | 'earth' | 'sunset' | 'neutral' | 'surprise';

interface SubscribeCheckoutFormData {
  size: BraceletSize;
  colors: ColorPreference[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  giftMessage: string;
  isGift: boolean;
}

export default function SubscribeTierPage({ params }: { params: Promise<{ tier: string }> }) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const tier = resolvedParams.tier.toUpperCase();
  const plan = SUBSCRIPTION_PLANS.find(p => p.tier === tier);

  const [formData, setFormData] = useState<SubscribeCheckoutFormData>({
    size: 'M',
    colors: ['ocean'],
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    giftMessage: '',
    isGift: false,
  });

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan not found</h1>
          <Link href="/subscribe" className="text-teal-600 hover:underline">
            View all plans
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleColorToggle = (color: ColorPreference) => {
    setFormData(prev => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: colors.length > 0 ? colors : ['surprise'] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, this would create a Stripe subscription
      // For now, we'll show a success message
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to success page
      router.push('/checkout/success?subscription=true');
    } catch (error) {
      console.error('Subscription error:', error);
      setLoading(false);
    }
  };

  const sizes: { value: BraceletSize; label: string; desc: string }[] = [
    { value: 'XS', label: 'XS', desc: '5.5"' },
    { value: 'S', label: 'S', desc: '6"' },
    { value: 'M', label: 'M', desc: '6.5"' },
    { value: 'L', label: 'L', desc: '7"' },
    { value: 'XL', label: 'XL', desc: '7.5"' },
  ];

  const colorOptions: { value: ColorPreference; label: string; colors: string }[] = [
    { value: 'ocean', label: 'Ocean Blues', colors: 'from-blue-400 to-cyan-500' },
    { value: 'earth', label: 'Earth Tones', colors: 'from-amber-600 to-yellow-500' },
    { value: 'sunset', label: 'Sunset', colors: 'from-orange-400 to-pink-500' },
    { value: 'neutral', label: 'Neutral', colors: 'from-gray-400 to-stone-500' },
    { value: 'surprise', label: 'Surprise Me!', colors: 'from-purple-400 to-pink-400' },
  ];

  const tierColors = {
    BASIC: 'from-cyan-500 to-teal-500',
    PREMIUM: 'from-teal-500 to-emerald-500',
    COLLECTOR: 'from-purple-500 to-pink-500',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${tierColors[plan.tier as keyof typeof tierColors]} py-12`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/subscribe" className="text-white/80 hover:text-white text-sm mb-4 inline-block">
            ← Back to plans
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{plan.name}</h1>
              <p className="text-white/80">{plan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">${plan.price}</div>
              <div className="text-white/80">/month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 ${
                    step > s ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 text-sm text-gray-500">
          <span className={step === 1 ? 'text-teal-600 font-medium' : ''}>Preferences</span>
          <span className={step === 2 ? 'text-teal-600 font-medium' : ''}>Shipping</span>
          <span className={step === 3 ? 'text-teal-600 font-medium' : ''}>Payment</span>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Preferences */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Preferences</h2>

              {/* Size Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Bracelet Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, size: size.value }))}
                      className={`px-6 py-3 rounded-xl border-2 transition-all ${
                        formData.size === size.value
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{size.label}</div>
                      <div className="text-xs text-gray-500">{size.desc}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Not sure? Measure your wrist and add 0.5-1 inch for a comfortable fit.
                </p>
              </div>

              {/* Color Preferences */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color Preferences (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleColorToggle(color.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.colors.includes(color.value)
                          ? 'border-teal-500 ring-2 ring-teal-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-full h-8 rounded-lg bg-gradient-to-r ${color.colors} mb-2`}
                      />
                      <div className="text-sm font-medium">{color.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gift Option */}
              <div className="mb-8">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isGift"
                    checked={formData.isGift}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-teal-600 rounded border-gray-300"
                  />
                  <span className="font-medium">This is a gift</span>
                </label>

                {formData.isGift && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gift Message (optional)
                    </label>
                    <textarea
                      name="giftMessage"
                      value={formData.giftMessage}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Write a message to include with the gift..."
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apartment, Suite, etc.
                </label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="TX">Texas</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="FL">Florida</option>
                    {/* Add more states as needed */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    maxLength={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm & Pay</h2>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{plan.name} Subscription</span>
                    <span className="font-medium">${plan.price}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Size: {formData.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Colors: {formData.colors.map(c =>
                        colorOptions.find(o => o.value === c)?.label
                      ).join(', ')}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Monthly Total</span>
                      <span>${plan.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Shipping To</h3>
                <p className="text-gray-600">
                  {formData.firstName} {formData.lastName}<br />
                  {formData.address1}<br />
                  {formData.address2 && <>{formData.address2}<br /></>}
                  {formData.city}, {formData.state} {formData.zip}
                </p>
              </div>

              {/* Payment Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Secure Payment via Stripe</p>
                    <p>You&apos;ll be redirected to Stripe to complete your payment securely.</p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    className="w-5 h-5 mt-0.5 text-teal-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-teal-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-teal-600 hover:underline">
                      Privacy Policy
                    </Link>
                    . I understand this is a recurring subscription that will be billed monthly.
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Subscribe - $${plan.price}/mo`
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
