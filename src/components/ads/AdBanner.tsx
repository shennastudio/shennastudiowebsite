'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  adSlot: string
  className?: string
}

export default function AdBanner({ adSlot, className = '' }: AdBannerProps) {
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
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
