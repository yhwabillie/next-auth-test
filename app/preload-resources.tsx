'use client '

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('/fonts/Pretendard-Regular.subset.woff2', {
    as: 'font',
    type: 'font/woff2',
    fetchPriority: 'high',
  })

  ReactDOM.preload('https://fluplmlpoyjvgxkldyfh.supabase.co/storage/v1/object/public/next-auth-test/banners/banner-1.webp', {
    as: 'image',
    fetchPriority: 'high',
  })

  return null
}
