import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Checkout | Shenna's Studio",
  description: 'Complete your order for handcrafted ocean jewelry from Brownsville, TX.',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
