/**
 * Sample Shipping Labels Seed Script
 * 
 * Usage:
 *   Local:   npx tsx prisma/seed-shipping-labels.ts
 *   Coolify: npx tsx -T prisma/seed-shipping-labels.ts
 * 
 * This script creates sample shipping labels for testing the shipping label printing functionality.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.POSTGRES_URL
    }
  }
});

// Sample orders to create shipping labels for
const SAMPLE_ORDERS = [
  {
    orderNumber: 'TEST-SHIP-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    shippingAddress: '123 Ocean View Drive',
    shippingCity: 'San Diego',
    shippingState: 'CA',
    shippingZip: '92101',
    shippingCountry: 'US',
    items: [
      { name: 'Ocean Wave T-Shirt - Navy / M', sku: 'TSHIRT-NV-M-ABC123' },
      { name: 'Sea Turtle Bracelet - Medium', sku: 'BRACELET-ST-M-DEF456' },
    ],
  },
  {
    orderNumber: 'TEST-SHIP-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    shippingAddress: '456 Beach Boulevard',
    shippingCity: 'Miami',
    shippingState: 'FL',
    shippingZip: '33101',
    shippingCountry: 'US',
    items: [
      { name: 'Coral Reef T-Shirt - White / L', sku: 'TSHIRT-WH-L-GHI789' },
      { name: 'Dolphin Charm Bracelet - Small', sku: 'BRACELET-DF-S-JKL012' },
    ],
  },
  {
    orderNumber: 'TEST-SHIP-003',
    customerName: 'Michael Chen',
    customerEmail: 'mchen@example.com',
    shippingAddress: '789 Coastal Highway',
    shippingCity: 'Seattle',
    shippingState: 'WA',
    shippingZip: '98101',
    shippingCountry: 'US',
    items: [
      { name: 'Whale Tail T-Shirt - Black / XL', sku: 'TSHIRT-BK-XL-MNO345' },
      { name: 'Wave Pattern Bracelet - Large', sku: 'BRACELET-WV-L-PQR678' },
    ],
  },
  {
    orderNumber: 'TEST-SHIP-004',
    customerName: 'Emily Davis',
    customerEmail: 'emily.d@example.com',
    shippingAddress: '321 Shoreline Lane',
    shippingCity: 'Portland',
    shippingState: 'OR',
    shippingZip: '97201',
    shippingCountry: 'US',
    items: [
      { name: 'Sea Glass T-Shirt - Seafoam / S', sku: 'TSHIRT-SF-S-STU901' },
      { name: 'Starfish Pendant Bracelet - Medium', sku: 'BRACELET-SF-M-VWX234' },
    ],
  },
  {
    orderNumber: 'TEST-SHIP-005',
    customerName: 'Robert Wilson',
    customerEmail: 'rwilson@example.com',
    shippingAddress: '555 Harbor View',
    shippingCity: 'Boston',
    shippingState: 'MA',
    shippingZip: '02101',
    shippingCountry: 'US',
    items: [
      { name: 'Sunset Beach T-Shirt - Coral / M', sku: 'TSHIRT-CR-M-YZA567' },
      { name: 'Anchor Symbol Bracelet - Large', sku: 'BRACELET-AN-L-BCD890' },
    ],
  },
];

// Generate a fake USPS tracking number
function generateUSPSTracking(): string {
  const prefix = '9400';
  const numbers = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
  return `${prefix}${numbers}`;
}

// Generate a fake FedEx tracking number
function generateFedExTracking(): string {
  const prefix = '7489';
  const numbers = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
  return `${prefix}${numbers}`;
}

async function main() {
  console.log('🚀 Creating sample shipping labels for testing...\n');

  let totalOrders = 0;

  for (const orderData of SAMPLE_ORDERS) {
    try {
      // Check if order already exists
      const existingOrder = await prisma.order.findFirst({
        where: { orderNumber: orderData.orderNumber }
      });

      if (existingOrder) {
        console.log(`⏭️  Order ${orderData.orderNumber} already exists, creating shipping label only...`);
        
        // Create shipping label for existing order
        const existingLabel = await prisma.shippingLabel.findFirst({
          where: { orderId: existingOrder.id }
        });

        if (existingLabel) {
          console.log(`   ✅ Shipping label already exists for order ${orderData.orderNumber}`);
          continue;
        }

        const carrier = Math.random() > 0.5 ? 'USPS' : 'FedEx';
        const trackingNumber = carrier === 'USPS' 
          ? generateUSPSTracking() 
          : generateFedExTracking();

        await prisma.shippingLabel.create({
          data: {
            orderId: existingOrder.id,
            carrier,
            service: carrier === 'USPS' ? 'Priority Mail' : 'Ground',
            trackingNumber,
            labelUrl: `https://example.com/labels/${orderData.orderNumber}.pdf`,
            cost: carrier === 'USPS' ? 8.95 : 9.50,
            status: 'created',
            weight: 0.5,
            length: 12,
            width: 9,
            height: 2,
          }
        });
        
        console.log(`   ✅ Created ${carrier} label: ${trackingNumber}`);
        continue;
      }

      // Create new order with items
      const order = await prisma.order.create({
        data: {
          orderNumber: orderData.orderNumber,
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          shippingAddress: orderData.shippingAddress,
          shippingCity: orderData.shippingCity,
          shippingState: orderData.shippingState,
          shippingZip: orderData.shippingZip,
          shippingCountry: orderData.shippingCountry,
          subtotal: orderData.items.length * 29.99,
          shipping: 5.95,
          tax: orderData.items.length * 2.47,
          total: orderData.items.length * 38.41,
          status: 'PROCESSING',
        }
      });

      // Create order items
      for (const item of orderData.items) {
        // Create a variant first
        const variant = await prisma.productVariant.create({
          data: {
            productId: 'temp-product-id',
            name: item.name,
            sku: item.sku,
            price: 29.99,
            stock: 100,
          }
        });

        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            variantId: variant.id,
            quantity: 1,
            price: 29.99,
          }
        });
      }

      console.log(`✅ Created order: ${orderData.orderNumber}`);

      // Create shipping label
      const carrier = Math.random() > 0.5 ? 'USPS' : 'FedEx';
      const trackingNumber = carrier === 'USPS' 
        ? generateUSPSTracking() 
        : generateFedExTracking();

      await prisma.shippingLabel.create({
        data: {
          orderId: order.id,
          carrier,
          service: carrier === 'USPS' ? 'Priority Mail' : 'Ground',
          trackingNumber,
          labelUrl: `https://example.com/labels/${orderData.orderNumber}.pdf`,
          cost: carrier === 'USPS' ? 8.95 : 9.50,
          status: 'created',
          weight: 0.5,
          length: 12,
          width: 9,
          height: 2,
        }
      });

      console.log(`   📦 Created ${carrier} shipping label: ${trackingNumber}`);
      totalOrders++;

    } catch (error) {
      console.error(`❌ Error creating order ${orderData.orderNumber}:`, error);
    }
  }

  const labelCount = SAMPLE_ORDERS.length;

  console.log('\n🎉 Sample shipping labels created successfully!');
  console.log(`   📦 Orders created: ${totalOrders}`);
  console.log(`   🏷️  Shipping labels created: ${labelCount}`);
  console.log('\n💡 These labels can be used to test the shipping label printing functionality.');
  console.log('   The labels are for TEST purposes only and use fake tracking numbers.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
