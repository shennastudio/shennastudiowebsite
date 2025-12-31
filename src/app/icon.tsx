import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: '50%',
        }}
      >
        {/* ShennaStudio "S" logo */}
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'white',
            fontFamily: 'Georgia, serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
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