import { render } from '@react-email/components';
import nodemailer from 'nodemailer';

// Create a transporter based on environment
function createTransporter() {
  // In production, use a real email service (SendGrid, Postmark, etc.)
  // For now, we'll use a console logger for development
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Development: Log emails to console
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  template: React.ReactElement;
}

export async function sendEmail({ to, subject, template }: SendEmailOptions) {
  try {
    const transporter = createTransporter();

    // Render the React email component to HTML
    const html = render(template);

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ShennaStudio <noreply@shennastudio.com>',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    // In development, log the email
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email sent (development mode):');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Message ID:', info.messageId);
      console.log('---');
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(order: any) {
  const { OrderConfirmationEmail } = await import('./templates/order-confirmation');

  const items = order.items.map((item: any) => ({
    name: item.variant.product.name,
    quantity: item.quantity,
    price: item.price,
    variant: [item.variant.size, item.variant.color, item.variant.material]
      .filter(Boolean)
      .join(', '),
  }));

  const shippingAddress = [
    order.shippingAddress,
    `${order.shippingCity}, ${order.shippingState} ${order.shippingZip}`,
    order.shippingCountry,
  ].join('\n');

  return sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmation - ${order.orderNumber}`,
    template: OrderConfirmationEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      items,
      subtotal: order.subtotal,
      shipping: order.shippingCost,
      tax: order.tax,
      total: order.total,
      conservationDonation: order.conservationDonation
        ? {
            amount: order.conservationDonation.amount,
            percentage: order.conservationDonation.percentage,
          }
        : undefined,
      shippingAddress,
    }),
  });
}

export async function sendShippingNotificationEmail(order: any) {
  const { ShippingNotificationEmail } = await import('./templates/shipping-notification');

  const items = order.items.map((item: any) => ({
    name: item.variant.product.name,
    quantity: item.quantity,
  }));

  const shippingAddress = [
    order.shippingAddress,
    `${order.shippingCity}, ${order.shippingState} ${order.shippingZip}`,
    order.shippingCountry,
  ].join('\n');

  return sendEmail({
    to: order.customerEmail,
    subject: `Your Order Has Shipped - ${order.orderNumber}`,
    template: ShippingNotificationEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber || '',
      carrier: order.carrier || 'USPS',
      items,
      shippingAddress,
    }),
  });
}
