'use client'

import { useEffect, useRef } from 'react'

interface AdInContentProps {
  adSlot: string
  className?: string
}

export default function AdInContent({ adSlot, className = '' }: AdInContentProps) {
  const adRef = useRef<HTMLModElement>(null)
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (!clientId || !adRef.current) return
    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []
      adsbygoogle.push({})
    } catch {
      // AdSense not loaded
    }
  }, [clientId])

  if (!clientId) return null

  return (
    <div className={`my-6 sm:my-8 w-full overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-layout="in-article"
        data-ad-format="fluid"
      />
    </div>
  )
}
