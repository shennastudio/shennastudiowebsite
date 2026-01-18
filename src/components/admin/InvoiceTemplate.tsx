'use client';

import React from 'react';
import Image from 'next/image';

interface InvoiceTemplateProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZip: string;
    shippingCountry: string;
    total: number;
    subtotal: number;
    shippingCost: number;
    tax: number;
    createdAt: string;
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      variant: {
        sku: string;
        size?: string;
        color?: string;
        material?: string;
        product: {
          name: string;
        };
      };
    }>;
    conservationDonation?: {
      amount: number;
      percentage: number;
    };
  };
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ order }, ref) => {
    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ minHeight: '100vh' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p className="text-gray-600">Shenna's Studio</p>
            <p className="text-gray-600">Ocean-Inspired Handcrafted Jewelry</p>
            <p className="text-gray-600">support@shennastudio.com</p>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <Image
                src="/images/shenna-studio-logo.png"
                alt="Shenna's Studio"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Invoice #</p>
              <p className="text-gray-600">{order.orderNumber}</p>
              <p className="font-semibold mt-2">Date</p>
              <p className="text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Bill To:</h2>
          <div className="text-gray-700">
            <p className="font-medium">{order.customerName}</p>
            <p>{order.customerEmail}</p>
            <p className="mt-2">{order.shippingAddress}</p>
            <p>
              {order.shippingCity}, {order.shippingState} {order.shippingZip}
            </p>
            <p>{order.shippingCountry}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead className="bg-gray-100 border-y border-gray-300">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Variant</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Qty</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-3 px-4 text-gray-800">{item.variant.product.name}</td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                    {item.variant.sku}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {[item.variant.size, item.variant.color, item.variant.material]
                      .filter(Boolean)
                      .join(', ') || '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-800">{item.quantity}</td>
                  <td className="py-3 px-4 text-right text-gray-800">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-800">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">${order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${order.tax.toFixed(2)}</span>
            </div>
            {order.conservationDonation && (
              <div className="flex justify-between py-2 border-b bg-green-50 px-2">
                <span className="text-green-700 font-medium">
                  Conservation Donation ({order.conservationDonation.percentage}%)
                </span>
                <span className="font-medium text-green-700">
                  ${order.conservationDonation.amount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3 border-b-2 border-gray-800 mt-2">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 text-center text-gray-600 text-sm">
          <p className="mb-2">Thank you for your purchase!</p>
          {order.conservationDonation && (
            <p className="text-green-600 font-medium">
              Your purchase includes a ${order.conservationDonation.amount.toFixed(2)} donation
              to marine conservation efforts.
            </p>
          )}
          <p className="mt-4 text-xs text-gray-500">
            Shenna's Studio • Protecting Our Oceans, One Bracelet at a Time
          </p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';
