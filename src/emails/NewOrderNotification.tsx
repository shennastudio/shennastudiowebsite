import {
  Text,
  Section,
  Row,
  Column,
  Heading,
  Hr,
} from '@react-email/components';
import * as React from 'react';
import OceanEmailLayout from './components/OceanEmailLayout';

interface OrderItem {
  name: string;
  variantName?: string | null;
  quantity: number;
  price: number;
}

interface NewOrderNotificationProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  conservationAmount: number;
  shippingAddress: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export default function NewOrderNotification({
  orderNumber,
  customerName,
  customerEmail,
  items,
  subtotal,
  shipping,
  tax,
  total,
  conservationAmount,
  shippingAddress,
}: NewOrderNotificationProps) {
  return (
    <OceanEmailLayout preview={`New order ${orderNumber} - $${total.toFixed(2)} from ${customerName}`}>
      <Section style={{ padding: '24px' }}>
        <Heading
          as="h1"
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#0d9488',
            textAlign: 'center',
            margin: '0 0 8px',
          }}
        >
          New Order Received!
        </Heading>
        <Text
          style={{
            fontSize: '18px',
            color: '#334155',
            textAlign: 'center',
            margin: '0 0 24px',
          }}
        >
          Order {orderNumber} &mdash; ${total.toFixed(2)}
        </Text>

        <Hr style={{ borderColor: '#e2e8f0', margin: '16px 0' }} />

        {/* Customer Info */}
        <Heading
          as="h2"
          style={{ fontSize: '16px', fontWeight: '600', color: '#475569', margin: '0 0 8px' }}
        >
          Customer
        </Heading>
        <Text style={{ fontSize: '14px', color: '#334155', margin: '0 0 4px' }}>
          {customerName}
        </Text>
        <Text style={{ fontSize: '14px', color: '#334155', margin: '0 0 16px' }}>
          {customerEmail}
        </Text>

        {/* Ship To */}
        <Heading
          as="h2"
          style={{ fontSize: '16px', fontWeight: '600', color: '#475569', margin: '0 0 8px' }}
        >
          Ship To
        </Heading>
        <Text style={{ fontSize: '14px', color: '#334155', margin: '0 0 2px' }}>
          {shippingAddress.name}
        </Text>
        <Text style={{ fontSize: '14px', color: '#334155', margin: '0 0 2px' }}>
          {shippingAddress.line1}
        </Text>
        {shippingAddress.line2 && (
          <Text style={{ fontSize: '14px', color: '#334155', margin: '0 0 2px' }}>
            {shippingAddress.line2}
          </Text>
        )}
        <Text style={{ fontSize: '14px', color: '#334155', margin: '0 0 16px' }}>
          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
        </Text>

        <Hr style={{ borderColor: '#e2e8f0', margin: '16px 0' }} />

        {/* Items */}
        <Heading
          as="h2"
          style={{ fontSize: '16px', fontWeight: '600', color: '#475569', margin: '0 0 12px' }}
        >
          Items Ordered
        </Heading>
        {items.map((item, i) => (
          <Row key={i} style={{ marginBottom: '8px' }}>
            <Column style={{ width: '60%' }}>
              <Text style={{ fontSize: '14px', color: '#334155', margin: '0', fontWeight: '500' }}>
                {item.name}
                {item.variantName ? ` - ${item.variantName}` : ''}
              </Text>
            </Column>
            <Column style={{ width: '15%', textAlign: 'center' }}>
              <Text style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>
                x{item.quantity}
              </Text>
            </Column>
            <Column style={{ width: '25%', textAlign: 'right' }}>
              <Text style={{ fontSize: '14px', color: '#334155', margin: '0', fontWeight: '500' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </Column>
          </Row>
        ))}

        <Hr style={{ borderColor: '#e2e8f0', margin: '16px 0' }} />

        {/* Totals */}
        <Row>
          <Column style={{ width: '70%' }}>
            <Text style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px' }}>Subtotal</Text>
          </Column>
          <Column style={{ width: '30%', textAlign: 'right' }}>
            <Text style={{ fontSize: '14px', color: '#334155', margin: '0 0 4px' }}>${subtotal.toFixed(2)}</Text>
          </Column>
        </Row>
        <Row>
          <Column style={{ width: '70%' }}>
            <Text style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px' }}>Shipping</Text>
          </Column>
          <Column style={{ width: '30%', textAlign: 'right' }}>
            <Text style={{ fontSize: '14px', color: '#334155', margin: '0 0 4px' }}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column style={{ width: '70%' }}>
            <Text style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px' }}>Tax</Text>
          </Column>
          <Column style={{ width: '30%', textAlign: 'right' }}>
            <Text style={{ fontSize: '14px', color: '#334155', margin: '0 0 4px' }}>${tax.toFixed(2)}</Text>
          </Column>
        </Row>
        <Hr style={{ borderColor: '#e2e8f0', margin: '8px 0' }} />
        <Row>
          <Column style={{ width: '70%' }}>
            <Text style={{ fontSize: '18px', color: '#0d9488', margin: '0', fontWeight: 'bold' }}>Total</Text>
          </Column>
          <Column style={{ width: '30%', textAlign: 'right' }}>
            <Text style={{ fontSize: '18px', color: '#0d9488', margin: '0', fontWeight: 'bold' }}>
              ${total.toFixed(2)}
            </Text>
          </Column>
        </Row>

        {conservationAmount > 0 && (
          <Section
            style={{
              backgroundColor: '#f0fdfa',
              borderRadius: '8px',
              padding: '12px 16px',
              marginTop: '16px',
              border: '1px solid #99f6e4',
            }}
          >
            <Text style={{ fontSize: '14px', color: '#0d9488', margin: '0', fontWeight: '500' }}>
              Conservation donation from this order: ${conservationAmount.toFixed(2)}
            </Text>
          </Section>
        )}

        <Text
          style={{
            fontSize: '13px',
            color: '#94a3b8',
            textAlign: 'center',
            marginTop: '24px',
          }}
        >
          Time to start making this order! Go to your admin dashboard to manage it.
        </Text>
      </Section>
    </OceanEmailLayout>
  );
}
