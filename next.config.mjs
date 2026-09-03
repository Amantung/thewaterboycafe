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
      // /menu used to be a full itemised menu page — replaced by a PDF, kept
      // temporary since the PDF path may change.
      { source: '/menu', destination: '/menu.pdf', permanent: false },
      // /reviews used to be a standalone page — testimonials now live in a
      // homepage section instead.
      { source: '/reviews', destination: '/', permanent: false },
      // Canonical host is the bare apex domain. Both `www` and the apex were
      // resolving with their own 200 response and no redirect between them —
      // textbook duplicate content. Force `www` onto the apex so there is
      // exactly one indexable URL per page.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.thewaterboycafe.com.au' }],
        destination: 'https://thewaterboycafe.com.au/:path*',
        permanent: true,
      },
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
