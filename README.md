# ShennaStudio E-Commerce Platform

Ocean-themed handcrafted bracelet store supporting marine conservation, built with Next.js 15 and Payload CMS.

## 🌊 Features

- **Product Catalog**: Browse ocean-inspired handcrafted bracelets
- **Variant Support**: Multiple sizes, colors, and materials per product
- **Conservation Focus**: 10% of sales support marine conservation
- **Cart Management**: Client-side shopping cart with localStorage persistence
- **Payload CMS API**: Headless CMS for product management
- **PostgreSQL Database**: Production-ready data storage

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.9
- **React**: 19.0.1
- **CMS**: Payload CMS 3.69.0
- **Database**: PostgreSQL (via Docker)
- **ORM**: Drizzle ORM (Payload dependency)
- **Styling**: Tailwind CSS 4
- **TypeScript**: Strict mode enabled

## 📋 Prerequisites

- Node.js 18+
- Docker (for PostgreSQL database)
- npm or pnpm

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shennastudio/shennastudiowebsite.git
   cd shennastudiowebsite
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**

   Create `.env.local` with:
   ```env
   # Database
   DATABASE_URL=postgresql://affiliate:affiliate_dev_password@localhost:5432/bead_bracelet_store
   POSTGRES_URL=postgresql://affiliate:affiliate_dev_password@localhost:5432/bead_bracelet_store
   DB_USER=affiliate
   DB_PASSWORD=affiliate_dev_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bead_bracelet_store

   # Payload CMS
   PAYLOAD_SECRET=your-secret-key-change-in-production
   ```

4. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run payload:migrate
   ```

6. **Seed admin user**
   ```bash
   npm run payload:seed
   ```

   Default admin credentials:
   - Email: `admin@shennastudio.com`
   - Password: `admin123`

7. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the store!

## 📦 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Payload CMS
npm run payload:generate # Generate TypeScript types
npm run payload:migrate  # Run database migrations
npm run payload:seed     # Seed admin user
npm run payload:seed:demo # Create demo products
npm run payload:clear-demo # Clear demo data
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main collections:

- **Users**: Admin and customer accounts with role-based access
- **Products**: Product catalog with variants, pricing, and inventory
- **Categories**: Product categorization
- **Orders**: Order management with Stripe integration hooks
- **Media**: Image storage (currently local, Vercel Blob support removed)
- **InventoryTransactions**: Stock movement tracking
- **ConservationDonations**: Donation tracking per order

## 🔌 API Endpoints

Payload CMS provides a REST API at `/api/*`:

```bash
GET  /api/products          # List all products
GET  /api/products/:id      # Get single product
GET  /api/categories        # List categories
GET  /api/users             # List users
POST /api/users/login       # User authentication
```

### Example: Fetch Products

```javascript
const response = await fetch('/api/products?depth=2&limit=10');
const { docs } = await response.json();
```

## ⚠️ Known Issues

### Admin Panel (Payload UI)

The Payload CMS admin panel at `/admin` currently has a compatibility issue where the UI fails to load due to a `CodeEditor` context error. This is a known bug affecting Payload CMS versions 3.62.1+ when used with Next.js 15+.

**Error**: `TypeError: Cannot destructure property 'config' of 'ue(...)' as it is undefined.`

**Current Version**: Payload CMS 3.62.1 (tested versions: 3.0.0, 3.62.1, 3.69.0 - all affected)

**Workaround**: Use the Payload REST API directly for content management:

```bash
# Login and get auth token
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@shennastudio.com", "password": "admin123"}'

# Create a product via API
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Ocean Bracelet", "basePrice": 29.99, "sku": "OB-001", ...}'
```

**Status**: This is a known upstream issue in Payload CMS. The frontend, API, and all business logic work perfectly. Only the admin UI is affected. The application functions fully as a headless CMS.

## 🚢 Deployment

### Railway.com (Recommended)

This application is configured for deployment on Railway.com with PostgreSQL database and automated Prisma migrations.

#### Quick Deploy

1. **Connect to Railway**:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login to Railway
   railway login

   # Create a new project or link existing
   railway init
   ```

2. **Add PostgreSQL Database**:
   - Go to your Railway project dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL` environment variable

3. **Set Required Environment Variables**:

   In Railway dashboard or via CLI:
   ```bash
   # NextAuth Secret (generate with: openssl rand -base64 32)
   railway variables set NEXTAUTH_SECRET=your-secure-random-32-char-string

   # NextAuth URL (use your Railway deployment URL)
   railway variables set NEXTAUTH_URL=https://your-app.up.railway.app

   # Node Environment
   railway variables set NODE_ENV=production
   ```

   Optional variables (if using):
   ```bash
   railway variables set BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   railway variables set STRIPE_SECRET_KEY=sk_live_your_stripe_key
   railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   railway variables set NEXT_PUBLIC_URL=https://your-app.up.railway.app
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

   Or connect your GitHub repository in Railway dashboard for automatic deployments.

#### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | Auto-set by Railway |
| `NEXTAUTH_SECRET` | ✅ | Secret for NextAuth sessions | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Your deployment URL | `https://your-app.up.railway.app` |
| `NODE_ENV` | ✅ | Environment mode | `production` |
| `BLOB_READ_WRITE_TOKEN` | ❌ | Vercel Blob for images | Optional |
| `STRIPE_SECRET_KEY` | ❌ | Stripe payments | Optional |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ❌ | Stripe client key | Optional |
| `NEXT_PUBLIC_URL` | ❌ | Public app URL | Same as `NEXTAUTH_URL` |

#### Deployment Workflow

Railway deployment includes automatic:
1. **Prisma Client Generation**: `prisma generate`
2. **Database Migrations**: `prisma migrate deploy` (runs all pending migrations)
3. **Next.js Build**: `npm run build`

This is configured in:
- `railway.json` - Railway deployment config
- `package.json` - `railway:build` script

#### Post-Deployment Setup

After first deployment:

1. **Seed the Database** (creates admin user and sample data):
   ```bash
   railway run npm run db:seed
   ```

   This creates:
   - Admin user: `admin@shennastudio.com` / `admin123`
   - Sample categories
   - Sample products with variants
   - Conservation tracking setup

2. **Access Your Site**:
   - Frontend: `https://your-app.up.railway.app`
   - Admin Panel: `https://your-app.up.railway.app/admin`

3. **Monitor Deployments**:
   ```bash
   railway logs
   ```

#### Database Migrations on Railway

Migrations run automatically during deployment via `railway:build` script. To manually run migrations:

```bash
# Deploy pending migrations
railway run npx prisma migrate deploy

# View migration status
railway run npx prisma migrate status

# Generate Prisma Client
railway run npx prisma generate
```

#### Troubleshooting

**Build Failures**:
- Check `DATABASE_URL` is set correctly
- Verify all required environment variables are present
- Review build logs: `railway logs --deployment`

**Migration Errors**:
- Ensure database is accessible
- Check if migrations folder is committed to git
- Manually run: `railway run npx prisma migrate deploy`

**Connection Issues**:
- Railway's internal network should connect automatically
- If using external database, ensure firewall allows Railway IPs

### Alternative: Cloudflare Workers

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy using Cloudflare Pages:
   ```bash
   npx wrangler pages deploy .next
   ```

### Database Options

For non-Railway deployments, use a managed PostgreSQL service:
- **Neon** (Recommended for Serverless)
- **Supabase**
- **Vercel Postgres**
- **PlanetScale** (MySQL compatible)

Update environment variables with production database credentials.

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `PAYLOAD_SECRET` | Secret key for Payload CMS | ✅ |
| `DB_USER` | Database username | ✅ |
| `DB_PASSWORD` | Database password | ✅ |
| `DB_HOST` | Database host | ✅ |
| `DB_PORT` | Database port | ✅ |
| `DB_NAME` | Database name | ✅ |

## 🤝 Contributing

This is a private repository for ShennaStudio. For questions or issues, contact the development team.

## 📄 License

Private - All Rights Reserved

## 💙 Conservation Mission

10% of all sales go directly to marine conservation efforts in:
- Rio Grande Valley
- South Padre Island

Together, we're protecting ocean ecosystems one bracelet at a time! 🌊
