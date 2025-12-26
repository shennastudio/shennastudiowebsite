import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import * as dotenv from 'dotenv'

dotenv.config()

// Collections
import { Users } from './src/collections/Users'
import { Products } from './src/collections/Products'
import { Categories } from './src/collections/Categories'
import { Orders } from './src/collections/Orders'
import { Media } from './src/collections/Media'
import { InventoryTransactions } from './src/collections/InventoryTransactions'
import { ConservationDonations } from './src/collections/ConservationDonations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- ShennaStudio Admin',
    },
  },
  collections: [Users, Products, Categories, Orders, Media, InventoryTransactions, ConservationDonations],
  editor: slateEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-this-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    },
  }),
  plugins: [],
  sharp,
})
