# Demo Mode Guide

This guide explains how to use demo products for testing and preview your store before adding real inventory.

## Quick Start

### Create Demo Products

```bash
npm run payload:seed:demo
```

This creates:
- 6 ocean-themed bracelet products
- Multiple variants per product (sizes, colors, materials)
- Realistic pricing ($22.99 - $31.99)
- Stock levels (12-30 units per variant)
- Conservation donation information
- Working images from Unsplash

### Clear Demo Data (Production Mode)

```bash
npm run payload:clear-demo
```

This removes:
- All demo products
- Demo category
- Prepares store for production

## Using the Admin Panel

### Via Admin UI

1. Navigate to `/admin/demo-mode` in your browser
2. Click "🎨 Create Demo Products" to seed demo data
3. Click "🗑️ Clear All Demo Data" when ready for production

### Features

The admin panel provides:
- Visual feedback during seeding/clearing
- Success/error messages
- Confirmation dialogs (prevents accidents)
- Product count summaries

## Demo Products

### Included Products

1. **Sea Turtle Guardian Bracelet** ⭐ Featured
   - 3 variants (Small/Medium/Large)
   - Turquoise and ocean blue colors
   - Glass beads
   - $24.99 - $28.99

2. **Whale Song Bracelet** ⭐ Featured
   - 2 variants (Small/Medium)
   - Blue and white colors
   - Natural stone
   - $29.99 - $31.99

3. **Coral Reef Protector** ⭐ Featured
   - 3 variants (Small/Medium/Large)
   - Coral pink and multicolor
   - Acrylic beads
   - $22.99 - $26.99

4. **Shark Guardian Bracelet**
   - 2 variants (Medium/Large)
   - Steel grey and black
   - Hematite beads
   - $27.99 - $29.99

5. **Dolphin Dreams Bracelet**
   - 2 variants (Small/Medium)
   - Aquamarine and aqua/silver
   - Crystal beads
   - $25.99 - $27.99

6. **Starfish Sunrise Bracelet**
   - 3 variants (Small/Medium/Large)
   - Gold, amber, and cream
   - Wood beads
   - $23.99 - $27.99

### Product Features

Each demo product includes:
- ✅ Conservation donation percentage (10%)
- ✅ Conservation focus area
- ✅ Multiple size options
- ✅ Color variations
- ✅ Material specifications
- ✅ Unique SKUs (DEMO-* prefix)
- ✅ High-quality Unsplash images
- ✅ Realistic stock levels

## Demo Category

Products are organized under:
- **Name:** Demo Collection
- **Slug:** demo-collection
- **Description:** Sample products for demonstration purposes

This makes it easy to:
- Filter demo products
- Display them on the homepage
- Remove them all at once

## Images

Demo products use Unsplash images:
- Direct URLs (no upload required)
- High quality bracelet/jewelry photos
- Ocean-themed color palettes
- Optimized for web (800px width)

**Note:** Unsplash images are for preview only. Replace with your own product photos for production.

## Workflow Recommendations

### Development Phase

1. ✅ Seed demo products
2. ✅ Test frontend display (homepage, products page, product details)
3. ✅ Test shopping cart functionality
4. ✅ Test checkout flow
5. ✅ Verify admin panel features
6. ✅ Test inventory management

### Pre-Production

1. ✅ Take screenshots for marketing
2. ✅ Test all features with demo data
3. ✅ Train staff using demo products
4. ✅ Verify all integrations work

### Production Launch

1. ⚠️ **Backup your database** (just in case)
2. ⚠️ Clear demo data: `npm run payload:clear-demo`
3. ✅ Add your real products
4. ✅ Upload real product photos
5. ✅ Set accurate pricing and inventory
6. ✅ Launch! 🚀

## API Endpoints

### Seed Demo Products
```
POST /api/admin/seed-demo
```

**Response:**
```json
{
  "success": true,
  "message": "Created 6 demo products. Skipped 0 existing.",
  "created": 6,
  "skipped": 0
}
```

### Clear Demo Data
```
POST /api/admin/clear-demo
```

**Response:**
```json
{
  "success": true,
  "message": "Cleared 6 demo products and demo category.",
  "deleted": 6
}
```

## Troubleshooting

### Images Not Loading

**Problem:** Unsplash images not displaying

**Solutions:**
1. Check `next.config.ts` includes `images.unsplash.com` in `remotePatterns`
2. Verify internet connection (Unsplash requires external access)
3. Check browser console for CORS errors

### Demo Products Already Exist

**Problem:** Seeding says "Skipped 6 existing"

**Solutions:**
- This is normal if you've already seeded
- Clear demo data first, then re-seed
- Or manually delete products in admin panel

### Cannot Clear Demo Data

**Problem:** Clear operation fails

**Solutions:**
1. Check database connection
2. Verify no orders reference demo products
3. Try clearing products individually in admin panel

## Best Practices

### DO ✅
- Use demo mode during development and testing
- Clear demo data before production launch
- Take screenshots with demo products for training
- Test all features with demo data first

### DON'T ❌
- Use demo products in production
- Delete demo category manually (use clear script)
- Mix demo and real products
- Rely on Unsplash images for production

## Support

For issues or questions:
1. Check this documentation
2. Review `scripts/seed-demo-products.ts`
3. Check browser console for errors
4. Verify database connection

## Next Steps

After clearing demo data:
1. Add your first real product in `/admin`
2. Upload product photos to Vercel Blob Storage
3. Set up product categories
4. Configure inventory tracking
5. Test with real orders

---

**Happy testing! 🌊🐢🦈**
