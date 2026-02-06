'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default function MiniCart() {
  const { state: cart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl border border-white/10 bg-slate-950/90 shadow-[0_20px_40px_rgba(3,7,18,0.6)] backdrop-blur-xl z-50">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-100">
          <ShoppingBag className="h-5 w-5 text-cyan-400" />
          Your Cart ({cart.items.length})
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {cart.items.slice(0, 3).map((item) => (
          <div key={item.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
            <div className="flex gap-3">
              {item.imageUrl && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-slate-100">{item.productName}</p>
                {item.variantName && (
                  <p className="text-xs text-slate-400">{item.variantName}</p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
                  <span className="font-semibold text-cyan-300 text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {cart.items.length > 3 && (
          <div className="p-3 text-center text-sm text-slate-400">
            + {cart.items.length - 3} more {cart.items.length - 3 === 1 ? 'item' : 'items'}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/60 border-t border-white/10 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-100">Subtotal:</span>
          <span className="font-bold text-cyan-300">
            {formatPrice(cart.subtotal)}
          </span>
        </div>

        <Link href="/cart" className="block">
          <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900">
            View Cart & Checkout
          </Button>
        </Link>

        <p className="text-xs text-center text-slate-400">
          {cart.shipping === 0 ? (
            <span className="text-emerald-300 font-semibold">Free shipping!</span>
          ) : (
            <span>
              Add {formatPrice(50 - cart.subtotal)} more for free shipping
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
