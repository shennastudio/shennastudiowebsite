import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact Us | Shenna's Studio - Custom Bracelets Brownsville TX",
  description: 'Get in touch with Shenna\'s Studio in Brownsville, TX. Questions about custom bracelets, orders, wholesale, or our marine conservation mission? We\'d love to hear from you.',
  openGraph: {
    title: "Contact Shenna's Studio",
    description: 'Reach out for custom bracelet orders, wholesale inquiries, or conservation partnerships in Brownsville, TX.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
