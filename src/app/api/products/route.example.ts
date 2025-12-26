/**
 * Example API Route Handler
 *
 * Demonstrates how to create custom API routes using the Payload client.
 * Rename this file to route.ts to activate.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProducts, searchProducts } from '@/lib/payload'

/**
 * GET /api/products
 *
 * Query parameters:
 * - search: string - Search term
 * - category: number - Filter by category ID
 * - featured: boolean - Filter featured products
 * - status: 'active' | 'draft' | 'archived' - Filter by status
 * - inStock: boolean - Filter in-stock products
 * - limit: number - Number of results per page (default: 20)
 * - page: number - Page number (default: 1)
 * - sort: string - Sort field (e.g., '-createdAt' for newest first)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')
    const inStock = searchParams.get('inStock')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')
    const sort = searchParams.get('sort')

    let result

    // If search term provided, use search
    if (search) {
      result = await searchProducts(search, {
        limit: limit ? parseInt(limit) : 20,
        page: page ? parseInt(page) : 1,
        sort: sort || '-createdAt',
      })
    } else {
      // Otherwise use filtered query
      result = await getProducts({
        category: category ? parseInt(category) : undefined,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
        status: status as 'active' | 'draft' | 'archived' | undefined,
        inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
        limit: limit ? parseInt(limit) : 20,
        page: page ? parseInt(page) : 1,
        sort: sort || '-createdAt',
      })
    }

    // Return successful response
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Example usage:
 *
 * // Get all active products
 * GET /api/products?status=active
 *
 * // Search for "ocean"
 * GET /api/products?search=ocean
 *
 * // Get featured products
 * GET /api/products?featured=true&limit=6
 *
 * // Get products in category 1
 * GET /api/products?category=1
 *
 * // Get in-stock products, page 2
 * GET /api/products?inStock=true&page=2&limit=10
 *
 * // Combine filters
 * GET /api/products?category=1&featured=true&inStock=true
 */
