import React, { useState, useEffect } from 'react'
import { useMediaGallery } from '../hooks'
import { MediaItem } from '../types'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Image, Video, Play, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { extractYouTubeId } from '../lib/utils'

interface LightboxProps {
  item: MediaItem | null
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

function Lightbox({ item, onClose, onNext, onPrev }: LightboxProps) {
  if (!item) return null

  const renderMedia = () => {
    if (item.media_type === 'photo') {
      return (
        <img
          src={item.media_url}
          alt={item.title}
          className="max-h-[80vh] max-w-full object-contain"
        />
      )
    }
    
    if (item.media_type === 'video') {
      return (
        <video
          src={item.media_url}
          controls
          className="max-h-[80vh] max-w-full"
          autoPlay
        />
      )
    }
    
    if (item.media_type === 'youtube') {
      const videoId = extractYouTubeId(item.media_url)
      
      return videoId ? (
        <iframe
          width="800"
          height="450"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={item.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="max-h-[80vh]"
        />
      ) : (
        <div className="max-h-[80vh] max-w-full bg-gray-100 flex items-center justify-center p-8">
          <div className="text-center">
            <Youtube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Video de YouTube no válido</p>
          </div>
        </div>
      )
    }
    
    if (item.media_type === 'instagram') {
      return (
        <div className="max-h-[80vh] max-w-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-8">
          <div className="text-center">
            <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <p className="text-slate-700 mb-4">Contenido de Instagram</p>
            <a 
              href={item.media_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              Ver en Instagram
            </a>
          </div>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative max-w-7xl mx-auto p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="w-8 h-8" />
        </button>
        
        {/* Previous button */}
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        {/* Next button */}
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
        
        {/* Media content */}
        <div className="flex flex-col items-center">
          {renderMedia()}
          
          {/* Media info */}
          <div className="text-center mt-4 text-white">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            {item.description && (
              <p className="text-gray-300">{item.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function GalleryPage() {
  const { mediaItems, loading, error, fetchMediaByCategory, fetchMediaItems } = useMediaGallery()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'recitales', label: 'Recitales' },
    { value: 'clases', label: 'Clases' },
    { value: 'eventos', label: 'Eventos' },
    { value: 'estudiantes', label: 'Estudiantes' }
  ]

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      await fetchMediaItems()
    } else {
      await fetchMediaByCategory(category)
    }
  }

  const openLightbox = (item: MediaItem, index: number) => {
    setLightboxItem(item)
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setLightboxItem(null)
    setCurrentIndex(0)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % mediaItems.length
    setCurrentIndex(nextIndex)
    setLightboxItem(mediaItems[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? mediaItems.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setLightboxItem(mediaItems[prevIndex])
  }

  const renderMediaThumbnail = (item: MediaItem) => {
    if (item.media_type === 'photo') {
      return (
        <img
          src={item.thumbnail_url || item.media_url}
          alt={item.title}
          className="w-full h-64 object-cover"
        />
      )
    }
    
    if (item.media_type === 'video') {
      return (
        <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
          <img
            src={item.thumbnail_url || item.media_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>
      )
    }
    
    if (item.media_type === 'youtube') {
      return (
        <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
          {(() => {
            const videoId = extractYouTubeId(item.media_url)
            return videoId ? (
              <img
                src={item.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Youtube className="w-12 h-12 text-gray-400" />
              </div>
            )
          })()}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <Play className="w-12 h-12 text-red-500" />
          </div>
        </div>
      )
    }
    
    if (item.media_type === 'instagram') {
      return (
        <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <div className="text-center">
            <Instagram className="w-12 h-12 text-pink-500 mb-2" />
            <p className="text-sm text-slate-600">Instagram</p>
          </div>
        </div>
      )
    }
    
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
        <Image className="w-12 h-12 text-gray-400" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando galería...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchMediaItems()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Galería Musical
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Explora momentos especiales de nuestros recitales, clases y eventos. 
          Cada imagen cuenta la historia de un viaje musical único.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category.value
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {mediaItems.length === 0 ? (
        <div className="text-center py-16">
          <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No hay elementos en esta categoría
          </h3>
          <p className="text-gray-500">
            Los elementos multimedia aparecerán aquí una vez que sean agregados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map((item, index) => (
            <Card key={item.id} className="group cursor-pointer overflow-hidden">
              <div 
                onClick={() => openLightbox(item, index)}
                className="relative"
              >
                {renderMediaThumbnail(item)}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
                
                {/* Media type indicator */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded">
                  {item.media_type === 'photo' && <Image className="w-4 h-4" />}
                  {(item.media_type === 'video' || item.media_type === 'youtube') && <Video className="w-4 h-4" />}
                </div>
                
                {/* Featured badge */}
                {item.is_featured && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded">
                    Destacado
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        item={lightboxItem}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  )
}