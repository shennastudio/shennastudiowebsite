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
          background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Whale Shark Body */}
          <path
            d="M22 12C22 12 20 8 16 8C14 8 12 9 10 9C8 9 6 8 4 8C2 8 1 10 1 12C1 12 1.5 13 2 13L3 12L4 13C4 13 5 12 6 12C6 12 7 13 8 13C8 13 9 12 10 12C10 12 11 13 12 13C12 13 13 12 14 12C14 12 15 13 16 13C16 13 17 12 18 12L19 13L20 12C20.5 12.5 22 12 22 12Z"
            fill="white"
            opacity="0.95"
          />
          {/* Whale Shark Spots */}
          <circle cx="6" cy="10" r="0.8" fill="#0891b2" opacity="0.6" />
          <circle cx="9" cy="10" r="0.8" fill="#0891b2" opacity="0.6" />
          <circle cx="12" cy="10" r="0.8" fill="#0891b2" opacity="0.6" />
          <circle cx="15" cy="10" r="0.8" fill="#0891b2" opacity="0.6" />
          <circle cx="7.5" cy="11.5" r="0.6" fill="#0891b2" opacity="0.5" />
          <circle cx="10.5" cy="11.5" r="0.6" fill="#0891b2" opacity="0.5" />
          <circle cx="13.5" cy="11.5" r="0.6" fill="#0891b2" opacity="0.5" />
          {/* Eye */}
          <circle cx="16" cy="10" r="1" fill="#0891b2" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
