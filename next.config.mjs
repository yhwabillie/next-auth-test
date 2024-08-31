import path from 'path'
import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // webpack: (config) => {
  //   config.resolve.alias['@'] = path.resolve(__dirname)
  //   return config
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fluplmlpoyjvgxkldyfh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // 모든 public 경로의 이미지에 적용됩니다.
      },
    ],
    formats: ['image/avif', 'image/webp'], // 웹 최적화 이미지 포맷 지정
  },
  async headers() {
    return [
      {
        source: '/_next/image(.*)', // Next.js 이미지 최적화 라우트에 적용
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1년 동안 캐시, 변경되지 않음
          },
        ],
      },
      {
        source: '/storage/v1/object/public/(.*)', // Supabase 이미지 경로에 적용
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 1일 동안 캐시
          },
        ],
      },
    ]
  },
}

export default nextConfig
