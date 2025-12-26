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

The Payload CMS admin panel at `/admin` currently has a compatibility issue with Payload 3.69.0 where the UI fails to load with a CodeEditor context error. This is a known bug in Payload 3.x.

**Workaround**: Use the API directly for content management:

```bash
# Create a product via API
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Ocean Bracelet", "basePrice": 29.99, "sku": "OB-001", ...}'
```

**Status**: The Payload team is actively working on fixes in version 3.70.0. For now, the application works perfectly as a headless CMS.

## 🚢 Deployment

### Cloudflare Workers (Recommended)

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy using Cloudflare Pages:
   ```bash
   npx wrangler pages deploy .next
   ```

### Database

Use a managed PostgreSQL service:
- **Vercel Postgres**
- **Supabase**
- **Neon**
- **Railway**

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
