import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Search Products | Shenna's Studio",
  description: 'Search our collection of handcrafted ocean-inspired bracelets and jewelry.',
  robots: { index: false, follow: true },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
