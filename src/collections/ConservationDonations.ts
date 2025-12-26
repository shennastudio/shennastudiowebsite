import type { CollectionConfig } from 'payload'

export const ConservationDonations: CollectionConfig = {
  slug: 'conservation-donations',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['order', 'amount', 'organization', 'status', 'donationDate'],
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
    // Customers can read their own donations, admin/staff can read all
    read: ({ req: { user } }) => {
      if (!user) return false

      if (user.roles?.includes('admin') || user.roles?.includes('staff')) {
        return true
      }

      // Customers can only see their own donations
      if (user.roles?.includes('customer')) {
        return {
          'order.customer': {
            equals: user.id,
          },
        }
      }

      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.roles?.includes('admin')
    },
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      admin: {
        description: 'Order associated with this donation',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Donation amount in dollars',
        step: 0.01,
      },
    },
    {
      name: 'organization',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the conservation organization receiving the donation',
      },
    },
    {
      name: 'region',
      type: 'text',
      admin: {
        description: 'Geographic region or conservation focus area (e.g., Rio Grande Valley, South Padre Island)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pledged',
      options: [
        {
          label: 'Pledged',
          value: 'pledged',
        },
        {
          label: 'Donated',
          value: 'donated',
        },
      ],
      admin: {
        description: 'Current status of the donation',
      },
    },
    {
      name: 'donationDate',
      type: 'date',
      admin: {
        description: 'Date when the donation was actually made (if status is donated)',
        date: {
          displayFormat: 'MMM dd yyyy',
        },
      },
    },
    {
      name: 'receiptUrl',
      type: 'text',
      admin: {
        description: 'URL to donation receipt or proof of donation',
      },
    },
  ],
  timestamps: true,
}
