import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Img,
} from '@react-email/components';

interface UpsellProduct {
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
}

interface ShippingNotificationEmailProps {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  shippingAddress: string;
  upsellProducts?: UpsellProduct[];
}

export const ShippingNotificationEmail = ({
  customerName,
  orderNumber,
  trackingNumber,
  carrier,
  estimatedDelivery,
  items,
  shippingAddress,
  upsellProducts = [],
}: ShippingNotificationEmailProps) => {
  const trackingUrl = getTrackingUrl(carrier, trackingNumber);

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://shennastudio.com/images/shenna-studio-logo.png"
              width="150"
              height="150"
              alt="Shenna's Studio"
              style={logo}
            />
            <Heading style={h1}>Your Order Has Shipped! 📦</Heading>
          </Section>

          {/* Greeting */}
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Great news! Your order <strong>#{orderNumber}</strong> has been shipped and is on its way to you.
          </Text>

          {/* Tracking Info */}
          <Section style={trackingSection}>
            <Heading style={h2}>Tracking Information</Heading>
            <div style={trackingBox}>
              <Text style={trackingLabel}>Carrier:</Text>
              <Text style={trackingValue}>{carrier}</Text>
              <Text style={trackingLabel}>Tracking Number:</Text>
              <Text style={trackingNumberStyle}>{trackingNumber}</Text>
              {estimatedDelivery && (
                <>
                  <Text style={trackingLabel}>Estimated Delivery:</Text>
                  <Text style={trackingValue}>{estimatedDelivery}</Text>
                </>
              )}
            </div>
            {trackingUrl && (
              <div style={buttonContainer}>
                <Link href={trackingUrl} style={button}>
                  Track Your Package
                </Link>
              </div>
            )}
          </Section>

          <Hr style={hr} />

          {/* Items Shipped */}
          <Section>
            <Heading style={h2}>Items Shipped</Heading>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                • {item.name} (Qty: {item.quantity})
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Shipping Address */}
          <Section>
            <Heading style={h2}>Shipping To</Heading>
            <Text style={addressText}>{shippingAddress}</Text>
          </Section>

          <Hr style={hr} />

          {/* Additional Info */}
          <Section style={infoSection}>
            <Text style={infoText}>
              💡 <strong>Tip:</strong> Make sure someone is available to receive your package. If you&apos;re not
              home, the carrier may leave a notice with instructions for pickup or redelivery.
            </Text>
          </Section>

          {/* Upsell Products */}
          {upsellProducts.length > 0 && (
            <>
              <Hr style={hr} />
              <Section style={upsellSection}>
                <Heading style={h2}>You Might Also Love 🌊</Heading>
                <Text style={upsellText}>
                  While you wait for your order, check out these ocean-inspired treasures:
                </Text>
                <div style={productsGrid}>
                  {upsellProducts.map((product, index) => (
                    <Link
                      key={index}
                      href={`https://shennastudio.com/products/${product.slug}`}
                      style={productLink}
                    >
                      <div style={productCard}>
                        <Img
                          src={product.imageUrl}
                          width="120"
                          height="120"
                          alt={product.name}
                          style={productImage}
                        />
                        <Text style={productName}>{product.name}</Text>
                        <Text style={productPrice}>${product.price.toFixed(2)}</Text>
                      </div>
                    </Link>
                  ))}
                </div>
                <div style={buttonContainer}>
                  <Link href="https://shennastudio.com/products" style={shopButton}>
                    Shop All Products
                  </Link>
                </div>
              </Section>
            </>
          )}

          {/* Conservation Message */}
          <Section style={conservationSection}>
            <Text style={conservationText}>
              🐢 <strong>Thank you for supporting ocean conservation!</strong> A portion of your purchase
              helps protect sea turtles and marine life in South Padre Island.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions about your shipment? Contact us at{' '}
              <Link href="mailto:support@shennastudio.com">support@shennastudio.com</Link>
            </Text>
            <Text style={footerText}>
              View your order: <Link href="https://shennastudio.com/account">My Account</Link>
            </Text>
            <Text style={copyright}>
              © {new Date().getFullYear()} Shenna&apos;s Studio. Protecting Our Oceans, One Bracelet at a Time.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

function getTrackingUrl(carrier: string, trackingNumber: string): string | null {
  const carriers: Record<string, string> = {
    USPS: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    UPS: `https://www.ups.com/track?tracknum=${trackingNumber}`,
    FedEx: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
    DHL: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
  };

  return carriers[carrier] || null;
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 20px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 12px',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '12px 20px',
};

const trackingSection = {
  margin: '20px',
};

const trackingBox: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const trackingLabel = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '8px 0 4px 0',
  fontWeight: '600',
};

const trackingValue = {
  fontSize: '16px',
  color: '#1f2937',
  margin: '0 0 12px 0',
};

const trackingNumberStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#2563eb',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0 0 0',
};

const button = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '16px',
  display: 'inline-block',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const itemText = {
  fontSize: '16px',
  color: '#4b5563',
  margin: '8px 20px',
};

const addressText = {
  fontSize: '16px',
  color: '#4b5563',
  margin: '12px 20px',
  whiteSpace: 'pre-line' as const,
};

const infoSection = {
  margin: '20px',
  padding: '16px',
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  borderLeft: '4px solid #2563eb',
};

const infoText = {
  fontSize: '14px',
  color: '#1e40af',
  margin: 0,
};

const footer = {
  margin: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '8px 0',
};

const copyright = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '16px 0 0 0',
};

// Upsell styles
const upsellSection = {
  margin: '20px',
  textAlign: 'center' as const,
};

const upsellText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '8px 0 24px 0',
};

const productsGrid: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  flexWrap: 'wrap' as const,
};

const productLink = {
  textDecoration: 'none',
  color: 'inherit',
};

const productCard: React.CSSProperties = {
  textAlign: 'center' as const,
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  width: '140px',
};

const productImage = {
  borderRadius: '8px',
  marginBottom: '8px',
};

const productName = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '8px 0 4px 0',
};

const productPrice = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#14b8a6',
  margin: '0',
};

const shopButton = {
  backgroundColor: '#14b8a6',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '14px',
  display: 'inline-block',
};

const conservationSection = {
  margin: '20px',
  padding: '16px',
  backgroundColor: '#ecfdf5',
  borderRadius: '8px',
  borderLeft: '4px solid #14b8a6',
};

const conservationText = {
  fontSize: '14px',
  color: '#047857',
  margin: 0,
};

export default ShippingNotificationEmail;
