import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number): string => { // Exported
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}

export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('es-ES', options)
}

export const formatTime = (timeString: string): string => { // Exported
  const [hours, minutes] = timeString.split(':')
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true }
  return date.toLocaleTimeString('es-ES', options)
}

export const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export const isYouTubeEmbed = (code: string): boolean => {
  return code.includes('youtube.com/embed/') && code.includes('<iframe')
}

export const extractYouTubeIdFromEmbed = (embedCode: string): string | null => {
  const regex = /youtube\.com\/embed\/([^"&?/\s]+)/
  const match = embedCode.match(regex)
  return match ? match[1] : null
}

export const isInstagramEmbed = (code: string): boolean => {
  return code.includes('instagram-media') && code.includes('<blockquote')
}

export const extractInstagramIdFromEmbed = (embedCode: string): string | null => {
  const regex = /data-instgrm-permalink="https:\/\/www\.instagram\.com\/p\/([^/]+)\//
  const match = embedCode.match(regex)
  return match ? match[1] : null
}

export const convertEmbedToUrl = (embedCode: string, type: 'youtube' | 'instagram'): string => {
  if (type === 'youtube') {
    const videoId = extractYouTubeIdFromEmbed(embedCode)
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''
  } else if (type === 'instagram') {
    const postId = extractInstagramIdFromEmbed(embedCode)
    return postId ? `https://www.instagram.com/p/${postId}/` : ''
  }
  return ''
}

export const isValidInstagramUrl = (url: string): boolean => {
  const instagramPatterns = [
    /^https:\/\/(?:www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+\/?/,
    /^https:\/\/(?:www\.)?instagram\.com\/reel\/[a-zA-Z0-9_-]+\/?/,
    /^https:\/\/(?:www\.)?instagram\.com\/tv\/[a-zA-Z0-9_-]+\/?/
  ]
  
  return instagramPatterns.some(pattern => pattern.test(url))
}

export const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeId(url) !== null
}

// Enhanced embed code detection
export const detectEmbedType = (code: string): 'youtube' | 'instagram' | 'unknown' => {
  if (isYouTubeEmbed(code)) return 'youtube'
  if (isInstagramEmbed(code)) return 'instagram'
  return 'unknown'
}

// Process embed code and extract URL
export const processEmbedCode = (embedCode: string): { url: string; type: string; videoId?: string } | null => {
  const type = detectEmbedType(embedCode)
  
  if (type === 'youtube') {
    const videoId = extractYouTubeIdFromEmbed(embedCode)
    if (videoId) {
      return {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        type: 'youtube',
        videoId
      }
    }
  }
  
  if (type === 'instagram') {
    const postId = extractInstagramIdFromEmbed(embedCode)
    if (postId) {
      return {
        url: `https://www.instagram.com/p/${postId}/`,
        type: 'instagram'
      }
    }
  }
  
  return null
}