'use client '
import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('/fonts/Pretendard-Regular.subset.woff2', {
    as: 'font',
    type: 'font/woff2',
    fetchPriority: 'high',
  })

  ReactDOM.preload('styles/globals.css', {
    as: 'style',
    fetchPriority: 'high',
  })

  return null
}
