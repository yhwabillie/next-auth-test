'use client '

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('/fonts/Pretendard-Regular.subset.woff2', {
    as: 'font',
    fetchPriority: 'high',
  })

  return null
}
