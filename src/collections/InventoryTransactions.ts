import type { CollectionConfig } from 'payload'

export const InventoryTransactions: CollectionConfig = {
  slug: 'inventory-transactions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['transactionType', 'quantity', 'variant', 'timestamp'],
  },
  access: {
    // Admin and staff can create/update
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.roles?.includes('admin') || user.roles?.includes('staff')
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return user.roles?.includes('admin') || user.roles?.includes('staff')
    },
    // All authenticated users can read
    read: ({ req: { user } }) => {
      if (!user) return false
      return true
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.roles?.includes('admin')
    },
  },
  fields: [
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        description: 'Product variant associated with this transaction',
      },
    },
    {
      name: 'transactionType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Sale',
          value: 'sale',
        },
        {
          label: 'Restock',
          value: 'restock',
        },
        {
          label: 'Adjustment',
          value: 'adjustment',
        },
        {
          label: 'Reservation',
          value: 'reservation',
        },
      ],
      admin: {
        description: 'Type of inventory transaction',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      admin: {
        description: 'Number of items (positive for additions, negative for removals)',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'When the transaction occurred',
        date: {
          displayFormat: 'MMM dd yyyy, h:mm a',
        },
      },
    },
    {
      name: 'orderId',
      type: 'text',
      admin: {
        description: 'Associated order ID (for sales transactions)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about this transaction',
      },
    },
  ],
  timestamps: true,
}
