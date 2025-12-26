# ShennaStudio Quick Start Guide

Get your ocean conservation bracelet store running in minutes with demo data!

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Vercel Blob Storage token (for product images)

## 1. Clone & Install

```bash
cd bead-bracelet-store
npm install
```

## 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:

```env
# PostgreSQL Database
DATABASE_URL=postgresql://user:password@localhost:5432/shennastudio

# Payload CMS Secret (generate with: openssl rand -base64 32)
PAYLOAD_SECRET=your-secure-random-secret-here

# Vercel Blob Storage (optional for demo)
BLOB_READ_WRITE_TOKEN=your-token-here

# Application URL
NEXT_PUBLIC_URL=http://localhost:3000
```

## 3. Setup Database

Run Payload migrations:

```bash
npm run payload:migrate
```

Create admin user:

```bash
npm run payload:seed
```

**Default admin credentials:**
- Email: `admin@shennastudio.com`
- Password: `password`

⚠️ **Change this password immediately in production!**

## 4. Add Demo Products

Populate your store with 6 beautiful ocean-themed bracelets:

```bash
npm run payload:seed:demo
```

This creates:
- 6 products with variants
- Realistic pricing and stock
- Working Unsplash images
- Conservation donation info

## 5. Start Development Server

```bash
npm run dev
```

Your store is now running at:
- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

## 6. Explore Your Store

### Frontend (Customer View)

Visit http://localhost:3000 to see:
- Homepage with featured products
- Product catalog with filtering
- Product detail pages with variants
- Shopping cart functionality
- Conservation information

### Admin Panel (Staff View)

Visit http://localhost:3000/admin and login:
- Manage products, variants, and inventory
- Create and edit categories
- View orders
- Track conservation donations
- Manage demo data at `/admin/demo-mode`

## Demo Mode Management

### Using Admin UI

1. Go to http://localhost:3000/admin/demo-mode
2. Click "Create Demo Products" to seed (if not already done)
3. Click "Clear All Demo Data" when ready for production

### Using CLI

```bash
# Add demo products
npm run payload:seed:demo

# Remove all demo data
npm run payload:clear-demo
```

## What's Included in Demo Data?

✅ **6 Ocean-Themed Bracelets:**
1. Sea Turtle Guardian (Featured)
2. Whale Song (Featured)
3. Coral Reef Protector (Featured)
4. Shark Guardian
5. Dolphin Dreams
6. Starfish Sunrise

✅ **Each product includes:**
- Multiple size/color variants
- Realistic pricing ($22.99 - $31.99)
- Stock levels (12-30 units)
- High-quality images
- Conservation info (10% donation)

## Next Steps

### Continue Development

- ✅ Customize product categories
- ✅ Test shopping cart and checkout
- ✅ Configure Stripe for payments
- ✅ Add more products via admin panel

### Prepare for Production

1. Clear demo data: `npm run payload:clear-demo`
2. Add real products with your own photos
3. Update admin password
4. Configure production environment variables
5. Deploy to Coolify VPS (see DEPLOYMENT.md)

## Common Tasks

### Generate TypeScript Types (after schema changes)

```bash
npm run payload:generate
```

### Run Migrations (after Payload updates)

```bash
npm run payload:migrate
```

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## Troubleshooting

### Images Not Loading?

Make sure Unsplash is allowed in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ],
}
```

### Database Connection Error?

1. Check PostgreSQL is running
2. Verify DATABASE_URL in `.env.local`
3. Ensure database exists: `createdb shennastudio`

### Admin Panel Won't Load?

1. Check migrations ran: `npm run payload:migrate`
2. Verify admin user exists: `npm run payload:seed`
3. Check browser console for errors

## Project Structure

```
bead-bracelet-store/
├── src/
│   ├── app/              # Next.js app routes
│   │   ├── (payload)/    # Admin panel routes
│   │   ├── products/     # Product pages
│   │   ├── cart/         # Shopping cart
│   │   └── api/          # API routes
│   ├── collections/      # Payload CMS collections
│   ├── components/       # React components
│   ├── context/          # React context (CartContext)
│   └── lib/              # Utilities & API clients
├── scripts/              # Seed & utility scripts
├── payload-config.ts     # Payload CMS configuration
└── next.config.ts        # Next.js configuration
```

## Resources

- **Demo Mode Guide:** See DEMO_MODE.md
- **Deployment Guide:** See DEPLOYMENT.md
- **Project Info:** See CLAUDE.md
- **Payload CMS Docs:** https://payloadcms.com/docs
- **Next.js Docs:** https://nextjs.org/docs

## Support

Having issues? Check:
1. This guide (QUICKSTART.md)
2. Demo mode guide (DEMO_MODE.md)
3. Deployment guide (DEPLOYMENT.md)
4. Browser console for errors
5. Server logs in terminal

---

**Enjoy building your ocean conservation store! 🌊🐢🦈**
