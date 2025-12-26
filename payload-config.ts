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
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
    },
  }),
  plugins: [],
  sharp,
})
