import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'all'; // today, week, month, year, all

    const now = new Date();
    let startDate: Date | undefined;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = undefined;
    }

    // Fetch all conservation donations
    const donations = await prisma.conservationDonation.findMany({
      where: startDate
        ? {
            createdAt: {
              gte: startDate,
            },
          }
        : {},
      include: {
        order: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          },
        },
        partner: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate totals
    const totalPledged = donations
      .filter((d) => d.status === 'PLEDGED')
      .reduce((sum, d) => sum + d.amount, 0);

    const totalDonated = donations
      .filter((d) => d.status === 'DONATED')
      .reduce((sum, d) => sum + d.amount, 0);

    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

    // Group by region
    const donationsByRegion = donations.reduce((acc: Record<string, { pledged: number; donated: number; total: number; count: number }>, donation) => {
      const region = donation.region || 'Other';
      if (!acc[region]) {
        acc[region] = { pledged: 0, donated: 0, total: 0, count: 0 };
      }
      acc[region].total += donation.amount;
      acc[region].count += 1;
      if (donation.status === 'PLEDGED') {
        acc[region].pledged += donation.amount;
      } else {
        acc[region].donated += donation.amount;
      }
      return acc;
    }, {});

    // Group by partner
    const donationsByPartner = donations.reduce((acc: Record<string, { name: string; logo: string | null; website: string | null; pledged: number; donated: number; total: number; count: number }>, donation) => {
      if (!donation.partner) return acc;

      const partnerId = donation.partner.id;
      const partnerName = donation.partner.name;

      if (!acc[partnerId]) {
        acc[partnerId] = {
          name: partnerName,
          logo: donation.partner.logo,
          website: donation.partner.website,
          pledged: 0,
          donated: 0,
          total: 0,
          count: 0,
        };
      }

      acc[partnerId].total += donation.amount;
      acc[partnerId].count += 1;

      if (donation.status === 'PLEDGED') {
        acc[partnerId].pledged += donation.amount;
      } else {
        acc[partnerId].donated += donation.amount;
      }

      return acc;
    }, {});

    // Calculate impact trends (last 30 days)
    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayDonations = await prisma.conservationDonation.findMany({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      const dayTotal = dayDonations.reduce((sum, d) => sum + d.amount, 0);

      trendData.push({
        date: date.toISOString().split('T')[0],
        amount: dayTotal,
        count: dayDonations.length,
      });
    }

    // Get all partners
    const partners = await prisma.conservationPartner.findMany({
      include: {
        donations: {
          select: {
            amount: true,
            status: true,
          },
        },
      },
    });

    const partnersWithStats = partners.map((partner) => ({
      ...partner,
      totalDonations: partner.donations.reduce((sum, d) => sum + d.amount, 0),
      donationCount: partner.donations.length,
    }));

    return NextResponse.json({
      period,
      summary: {
        totalPledged,
        totalDonated,
        totalDonations,
        totalOrders: donations.length,
        averageDonation: donations.length > 0 ? totalDonations / donations.length : 0,
      },
      donationsByRegion,
      donationsByPartner,
      trendData,
      partners: partnersWithStats,
      recentDonations: donations.slice(0, 10),
    });
  } catch (error) {
    console.error('Conservation impact error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conservation impact data' },
      { status: 500 }
    );
  }
}
