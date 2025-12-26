# 🌊 ShennaStudio - Ocean-Themed Bracelet E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Handcrafted Ocean-Themed Bracelets Supporting Marine Conservation**

[Live Demo](https://shennastudiowebsite-production.up.railway.app) • [Admin Panel](https://shennastudiowebsite-production.up.railway.app/admin) • [Report Bug](https://github.com/shennastudio/shennastudiowebsite/issues)

</div>

---

## 🎯 Overview

ShennaStudio is a production-ready e-commerce platform dedicated to selling handcrafted ocean-themed bracelets. Built with modern web technologies, it features a comprehensive admin panel for product management, order tracking, and site customization. **10% of all sales support marine conservation efforts** in the Rio Grande Valley and South Padre Island.

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse beautiful ocean-themed handcrafted bracelets
- **Product Variants** - Multiple sizes, colors, and materials per product
- **Shopping Cart** - Real-time cart with automatic tax and shipping calculation
- **Conservation Info** - See how your purchase supports marine life
- **Responsive Design** - Perfect experience on mobile, tablet, and desktop

### 🎨 Admin Panel
- **Dashboard** - Real-time statistics and insights
- **Product Management** - Full CRUD operations with drag-and-drop image uploads
- **Category Management** - Organize products into categories
- **Order Tracking** - View all orders with detailed customer information
- **Site Settings** - Update logo, branding, and contact information
- **Image Upload** - Drag-and-drop image uploads to Vercel Blob Storage
- **Account Settings** - Secure password change functionality

### 🔒 Security
- **NextAuth.js** - Secure authentication and session management
- **Role-Based Access** - Admin, staff, and customer roles
- **Protected API Routes** - All admin operations require authentication
- **Password Hashing** - Bcrypt encryption for user passwords

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5.9 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS |
| shadcn/ui | Latest | UI component library |

### **Backend & Database**
| Technology | Version | Purpose |
|------------|---------|---------|
| Prisma ORM | 5.22.0 | Database ORM and migrations |
| PostgreSQL | 15+ | Primary database |
| NextAuth.js | 4.24.13 | Authentication |

### **Storage & Deployment**
| Technology | Version | Purpose |
|------------|---------|---------|
| Vercel Blob | Latest | Image storage |
| Railway | Latest | Production hosting |
| Stripe | 20.1.0 | Payment processing |

---

## 🚀 Quick Start

### Prerequisites
```bash
node >= 20.0.0
npm >= 10.0.0
postgresql >= 15
```

### 1. Clone the Repository
```bash
git clone https://github.com/shennastudio/shennastudiowebsite.git
cd shennastudiowebsite
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shennastudio"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (admin user + sample products)
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

---

## 📁 Project Structure

```
shennastudio/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── src/
│   ├── app/
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── products/      # Product management
│   │   │   ├── categories/    # Category management
│   │   │   ├── orders/        # Order management
│   │   │   ├── settings/      # Site settings
│   │   │   └── account/       # Account settings
│   │   ├── api/
│   │   │   ├── admin/         # Admin API routes
│   │   │   └── auth/          # Authentication
│   │   ├── actions.ts         # Server actions
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   │   ├── ImageUpload.tsx
│   │   │   └── MultiImageUpload.tsx
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       ├── db.ts              # Prisma client
│       └── auth.ts            # NextAuth configuration
├── public/                    # Static assets
├── .env.local                 # Environment variables
└── next.config.ts             # Next.js configuration
```

---

## 🎨 Admin Panel

### Access Admin Panel
- **URL**: `http://localhost:3000/admin/login`
- **Default Credentials**:
  - Email: `admin@shennastudio.com`
  - Password: `admin123`

⚠️ **IMPORTANT**: Change the default password immediately after first login!

### Admin Features
- **Dashboard**: View sales statistics, order counts, and revenue
- **Products**: Add, edit, delete products with drag-and-drop images
- **Categories**: Organize products into categories
- **Orders**: Track customer orders and fulfillment status
- **Settings**: Update site logo, branding, and contact info
- **Account**: Change admin password and view account details

---

## 📦 Database Schema

### Key Models
- **User**: Admin, staff, and customer accounts
- **Product**: Product information with variants
- **ProductVariant**: Size, color, material variations
- **ProductImage**: Multiple images per product
- **Category**: Product categorization
- **Order**: Customer orders and fulfillment
- **OrderItem**: Individual items in orders
- **ConservationDonation**: Track conservation contributions
- **SiteSettings**: Logo, branding, contact information

---

## 🌐 Deployment

### Deploy to Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
railway link
```

4. **Set Environment Variables**
```bash
railway variables --set "DATABASE_URL=postgresql://..."
railway variables --set "NEXTAUTH_SECRET=your-secret"
railway variables --set "NEXTAUTH_URL=https://your-domain.up.railway.app"
railway variables --set "BLOB_READ_WRITE_TOKEN=vercel_blob_rw_..."
```

5. **Deploy**
```bash
railway up
```

6. **Run Migrations**
```bash
railway run npx prisma db push
railway run npm run db:seed
```

Your site is now live! 🎉

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### Code Quality
- **TypeScript**: Full type safety across the codebase
- **ESLint**: Code linting and formatting
- **Prisma**: Type-safe database queries
- **Git Hooks**: Pre-commit checks (coming soon)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m '🎨 Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

---

## 🐛 Support

Having issues? Please check:
- [GitHub Issues](https://github.com/shennastudio/shennastudiowebsite/issues)
- [Documentation](./docs)
- Email: admin@shennastudio.com

---

## 🌊 Conservation Mission

**10% of every sale supports marine conservation** in:
- 🐢 Sea Turtle Conservation - South Padre Island
- 🐋 Whale Protection Programs
- 🦈 Shark Research Initiatives
- 🌊 Ocean Ecosystem Restoration - Rio Grande Valley

---

<div align="center">

**Made with ❤️ for Ocean Conservation**

[Website](https://shennastudiowebsite-production.up.railway.app) • [Admin](https://shennastudiowebsite-production.up.railway.app/admin) • [GitHub](https://github.com/shennastudio/shennastudiowebsite)

</div>
