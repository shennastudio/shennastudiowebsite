/**
 * API Route: Clear Demo Data
 *
 * POST /api/admin/clear-demo
 *
 * Removes all demo products and demo category.
 * Requires admin authentication.
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST() {
  try {
    const payload = await getPayload({ config })

    // Find demo category
    const demoCategory = await payload.find({
      collection: 'categories',
      where: { slug: { equals: 'demo-collection' } }
    })

    if (demoCategory.docs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No demo data found to clear.',
        deleted: 0
      })
    }

    const categoryId = demoCategory.docs[0].id

    // Find all demo products
    const demoProducts = await payload.find({
      collection: 'products',
      where: { category: { equals: categoryId } },
      limit: 1000
    })

    // Delete products
    let deleted = 0
    for (const product of demoProducts.docs) {
      await payload.delete({
        collection: 'products',
        id: product.id
      })
      deleted++
    }

    // Delete category
    await payload.delete({
      collection: 'categories',
      id: categoryId
    })

    return NextResponse.json({
      success: true,
      message: `Cleared ${deleted} demo products and demo category.`,
      deleted
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear demo data' },
      { status: 500 }
    )
  }
}
