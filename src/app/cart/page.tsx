'use client'

import { useCart, PayloadCartItem } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import CartUpsells from '@/components/CartUpsells'

export default function CartPage() {
  const { state, clearCart, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateItemTotal = (item: PayloadCartItem) => {
    return formatPrice(item.price * item.quantity);
  };

  const handleCheckout = () => {
    // Check if user is logged in
    if (!session?.user) {
      // Redirect to login with callback to checkout
      router.push('/login?callbackUrl=/checkout');
      return;
    }

    // Redirect to checkout page
    router.push('/checkout');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-6xl mb-4">🌊</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your Ocean Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Ready to discover beautiful ocean-inspired bracelets that support marine conservation?
          </p>
          <Link
            href="/products"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Shop Ocean Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Your Ocean Conservation Cart
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-cyan-200 rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.productName}
                      </h3>
                      {item.variantName && (
                        <p className="text-sm text-gray-600">
                          {item.variantName}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        SKU: {item.variantSku || item.productSku}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </div>
                      <div className="text-lg font-bold text-teal-600">
                        {calculateItemTotal(item)}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value) || 1;
                              if (newQty > 0 && newQty <= item.stock) {
                                updateQuantity(item.id, newQty);
                              }
                            }}
                            className="w-16 text-center border-x border-gray-300 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <button
                            onClick={() => {
                              if (item.quantity < item.stock) {
                                updateQuantity(item.id, item.quantity + 1);
                              }
                            }}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                        {item.stock <= 10 && (
                          <span className="text-xs text-orange-600 font-medium">
                            Only {item.stock} left
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Frequently Bought Together - Show for first/main item */}
            {state.items.length > 0 && (
              <CartUpsells
                productId={state.items[0].productId}
                productName={state.items[0].productName}
              />
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(state.subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{formatPrice(state.shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">{formatPrice(state.tax)}</span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-teal-600">{formatPrice(state.total)}</span>
                </div>
              </div>

              {/* Conservation Message */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-cyan-200 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600 mb-2">
                    {formatPrice(state.total * 0.10)}
                  </div>
                  <div className="text-sm text-gray-700">
                    10% of your purchase goes to ocean conservation
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Supporting sea turtles, whales, and marine ecosystems in Rio Grande Valley
                  </div>
                </div>
              </div>

              {/* Free Shipping Banner */}
              {state.subtotal >= 50 && (
                <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
                  <div className="font-semibold">FREE SHIPPING</div>
                  <div className="text-sm">Your order qualifies for free shipping!</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
                <Link
                  href="/products"
                  className="block text-center text-teal-600 hover:text-teal-700 py-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}