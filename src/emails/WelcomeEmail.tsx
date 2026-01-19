import {
  Text,
  Section,
  Heading,
  Button,
} from '@react-email/components';
import * as React from 'react';
import OceanEmailLayout from './components/OceanEmailLayout';

interface WelcomeEmailProps {
  customerName: string;
}

export default function WelcomeEmail({ customerName }: WelcomeEmailProps) {
  return (
    <OceanEmailLayout preview="Welcome to Shenna&apos;s Studio - Start your ocean conservation journey!">
      {/* Hero section */}
      <Section style={heroSection}>
        <div style={waveIcon}>🌊</div>
        <Heading style={h1}>Welcome to Shenna&apos;s Studio!</Heading>
        <Text style={heroText}>
          Hi {customerName}, thank you for joining our ocean conservation community!
        </Text>
      </Section>

      {/* Introduction */}
      <Section style={section}>
        <Text style={bodyText}>
          Every handcrafted bracelet you purchase helps protect marine life in South Padre Island
          and the Rio Grande Valley. We donate 10% of every sale to ocean conservation efforts,
          supporting sea turtles, whales, and coastal ecosystems.
        </Text>
      </Section>

      {/* What to expect */}
      <Section style={highlightSection}>
        <Heading style={h2}>What to Expect</Heading>
        <div style={benefitItem}>
          <Text style={benefitIcon}>🎨</Text>
          <div>
            <Text style={benefitTitle}>Handcrafted Ocean-Inspired Designs</Text>
            <Text style={benefitText}>
              Each bracelet is carefully handmade with ocean-themed beads and materials
            </Text>
          </div>
        </div>
        <div style={benefitItem}>
          <Text style={benefitIcon}>🌊</Text>
          <div>
            <Text style={benefitTitle}>Support Marine Conservation</Text>
            <Text style={benefitText}>
              10% of every purchase goes directly to protecting marine ecosystems
            </Text>
          </div>
        </div>
        <div style={benefitItem}>
          <Text style={benefitIcon}>🏆</Text>
          <div>
            <Text style={benefitTitle}>Earn Rewards Points</Text>
            <Text style={benefitText}>
              Earn 1 point per dollar spent and unlock exclusive benefits as you tier up
            </Text>
          </div>
        </div>
        <div style={benefitItem}>
          <Text style={benefitIcon}>🎁</Text>
          <div>
            <Text style={benefitTitle}>Free Shipping Over $50</Text>
            <Text style={benefitText}>
              Enjoy complimentary shipping on orders $50 and above
            </Text>
          </div>
        </div>
      </Section>

      {/* Rewards tiers */}
      <Section style={section}>
        <Heading style={h2}>🏅 Rewards Tiers</Heading>
        <Text style={bodyText}>
          As you shop, you&apos;ll automatically progress through our rewards tiers:
        </Text>
        <div style={tierList}>
          <Text style={tierItem}>
            <span style={tierBadge}>🥉</span> <strong>Bronze</strong> - 0-99 points
          </Text>
          <Text style={tierItem}>
            <span style={tierBadge}>🥈</span> <strong>Silver</strong> - 100-249 points
          </Text>
          <Text style={tierItem}>
            <span style={tierBadge}>🥇</span> <strong>Gold</strong> - 250-499 points
          </Text>
          <Text style={tierItem}>
            <span style={tierBadge}>💎</span> <strong>Platinum</strong> - 500+ points
          </Text>
        </div>
      </Section>

      {/* CTA */}
      <Section style={ctaSection}>
        <Heading style={h2}>Ready to Shop?</Heading>
        <Text style={bodyText}>
          Browse our collection of ocean-inspired bracelets and start making a difference today!
        </Text>
        <div style={buttonContainer}>
          <Button style={button} href="https://shennastudio.com/products">
            Shop Ocean Collection
          </Button>
        </div>
      </Section>

      {/* Thank you */}
      <Section style={section}>
        <Text style={thankYouText}>
          Thank you for being part of our mission to protect our oceans.
          Together, we&apos;re making waves of change! 🐢🌊
        </Text>
      </Section>
    </OceanEmailLayout>
  );
}

// Styles
const heroSection = {
  textAlign: 'center' as const,
  padding: '32px 0',
};

const waveIcon = {
  fontSize: '64px',
  lineHeight: '1',
  margin: '0 0 16px',
};

const h1 = {
  color: '#0f172a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 12px',
  lineHeight: '1.3',
};

const heroText = {
  color: '#475569',
  fontSize: '16px',
  margin: '0',
  lineHeight: '1.5',
};

const section = {
  marginBottom: '32px',
};

const h2 = {
  color: '#0f172a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const bodyText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '1.8',
  margin: '0 0 16px',
};

const highlightSection = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '32px',
};

const benefitItem = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '20px',
  gap: '16px',
};

const benefitIcon = {
  fontSize: '32px',
  lineHeight: '1',
  margin: '0',
  minWidth: '40px',
};

const benefitTitle = {
  color: '#0f172a',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 4px',
};

const benefitText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const tierList = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '12px',
};

const tierItem = {
  color: '#475569',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.6',
};

const tierBadge = {
  fontSize: '20px',
  marginRight: '8px',
};

const ctaSection = {
  backgroundColor: '#ecfeff',
  border: '2px solid #06b6d4',
  borderRadius: '8px',
  padding: '32px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const buttonContainer = {
  marginTop: '20px',
};

const button = {
  backgroundColor: '#0891b2',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  cursor: 'pointer',
};

const thankYouText = {
  color: '#0e7490',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center' as const,
  fontStyle: 'italic',
};
