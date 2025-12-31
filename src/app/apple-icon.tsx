import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #67e8f9 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '22%',
        }}
      >
        {/* ShennaStudio "S" logo */}
        <span
          style={{
            fontSize: 110,
            fontWeight: 700,
            color: 'white',
            fontFamily: 'Georgia, serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }}
        >
          S
        </span>
      </div>
    ),
    {
      ...size,
    }
  )
}