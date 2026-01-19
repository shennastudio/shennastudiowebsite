import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Generate a sample 4x6 shipping label as SVG (converted to data URL)
function generateSampleLabelSVG(data: {
  orderNumber: string;
  customerName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  carrier: string;
  service: string;
  trackingNumber: string;
}): string {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="288" height="432" viewBox="0 0 288 432">
  <!-- 4x6 inch label at 72 DPI = 288x432 pixels -->
  <rect width="288" height="432" fill="white" stroke="black" stroke-width="2"/>

  <!-- Header with carrier -->
  <rect x="0" y="0" width="288" height="50" fill="#1e3a5f"/>
  <text x="144" y="32" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">${data.carrier.toUpperCase()}</text>

  <!-- Service type -->
  <rect x="10" y="55" width="268" height="25" fill="#e0e7ef" stroke="#ccc"/>
  <text x="144" y="72" font-family="Arial, sans-serif" font-size="12" fill="#333" text-anchor="middle">${data.service}</text>

  <!-- Barcode placeholder -->
  <rect x="20" y="90" width="248" height="60" fill="#f5f5f5" stroke="#ccc"/>
  <text x="144" y="115" font-family="monospace" font-size="10" fill="#333" text-anchor="middle">||||||||||||||||||||||||||||||||</text>
  <text x="144" y="140" font-family="monospace" font-size="11" fill="#333" text-anchor="middle">${data.trackingNumber}</text>

  <!-- FROM section -->
  <text x="15" y="170" font-family="Arial, sans-serif" font-size="10" fill="#666">FROM:</text>
  <text x="15" y="185" font-family="Arial, sans-serif" font-size="11" fill="#333" font-weight="bold">Shenna Studio</text>
  <text x="15" y="198" font-family="Arial, sans-serif" font-size="10" fill="#333">123 Ocean Drive</text>
  <text x="15" y="211" font-family="Arial, sans-serif" font-size="10" fill="#333">South Padre Island, TX 78597</text>

  <!-- Divider -->
  <line x1="10" y1="225" x2="278" y2="225" stroke="#ccc" stroke-width="1"/>

  <!-- TO section -->
  <text x="15" y="245" font-family="Arial, sans-serif" font-size="10" fill="#666">SHIP TO:</text>
  <text x="15" y="265" font-family="Arial, sans-serif" font-size="14" fill="#333" font-weight="bold">${escapeXml(data.customerName)}</text>
  <text x="15" y="285" font-family="Arial, sans-serif" font-size="12" fill="#333">${escapeXml(data.address)}</text>
  <text x="15" y="305" font-family="Arial, sans-serif" font-size="12" fill="#333">${escapeXml(data.city)}, ${data.state} ${data.zip}</text>

  <!-- Large ZIP for sorting -->
  <rect x="10" y="320" width="268" height="50" fill="#f0f0f0" stroke="#333"/>
  <text x="144" y="355" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#333" text-anchor="middle">${data.zip}</text>

  <!-- Order reference -->
  <text x="15" y="390" font-family="Arial, sans-serif" font-size="9" fill="#666">Order: #${data.orderNumber}</text>

  <!-- Footer -->
  <text x="144" y="420" font-family="Arial, sans-serif" font-size="8" fill="#999" text-anchor="middle">Sample Label - For Testing Only</text>
</svg>`;

  return svg;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'svg';

  // Get parameters or use defaults
  const data = {
    orderNumber: searchParams.get('orderNumber') || 'TEST-001',
    customerName: searchParams.get('customerName') || 'John Doe',
    address: searchParams.get('address') || '456 Sample Street',
    city: searchParams.get('city') || 'Austin',
    state: searchParams.get('state') || 'TX',
    zip: searchParams.get('zip') || '78701',
    carrier: searchParams.get('carrier') || 'USPS',
    service: searchParams.get('service') || 'Priority Mail',
    trackingNumber: searchParams.get('trackingNumber') || '9400111899223456789012',
  };

  const svg = generateSampleLabelSVG(data);

  if (format === 'svg') {
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `inline; filename="shipping-label-${data.orderNumber}.svg"`,
      },
    });
  }

  // Return as data URL for embedding
  const base64 = Buffer.from(svg).toString('base64');
  return NextResponse.json({
    labelUrl: `data:image/svg+xml;base64,${base64}`,
    orderNumber: data.orderNumber,
    trackingNumber: data.trackingNumber,
  });
}
