/**
 * Payload CMS API Client
 *
 * Type-safe data access layer for Payload CMS collections.
 * Supports both Server Components and Client Components.
 * Uses Payload's auto-generated types for full type safety.
 */

import type {
  Product,
  Category,
  Order,
  Media,
  User
} from '@/../../payload-types'

// API Response Types
export interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface SingleDocResponse<T> {
  doc: T
}

export interface PayloadError {
  errors: Array<{
    message: string
    name?: string
    data?: unknown
  }>
}

export interface QueryOptions {
  depth?: number
  limit?: number
  page?: number
  sort?: string
  where?: Record<string, unknown>
}

// Helper function to build query string
function buildQueryString(options: QueryOptions = {}): string {
  const params = new URLSearchParams()

  if (options.depth !== undefined) params.append('depth', options.depth.toString())
  if (options.limit !== undefined) params.append('limit', options.limit.toString())
  if (options.page !== undefined) params.append('page', options.page.toString())
  if (options.sort) params.append('sort', options.sort)
  if (options.where) params.append('where', JSON.stringify(options.where))

  return params.toString()
}

// Base URL for API calls
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return ''
  }
  // Server-side
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

// Generic fetch wrapper with error handling
async function fetchFromPayload<T>(
  endpoint: string,
  options: RequestInit & { isServer?: boolean } = {}
): Promise<T> {
  const { isServer, ...fetchOptions } = options
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api${endpoint}`

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      // Use cache for server components, no-store for dynamic data
      cache: isServer ? 'force-cache' : 'no-store',
    })

    if (!response.ok) {
      const errorData: PayloadError = await response.json()
      throw new Error(
        errorData.errors?.[0]?.message || `API error: ${response.status}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error(`Payload API Error (${endpoint}):`, error)
    throw error
  }
}

// ===================================
// PRODUCTS
// ===================================

/**
 * Get all products with optional filtering and pagination
 */
export async function getProducts(
  options: QueryOptions & {
    featured?: boolean
    status?: 'draft' | 'active' | 'archived'
    category?: number
    inStock?: boolean
  } = {}
): Promise<PayloadResponse<Product>> {
  const where: Record<string, unknown> = {}

  if (options.featured !== undefined) {
    where.featured = { equals: options.featured }
  }

  if (options.status) {
    where.status = { equals: options.status }
  }

  if (options.category) {
    where.category = { equals: options.category }
  }

  if (options.inStock !== undefined) {
    where.inStock = { equals: options.inStock }
  }

  const queryOptions: QueryOptions = {
    ...options,
    where: Object.keys(where).length > 0 ? where : options.where,
    depth: options.depth ?? 2, // Include category and images by default
  }

  const queryString = buildQueryString(queryOptions)
  return fetchFromPayload<PayloadResponse<Product>>(
    `/products?${queryString}`,
    { isServer: true }
  )
}

/**
 * Get a single product by ID
 */
export async function getProduct(
  id: number,
  depth = 2
): Promise<Product> {
  const response = await fetchFromPayload<Product>(
    `/products/${id}?depth=${depth}`,
    { isServer: true }
  )
  return response
}

/**
 * Get a single product by SKU
 */
export async function getProductBySku(
  sku: string,
  depth = 2
): Promise<Product | null> {
  const response = await fetchFromPayload<PayloadResponse<Product>>(
    `/products?where[sku][equals]=${encodeURIComponent(sku)}&depth=${depth}`,
    { isServer: true }
  )
  return response.docs[0] || null
}

/**
 * Search products by name or description
 */
export async function searchProducts(
  query: string,
  options: QueryOptions = {}
): Promise<PayloadResponse<Product>> {
  const where = {
    or: [
      { name: { contains: query } },
      { description: { contains: query } },
    ],
  }

  const queryOptions: QueryOptions = {
    ...options,
    where,
    depth: options.depth ?? 2,
  }

  const queryString = buildQueryString(queryOptions)
  return fetchFromPayload<PayloadResponse<Product>>(
    `/products?${queryString}`,
    { isServer: true }
  )
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(
  limit = 8
): Promise<Product[]> {
  const response = await getProducts({
    featured: true,
    status: 'active',
    limit,
  })
  return response.docs
}

// ===================================
// CATEGORIES
// ===================================

/**
 * Get all categories
 */
export async function getCategories(
  options: QueryOptions = {}
): Promise<PayloadResponse<Category>> {
  const queryOptions: QueryOptions = {
    ...options,
    depth: options.depth ?? 1,
  }

  const queryString = buildQueryString(queryOptions)
  return fetchFromPayload<PayloadResponse<Category>>(
    `/categories?${queryString}`,
    { isServer: true }
  )
}

/**
 * Get a single category by ID
 */
export async function getCategory(
  id: number,
  depth = 1
): Promise<Category> {
  return fetchFromPayload<Category>(
    `/categories/${id}?depth=${depth}`,
    { isServer: true }
  )
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(
  slug: string,
  depth = 1
): Promise<Category | null> {
  const response = await fetchFromPayload<PayloadResponse<Category>>(
    `/categories?where[slug][equals]=${encodeURIComponent(slug)}&depth=${depth}`,
    { isServer: true }
  )
  return response.docs[0] || null
}

/**
 * Get products in a category
 */
export async function getProductsByCategory(
  categoryId: number,
  options: QueryOptions = {}
): Promise<PayloadResponse<Product>> {
  return getProducts({
    ...options,
    category: categoryId,
    status: 'active',
  })
}

// ===================================
// ORDERS
// ===================================

/**
 * Get orders (requires authentication)
 * For customers: returns only their orders
 * For admin/staff: returns all orders
 */
export async function getOrders(
  options: QueryOptions & {
    status?: Order['status']
    paymentStatus?: Order['paymentStatus']
  } = {},
  token?: string
): Promise<PayloadResponse<Order>> {
  const where: Record<string, unknown> = {}

  if (options.status) {
    where.status = { equals: options.status }
  }

  if (options.paymentStatus) {
    where.paymentStatus = { equals: options.paymentStatus }
  }

  const queryOptions: QueryOptions = {
    ...options,
    where: Object.keys(where).length > 0 ? where : options.where,
    depth: options.depth ?? 2, // Include customer and items
  }

  const queryString = buildQueryString(queryOptions)
  const headers: HeadersInit = {}

  if (token) {
    headers.Authorization = `JWT ${token}`
  }

  return fetchFromPayload<PayloadResponse<Order>>(
    `/orders?${queryString}`,
    { headers }
  )
}

/**
 * Get a single order by ID (requires authentication)
 */
export async function getOrder(
  id: number,
  token?: string,
  depth = 2
): Promise<Order> {
  const headers: HeadersInit = {}

  if (token) {
    headers.Authorization = `JWT ${token}`
  }

  return fetchFromPayload<Order>(
    `/orders/${id}?depth=${depth}`,
    { headers }
  )
}

/**
 * Get order by order number (requires authentication)
 */
export async function getOrderByNumber(
  orderNumber: string,
  token?: string,
  depth = 2
): Promise<Order | null> {
  const headers: HeadersInit = {}

  if (token) {
    headers.Authorization = `JWT ${token}`
  }

  const response = await fetchFromPayload<PayloadResponse<Order>>(
    `/orders?where[orderNumber][equals]=${encodeURIComponent(orderNumber)}&depth=${depth}`,
    { headers }
  )

  return response.docs[0] || null
}

// ===================================
// MEDIA
// ===================================

/**
 * Get media by ID
 */
export async function getMedia(
  id: number
): Promise<Media> {
  return fetchFromPayload<Media>(
    `/media/${id}`,
    { isServer: true }
  )
}

/**
 * Get all media
 */
export async function getAllMedia(
  options: QueryOptions = {}
): Promise<PayloadResponse<Media>> {
  const queryString = buildQueryString(options)
  return fetchFromPayload<PayloadResponse<Media>>(
    `/media?${queryString}`,
    { isServer: true }
  )
}

// ===================================
// USERS / AUTHENTICATION
// ===================================

/**
 * Login user
 */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const response = await fetchFromPayload<{ token: string; user: User }>(
    '/users/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  )

  return response
}

/**
 * Logout user
 */
export async function logout(token: string): Promise<void> {
  await fetchFromPayload(
    '/users/logout',
    {
      method: 'POST',
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  )
}

/**
 * Get current user (requires authentication)
 */
export async function getCurrentUser(token: string): Promise<User> {
  return fetchFromPayload<User>(
    '/users/me',
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  )
}

/**
 * Register a new user (customer)
 */
export async function register(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<{ token: string; user: User }> {
  const response = await fetchFromPayload<{ token: string; user: User }>(
    '/users',
    {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        roles: ['customer'],
      }),
    }
  )

  return response
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Get media URL from Media object
 */
export function getMediaUrl(media: Media | number | null | undefined): string | null {
  if (!media) return null

  if (typeof media === 'number') {
    // If it's just an ID, we can't get the URL without fetching
    return null
  }

  return media.url || null
}

/**
 * Get product image URL (first image)
 */
export function getProductImageUrl(product: Product): string | null {
  const firstImage = product.images?.[0]?.image
  if (!firstImage) return null

  return getMediaUrl(firstImage)
}

/**
 * Get variant image URL or fallback to product image
 */
export function getVariantImageUrl(
  product: Product,
  variantId?: string
): string | null {
  if (variantId && product.variants) {
    const variant = product.variants.find(v => v.id === variantId)
    if (variant?.images?.[0]?.image) {
      return getMediaUrl(variant.images[0].image)
    }
  }

  return getProductImageUrl(product)
}

/**
 * Calculate conservation donation amount
 */
export function calculateConservationDonation(product: Product, price: number): number {
  const percentage = product.conservationInfo?.donationPercentage ?? 10
  return (price * percentage) / 100
}

/**
 * Check if product has variants
 */
export function hasVariants(product: Product): boolean {
  return !!product.variants && product.variants.length > 0
}

/**
 * Get variant by SKU
 */
export function getVariantBySku(
  product: Product,
  sku: string
): Product['variants'][0] | null {
  if (!product.variants) return null
  return product.variants.find(v => v.sku === sku) || null
}

/**
 * Check if variant is in stock
 */
export function isVariantInStock(variant: Product['variants'][0]): boolean {
  return variant.stock > 0
}

/**
 * Get available sizes from product
 */
export function getAvailableSizes(product: Product): Array<'small' | 'medium' | 'large'> {
  const sizes = new Set<'small' | 'medium' | 'large'>()

  if (product.variants) {
    product.variants.forEach(variant => {
      if (variant.size && variant.stock > 0) {
        sizes.add(variant.size)
      }
    })
  }

  return Array.from(sizes)
}

/**
 * Get available colors from product
 */
export function getAvailableColors(product: Product): string[] {
  const colors = new Set<string>()

  if (product.variants) {
    product.variants.forEach(variant => {
      if (variant.color && variant.stock > 0) {
        colors.add(variant.color)
      }
    })
  }

  return Array.from(colors)
}

/**
 * Get available materials from product
 */
export function getAvailableMaterials(product: Product): string[] {
  const materials = new Set<string>()

  if (product.variants) {
    product.variants.forEach(variant => {
      if (variant.material && variant.stock > 0) {
        materials.add(variant.material)
      }
    })
  }

  return Array.from(materials)
}
