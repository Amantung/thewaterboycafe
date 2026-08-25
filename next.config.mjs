/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // AVIF first, WebP fallback — smallest payload for the photography-heavy layout.
    formats: ['image/avif', 'image/webp'],
    // The hero photo asks for a bespoke 82 (see Hero.tsx); everything else uses
    // next/image's default 75. Both must be explicit from Next.js 16 on.
    qualities: [75, 82],
    // Matches the breakpoints the layout actually renders at, so we don't
    // generate variants nobody downloads.
    deviceSizes: [420, 640, 828, 1080, 1200, 1600, 1920, 2048],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async redirects() {
    return [
      // The cafe does not take bookings — /reserve used to be a booking-request
      // form. Old links and bookmarks still point at it, so send them to
      // /contact rather than leaving a 404.
      { source: '/reserve', destination: '/contact', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
      {
        // Generated placeholder art and real photography are both immutable
        // once deployed — fingerprinted by the optimizer, safe to cache hard.
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
