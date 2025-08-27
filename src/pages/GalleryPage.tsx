import React, { useState } from 'react'
import { Image as ImageIcon, Video, Youtube, Instagram, Star, Filter, X } from 'lucide-react'
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
  const [currentMedia, setCurrentMedia] = useState<typeof mediaItems[0] | null>(null)

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
                <div
                  key={item.id}
                  className="cursor-pointer hover:shadow-xl transition-shadow group"
                  onClick={() => openLightbox(item)}
                >
                  <Card>
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
                </div>
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
              className="absolute top-2 right-2 z-10 text-white hover:text-amber-400"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="p-4">
              {currentMedia.media_type === 'photo' && (
                <img
                  src={currentMedia.media_url}
                  alt={currentMedia.title}
                  className="w-full h-auto max-h-[80vh] object-contain mx-auto"
                />
              )}
              {currentMedia.media_type === 'youtube' && (
                <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(currentMedia.media_url)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                    title={currentMedia.title}
                  ></iframe>
                </div>
              )}
              {currentMedia.media_type === 'video' && (
                <video controls className="w-full h-auto max-h-[80vh] object-contain mx-auto">
                  <source src={currentMedia.media_url} type="video/mp4" />
                  Tu navegador no soporta la etiqueta de video.
                </video>
              )}
              {currentMedia.media_type === 'instagram' && (
                <div className="w-full max-w-lg mx-auto">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-pink-200 rounded-lg p-6">
                    <div className="flex items-center justify-center mb-4">
                      <Instagram className="w-12 h-12 text-pink-500" />
                    </div>
                    <h4 className="text-center font-semibold text-slate-800 mb-2">{currentMedia.title}</h4>
                    {currentMedia.description && (
                      <p className="text-center text-slate-600 text-sm mb-4">{currentMedia.description}</p>
                    )}
                    <div className="text-center">
                      <a
                        href={currentMedia.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors font-medium"
                      >
                        <Instagram className="w-5 h-5 mr-2" />
                        Ver en Instagram
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-slate-800">{currentMedia.title}</h3>
                {currentMedia.description && (
                  <p className="text-slate-600 mt-2">{currentMedia.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}