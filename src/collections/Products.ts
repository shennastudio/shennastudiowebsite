import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'basePrice', 'category', 'inStock', 'featured'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!(user?.roles?.includes('admin') || user?.roles?.includes('staff')),
    update: ({ req: { user } }) => !!(user?.roles?.includes('admin') || user?.roles?.includes('staff')),
    delete: ({ req: { user } }) => !!(user?.roles?.includes('admin')),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stock Keeping Unit - unique product identifier',
      },
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Base price in USD',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: true,
      admin: {
        description: 'Products can belong to multiple categories',
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'materials',
      type: 'array',
      fields: [
        {
          name: 'material',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'sizes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      defaultValue: ['small', 'medium', 'large'],
    },
    {
      name: 'variants',
      type: 'array',
      admin: {
        description: 'Product variants (size, color, material combinations)',
      },
      fields: [
        {
          name: 'variantName',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Small - Blue" or "Medium - Natural Wood"',
          },
        },
        {
          name: 'sku',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'stock',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'size',
          type: 'select',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
        },
        {
          name: 'color',
          type: 'text',
        },
        {
          name: 'material',
          type: 'text',
        },
        {
          name: 'weight',
          type: 'number',
          min: 0,
          admin: {
            description: 'Weight in ounces for shipping calculations',
            step: 0.001,
          },
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this product on the homepage',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'conservationInfo',
      type: 'group',
      admin: {
        description: 'Information about conservation efforts this product supports',
      },
      fields: [
        {
          name: 'donationPercentage',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 10,
          admin: {
            description: 'Percentage of sale donated to conservation (default: 10%)',
          },
        },
        {
          name: 'conservationFocus',
          type: 'textarea',
          admin: {
            description: 'Specific conservation cause or species this product supports',
          },
        },
      ],
    },
  ],
}
