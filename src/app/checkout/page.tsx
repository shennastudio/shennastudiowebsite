'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShoppingBag, ArrowLeft, Truck, Tag, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import CartItemImage from '@/components/CartItemImage';
import CheckoutFeaturedProducts from '@/components/CheckoutFeaturedProducts';

// Static USPS shipping rates
const USPS_SHIPPING_RATES = [
  {
    id: 'usps-ground',
    provider: 'USPS',
    servicelevel: { name: 'Ground Advantage', token: 'ground' },
    amount: '5.95',
    estimated_days: 5,
    duration_terms: '5-7 business days',
  },
  {
    id: 'usps-priority',
    provider: 'USPS',
    servicelevel: { name: 'Priority Mail', token: 'priority' },
    amount: '9.95',
    estimated_days: 3,
    duration_terms: '2-3 business days',
  },
  {
    id: 'usps-express',
    provider: 'USPS',
    servicelevel: { name: 'Priority Mail Express', token: 'express' },
    amount: '24.95',
    estimated_days: 1,
    duration_terms: '1-2 business days',
  },
];

interface AppliedDiscount {
  id: string;
  code: string;
  type: string;
  value: number;
  description: string;
  discountAmount: number;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { state: cart, applyDiscount, removeDiscount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState('');
  
  // Use discount from context
  const appliedDiscount = cart.discount ? {
    ...cart.discount,
    discountAmount: cart.discount.amount
  } : null;

  // Shipping State - pre-select first rate
  const [selectedRate, setSelectedRate] = useState(USPS_SHIPPING_RATES[0]);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  // Update form with session data when available
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        email: session.user?.email || prev.email,
        name: session.user?.name || prev.name,
      }));
    }
  }, [session]);

  // Check for free shipping (orders $50+ or discount includes free shipping)
  const qualifiesForFreeShipping = cart.subtotal >= 50 || appliedDiscount?.type === 'FREE_SHIPPING';

  // Apply discount code
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    setDiscountLoading(true);
    setDiscountError('');

    try {
      const response = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode, subtotal: cart.subtotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDiscountError(data.error || 'Invalid discount code');
      } else {
        // Apply to global cart state
        applyDiscount(
          data.discount.code,
          data.discount.type,
          data.discount.value,
          data.discount.description
        );
        setDiscountError('');
      }
    } catch {
      setDiscountError('Failed to validate discount code');
    } finally {
      setDiscountLoading(false);
    }
  };

  // Remove applied discount
  const handleRemoveDiscount = () => {
    removeDiscount();
    setDiscountCode('');
    setDiscountError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic form validation
    if (!formData.email || !formData.name || !formData.line1 || !formData.city || !formData.state || !formData.postalCode) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Calculate shipping (free for orders $50+)
      const shippingCost = qualifiesForFreeShipping ? 0 : parseFloat(selectedRate.amount);
      const discountAmount = appliedDiscount?.discountAmount || 0;

      // Recalculate total with shipping and discount
      const finalTotal = Math.max(0, cart.subtotal - discountAmount + shippingCost + cart.tax);

      // Create checkout session (works for both guest and logged-in users)
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          subtotal: cart.subtotal,
          shipping: shippingCost,
          tax: cart.tax,
          total: finalTotal,
          shippingAddress: {
            name: formData.name,
            line1: formData.line1,
            line2: formData.line2,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          customerEmail: formData.email,
          shippingMethod: qualifiesForFreeShipping ? 'Free Shipping' : `${selectedRate.provider} ${selectedRate.servicelevel.name}`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 503) {
          setError('Payment processing is temporarily unavailable. Please contact support or try again later.');
        } else {
          throw new Error(data.error || 'Failed to create checkout session');
        }
        setLoading(false);
        return;
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to proceed to checkout');
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate final shipping and total
  const finalShipping = qualifiesForFreeShipping ? 0 : parseFloat(selectedRate.amount);
  const discountAmount = appliedDiscount?.discountAmount || 0;
  const finalTotal = Math.max(0, cart.subtotal - discountAmount + finalShipping + cart.tax);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="line1">Address Line 1 *</Label>
                    <Input
                      id="line1"
                      name="line1"
                      value={formData.line1}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Ocean Ave"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      name="line2"
                      value={formData.line2}
                      onChange={handleInputChange}
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="South Padre"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="TX"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Zip Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        placeholder="78597"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        placeholder="US"
                        disabled
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  {/* Shipping Method Selection */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Method
                    </h3>

                    {qualifiesForFreeShipping ? (
                      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-green-800">FREE Shipping!</p>
                            <p className="text-sm text-green-700">USPS Ground Advantage (5-7 business days)</p>
                          </div>
                          <span className="text-lg font-bold text-green-700">$0.00</span>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          Congratulations! Your order qualifies for free shipping.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {USPS_SHIPPING_RATES.map((rate) => (
                          <div
                            key={rate.id}
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedRate?.id === rate.id ? 'border-teal-500 bg-teal-50' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedRate(rate)}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                checked={selectedRate?.id === rate.id}
                                onChange={() => setSelectedRate(rate)}
                                className="mr-3 text-teal-600 focus:ring-teal-500"
                              />
                              <div>
                                <p className="font-medium text-sm">{rate.provider} {rate.servicelevel.name}</p>
                                <p className="text-xs text-gray-500">{rate.duration_terms}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-sm">${rate.amount}</span>
                          </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-2">
                          Free shipping on orders $50+
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Guest checkout note - simplified */}
                  {!session?.user && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
                      <p className="text-xs text-gray-600">
                        Checking out as guest.{' '}
                        <Link href="/auth/signin?callbackUrl=/checkout" className="text-teal-600 hover:underline">
                          Sign in
                        </Link>
                        {' '}to track orders and earn rewards.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Proceed to Payment - $${finalTotal.toFixed(2)}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.imageUrl && (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                          <CartItemImage
                            src={item.imageUrl}
                            alt={item.productName}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-xs text-gray-600">{item.variantName}</p>
                        )}
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium">Discount Code</span>
                  </div>
                  
                  {appliedDiscount ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">{appliedDiscount.code}</p>
                          <p className="text-xs text-green-600">{appliedDiscount.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveDiscount}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyDiscount}
                        disabled={discountLoading}
                      >
                        {discountLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                      </Button>
                    </div>
                  )}
                  
                  {discountError && (
                    <p className="text-xs text-red-600 mt-2">{discountError}</p>
                  )}
                </div>

                {/* You Might Also Like - Featured Products with One-click add */}
                <CheckoutFeaturedProducts 
                  cartProductIds={cart.items.map(item => String(item.productId))}
                  limit={4}
                />

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount && appliedDiscount.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span>-${appliedDiscount.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={qualifiesForFreeShipping ? 'text-green-600 font-medium' : ''}>
                      {qualifiesForFreeShipping ? 'FREE' : `$${selectedRate.amount}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8.25%)</span>
                    <span>${cart.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-teal-900 font-medium">Conservation Impact</p>
                  <p className="text-xs text-teal-700 mt-1">
                    10% (${(cart.subtotal * 0.10).toFixed(2)}) of your purchase supports marine conservation in South Padre Island
                  </p>
                </div>

                {session?.user && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🎁</span>
                      <p className="text-base text-blue-900 font-bold">Rewards Points</p>
                    </div>

                    <div className="bg-white/70 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-900 font-semibold mb-1">
                        This Purchase: +4 Points
                      </p>
                      <p className="text-xs text-blue-700">
                        Every purchase earns you points toward free items!
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-white/50 rounded p-2 border border-purple-200">
                        <p className="font-bold text-purple-900 mb-1">How It Works:</p>
                        <div className="space-y-1 text-purple-800">
                          <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">1.</span>
                            <span>Make a purchase → Earn <strong>4 points</strong></span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">2.</span>
                            <span>Collect <strong>40 points</strong> (10 purchases)</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">3.</span>
                            <span>Redeem → Get <strong>1 FREE item</strong> + FREE shipping!</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded p-2 border border-yellow-300">
                        <p className="text-yellow-900 font-semibold">
                           40 Points = 1 Free Bracelet + Free Shipping!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
