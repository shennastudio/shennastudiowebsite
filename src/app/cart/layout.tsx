import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shopping Cart | Shenna's Studio",
  description: 'Review your selected ocean-inspired bracelets and handcrafted jewelry before checkout.',
  robots: { index: false, follow: false },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
