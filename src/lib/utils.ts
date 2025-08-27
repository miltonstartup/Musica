import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, Video, Youtube, Instagram, Star, Filter, X } from 'lucide-react' // Keep these imports
import { Card, CardContent, CardHeader } from '../components/Card'
import { Button } from '../components/Button'
import { Spinner } from '../components/Spinner'
import { formatDate } from '../lib/utils'
import { useMediaGallery } from '../hooks/useMediaGallery'
import { extractYouTubeId } from '../lib/utils'

export { GalleryPage }

type MediaType = 'all' | 'photo' | 'video' | 'youtube' | 'instagram'
type CategoryType = 'all' | 'lecciones' | 'performances' | 'testimonios' | 'eventos' | 'general'

function GalleryPage() {
  const { mediaItems, loading, error, fetchMediaItems, fetchMediaByCategory } = useMediaGallery()
  const [filterType, setFilterType] = useState<MediaType>('all')
  const [filterCategory, setFilterCategory] = useState<CategoryType>('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentMedia, setCurrentMedia] = useState<any>(null)

  const filteredMedia = mediaItems.filter(item => {
    const typeMatch = filterType === 'all' || item.media_type === filterType
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory
    return typeMatch && categoryMatch
  })

  const openLightbox = (item: any) => {
    setCurrentMedia(item)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentMedia(null)
  }

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'photo': return ImageIcon
      case 'video': return Video
      case 'youtube': return Youtube
      case 'instagram': return Instagram
      default: return ImageIcon
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error al cargar la galería</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => fetchMediaItems()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-amber-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <ImageIcon className="w-16 h-16 text-amber-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-slate-800 mb-6">
            Nuestra Galería Multimedia
          </h1>
          <p className="text-xl text-slate-600">
            Explora momentos de nuestras clases, presentaciones y eventos especiales.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-center">
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as MediaType)}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Todos los Tipos</option>
              <option value="photo">Fotos</option>
              <option value="video">Videos</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as CategoryType)}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Todas las Categorías</option>
              <option value="lecciones">Lecciones y Clases</option>
              <option value="performances">Presentaciones y Recitales</option>
              <option value="testimonios">Testimonios de Estudiantes</option>
              <option value="eventos">Eventos Especiales</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No se encontraron elementos multimedia
              </h3>
              <p className="text-slate-600">
                Ajusta tus filtros o vuelve más tarde para ver nuevo contenido.
              </p>
            </div>
          ) : (
            filteredMedia.map((item) => {
              const IconComponent = getMediaIcon(item.media_type)
              return (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-xl transition-shadow group"
                  onClick={() => openLightbox(item)}
                >
                  <div className="relative h-48 overflow-hidden">
                    {item.media_type === 'photo' && (
                      <img
                        src={item.thumbnail_url || item.media_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {item.media_type === 'youtube' && (
                      <div className="relative w-full h-full bg-black flex items-center justify-center">
                        <img
                          src={item.thumbnail_url || `https://img.youtube.com/vi/${extractYouTubeId(item.media_url)}/maxresdefault.jpg`}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-75"
                        />
                        <Youtube className="absolute w-16 h-16 text-red-500 opacity-90" />
                      </div>
                    )}
                    {(item.media_type === 'video' || item.media_type === 'instagram') && (
                      <div className="relative w-full h-full bg-black flex items-center justify-center">
                        {item.thumbnail_url && (
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-75"
                          />
                        )}
                        <IconComponent className="absolute w-16 h-16 text-white opacity-90" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {item.is_featured && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Destacado
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                      <span className="bg-slate-100 px-2 py-1 rounded capitalize">{item.category}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && currentMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeLightbox}
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