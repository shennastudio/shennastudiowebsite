import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: true,
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'roles'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      // Allow anyone to create the first user (admin)
      if (!user) return true
      // Otherwise, only admins can create users
      return user.roles?.includes('admin')
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      // Admins can update anyone
      if (user.roles?.includes('admin')) return true
      // Users can update themselves
      return {
        id: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      // Only admins can delete users
      return user.roles?.includes('admin')
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Customer',
          value: 'customer',
        },
        {
          label: 'Staff',
          value: 'staff',
        },
      ],
      required: true,
      access: {
        create: ({ req: { user } }) => !!(user?.roles?.includes('admin')),
        update: ({ req: { user } }) => !!(user?.roles?.includes('admin')),
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'zipCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'United States',
        },
      ],
    },
  ],
}
