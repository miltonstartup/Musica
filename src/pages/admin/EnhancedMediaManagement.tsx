import React, { useState } from 'react'
import { useMediaGallery } from '../../hooks/useMediaGallery'
import { Card, CardContent, CardHeader } from '../../components/Card' // Keep this import
import { Plus, Edit, Trash2, Image, Video, Youtube, Instagram, Star, Filter, X, Eye, Upload, Save, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { PasteButton } from '../../components/PasteButton'
import { ImageUpload } from '../../components/ImageUpload'
import { extractYouTubeId, isValidInstagramUrl, isValidYouTubeUrl, processEmbedCode, isYouTubeEmbed, extractYouTubeIdFromEmbed, isInstagramEmbed, extractInstagramIdFromEmbed, convertEmbedToUrl } from '../../lib/utils'
import type { MediaGallery as MediaItem } from '../../types'

type MediaFormData = {
  title: string
  description: string
  media_type: 'photo' | 'video' | 'youtube' | 'instagram'
  media_url: string
  thumbnail_url: string
  category: string
  tags: string
  is_featured: boolean
}

const initialFormData: MediaFormData = {
  title: '',
  description: '',
  media_type: 'photo',
  media_url: '',
  thumbnail_url: '',
  category: 'general',
  tags: '',
  is_featured: false
}

const categories = [
  { value: 'lecciones', label: 'Lecciones y Clases' },
  { value: 'performances', label: 'Presentaciones y Recitales' },
  { value: 'testimonios', label: 'Testimonios de Estudiantes' },
  { value: 'eventos', label: 'Eventos Especiales' },
  { value: 'general', label: 'General' }
]

const mediaTypes = [
  { value: 'photo' as const, label: 'Fotografía', icon: Image, description: 'Imágenes y fotos' },
  { value: 'video' as const, label: 'Video', icon: Video, description: 'Videos subidos directamente' },
  { value: 'youtube' as const, label: 'YouTube', icon: Youtube, description: 'Videos de YouTube' },
  { value: 'instagram' as const, label: 'Instagram', icon: Instagram, description: 'Contenido de Instagram' }
]

export function EnhancedMediaManagement() {
  const { mediaItems, loading, error, addMediaItem, editMediaItem, removeMediaItem, fetchMediaItems } = useMediaGallery()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [formData, setFormData] = useState<MediaFormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [urlPreview, setUrlPreview] = useState<string | null>(null)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form')
  const [inputMode, setInputMode] = useState<'url' | 'embed'>('url')
  const [embedCode, setEmbedCode] = useState('')

  const validateUrl = (url: string, mediaType: string) => {
    if (!url.trim()) {
      setUrlError(null)
      setUrlPreview(null)
      return
    }

    setUrlError(null)
    
    switch (mediaType) {
      case 'youtube':
        if (isValidYouTubeUrl(url)) {
          const videoId = extractYouTubeId(url)
          setUrlPreview(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
        } else { // Keep this else block
          setUrlError('URL de YouTube no válida. Usa formato: https://www.youtube.com/watch?v=...')
          setUrlPreview(null)
        }
        break
      case 'instagram':
        if (isValidInstagramUrl(url)) {
          setUrlPreview(url)
        } else { // Keep this else block
          setUrlError('URL de Instagram no válida. Usa formato: https://www.instagram.com/p/...')
          setUrlPreview(null)
        }
        break
      case 'photo':
      case 'video':
        if (url.match(/\.(jpg|jpeg|png|gif|webp|mp4|avi|mov)$/i)) {
          setUrlPreview(url) // Keep this line
        } else if (url.startsWith('http')) {
          setUrlPreview(url)
        } else {
          setUrlError('URL no válida. Asegúrate de que sea una URL completa.')
          setUrlPreview(null)
        }
        break
    }
  }

  const validateEmbedCode = (code: string, mediaType: string) => {
    if (!code.trim()) {
      setUrlError(null)
      setUrlPreview(null)
      return
    }

    setUrlError(null)
    
    if (mediaType === 'youtube' && isYouTubeEmbed(code)) {
      const videoId = extractYouTubeIdFromEmbed(code)
      if (videoId) {
        setUrlPreview(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
        const convertedUrl = convertEmbedToUrl(code, 'youtube')
        setFormData(prev => ({ ...prev, media_url: convertedUrl }))
      } else {
        setUrlError('Código de inserción de YouTube no válido')
        setUrlPreview(null)
      }
    } else if (mediaType === 'instagram' && isInstagramEmbed(code)) {
      const postId = extractInstagramIdFromEmbed(code)
      if (postId) {
        const convertedUrl = convertEmbedToUrl(code, 'instagram')
        setUrlPreview(convertedUrl)
        setFormData(prev => ({ ...prev, media_url: convertedUrl }))
      } else {
        setUrlError('Código de inserción de Instagram no válido')
        setUrlPreview(null)
      }
    } else {
      setUrlError(`Código de inserción de ${mediaType} no válido`)
      setUrlPreview(null)
    }
  }

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, media_url: url })
    validateUrl(url, formData.media_type)
    
    // Auto-generate title for YouTube videos
    if (formData.media_type === 'youtube' && isValidYouTubeUrl(url) && !formData.title) {
      // You could integrate YouTube API here to fetch the actual title
      const videoId = extractYouTubeId(url)
      if (videoId) {
        setFormData(prev => ({ ...prev, title: `Video de YouTube - ${videoId}` }))
      }
    }
  }

  const handleUrlPaste = (url: string) => {
    handleUrlChange(url)
  }

  const handleEmbedPaste = (code: string) => {
    setEmbedCode(code)
    
    // Auto-detect embed type and process
    const processed = processEmbedCode(code)
    if (processed) {
      setFormData(prev => ({
        ...prev,
        media_type: processed.type as 'youtube' | 'instagram',
        media_url: processed.url
      }))
      validateEmbedCode(code, processed.type)
    } else {
      validateEmbedCode(code, formData.media_type)
    }
  }

  const handleMediaTypeChange = (mediaType: MediaFormData['media_type']) => {
    setFormData({ ...formData, media_type: mediaType })
    validateUrl(formData.media_url, mediaType)
    setInputMode('url')
    setEmbedCode('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (urlError) {
      return
    }
    
    setSubmitting(true)

    try {
      // Convert comma-separated tags string to array
      const tagsArray = formData.tags.trim() 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []
      
      const submitData = {
        ...formData,
        tags: tagsArray,
        thumbnail_url: formData.thumbnail_url || urlPreview || '',
        updated_at: new Date().toISOString()
      }
      
      if (editingItem) {
        await editMediaItem(editingItem.id, submitData)
      } else {
        await addMediaItem(submitData)
      }
      resetForm()
      await fetchMediaItems()
    } catch (error) {
      console.error('Error saving media item:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setIsFormOpen(false)
    setEditingItem(null)
    setUrlPreview(null)
    setUrlError(null)
    setActiveTab('form')
    setInputMode('url')
    setEmbedCode('')
  }

  const handleEdit = (item: MediaItem) => {
    setFormData({
      title: item.title,
      description: item.description || '',
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || '',
      category: item.category,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      is_featured: item.is_featured || false
    })
    setEditingItem(item)
    setIsFormOpen(true)
    validateUrl(item.media_url, item.media_type)
    setActiveTab('form')
    setInputMode('url')
    setEmbedCode('')
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento multimedia?')) {
      try {
        await removeMediaItem(id)
        await fetchMediaItems()
      } catch (error) {
        console.error('Error deleting media item:', error)
      }
    }
  }

  const getMediaIcon = (type: MediaItem['media_type']) => {
    const mediaType = mediaTypes.find(t => t.value === type)
    return mediaType ? mediaType.icon : Image
  }

  const renderMediaPreview = (item: MediaItem) => {
    if (item.media_type === 'photo') {
      return (
        <img
          src={item.thumbnail_url || item.media_url}
          alt={item.title}
          className="w-full h-32 object-cover"
        />
      )
    }
    
    if (item.media_type === 'youtube') {
      const videoId = extractYouTubeId(item.media_url)
      return (
        <div className="relative w-full h-32 bg-gray-100 flex items-center justify-center">
          <img
            src={item.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <Youtube className="w-8 h-8 text-red-500" />
          </div>
        </div>
      )
    }
    
    const IconComponent = getMediaIcon(item.media_type)
    return (
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
        <IconComponent className="w-12 h-12 text-gray-400" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión de Galería Multimedia</h1>
          <p className="text-slate-600 mt-1">Administra fotos, videos, YouTube e Instagram</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Contenido
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Enhanced Media Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingItem ? 'Editar Contenido Multimedia' : 'Agregar Nuevo Contenido'}
                </h2>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'form' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Formulario
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                  disabled={!formData.title || !formData.media_url}
                >
                  <Eye className="w-4 h-4 mr-1 inline" />
                  Vista Previa
                </button>
              </div>
            </CardHeader>
            
            <CardContent>
              {activeTab === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Media Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Tipo de Contenido *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {mediaTypes.map(type => {
                        const IconComponent = type.icon
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleMediaTypeChange(type.value)}
                            className={`p-4 border-2 rounded-lg text-center transition-colors ${
                              formData.media_type === type.value
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <IconComponent className="w-8 h-8 mx-auto mb-2" />
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-slate-500">{type.description}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* URL Input with Paste Button */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {formData.media_type === 'youtube' && 'URL o Código de YouTube *'}
                      {formData.media_type === 'instagram' && 'URL o Código de Instagram *'}
                      {(formData.media_type === 'photo' || formData.media_type === 'video') && 'Imagen/Video *'}
                    </label>
                    
                    {(formData.media_type === 'photo' || formData.media_type === 'video') ? (
                      <div className="space-y-3">
                        <ImageUpload
                          currentImageUrl={formData.media_url}
                          onImageUploaded={(url) => {
                            setFormData({ ...formData, media_url: url })
                            setUrlPreview(url)
                            setUrlError(null)
                          }}
                          bucket="media-gallery"
                          allowUrlInput={true}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Input Mode Toggle */}
                        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setInputMode('url')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              inputMode === 'url' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            URL Directa
                          </button>
                          <button
                            type="button"
                            onClick={() => setInputMode('embed')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              inputMode === 'embed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            Código de Inserción
                          </button>
                        </div>

                        {inputMode === 'url' ? (
                          <div className="flex space-x-2">
                            <input
                              type="url"
                              required
                              value={formData.media_url}
                              onChange={(e) => handleUrlChange(e.target.value)}
                              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                urlError ? 'border-red-300' : 'border-slate-300'
                              }`}
                              placeholder={
                                formData.media_type === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                                formData.media_type === 'instagram' ? 'https://www.instagram.com/p/...' :
                                'https://ejemplo.com/archivo.jpg'
                              }
                            />
                            <PasteButton onPaste={handleUrlPaste} className="flex-shrink-0" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex space-x-2">
                              <textarea
                                required
                                value={embedCode}
                                onChange={(e) => {
                                  setEmbedCode(e.target.value)
                                  handleEmbedPaste(e.target.value)
                                }}
                                rows={4}
                                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none ${
                                  urlError ? 'border-red-300' : 'border-slate-300'
                                }`}
                                placeholder={
                                  formData.media_type === 'youtube' 
                                    ? '<iframe width="560" height="315" src="https://www.youtube.com/embed/..." frameborder="0" allowfullscreen></iframe>'
                                    : '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/..." ...></blockquote>'
                                }
                              />
                              <PasteButton onPaste={handleEmbedPaste} className="flex-shrink-0 self-start" />
                            </div>
                            <p className="text-xs text-slate-500">
                              Pega el código de inserción de YouTube o Instagram. El tipo se detectará automáticamente.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {urlError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        {urlError}
                      </div>
                    )}
                    
                    {urlPreview && !urlError && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <div className="flex items-center text-green-600 text-sm mb-2">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {inputMode === 'embed' ? 'Código de inserción válido' : 'URL válida'} - Vista previa disponible
                        </div>
                        {formData.media_type === 'youtube' && (
                          <img src={urlPreview} alt="Preview" className="w-32 h-20 object-cover rounded" />
                        )}
                        {formData.media_type === 'instagram' && (
                          <div className="flex items-center text-pink-600 text-sm">
                            <Instagram className="w-4 h-4 mr-2" />
                            Contenido de Instagram detectado
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title and Description */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Título *
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Título descriptivo del contenido"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Categoría * /* Keep this label */
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2"> /* Keep this label */
                      Descripción
                    </label>
                    <div className="flex space-x-2">
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Descripción opcional del contenido"
                      />
                    </div>
                  </div>

                  {/* Optional fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {(formData.media_type === 'photo' || formData.media_type === 'video') ? /* Keep this conditional rendering */
                          'Miniatura Personalizada (Opcional)' : 
                          'Miniatura (Opcional)'
                        }
                      </label>
                      
                      {(formData.media_type === 'photo' || formData.media_type === 'video') ? (
                        <ImageUpload
                          currentImageUrl={formData.thumbnail_url}
                          onImageUploaded={(url) => setFormData({ ...formData, thumbnail_url: url })}
                          bucket="media-gallery-thumbnails"
                          className="w-full"
                        />
                      ) : (
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            value={formData.thumbnail_url}
                            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="https://ejemplo.com/miniatura.jpg"
                          />
                          <PasteButton 
                            onPaste={(url) => setFormData({ ...formData, thumbnail_url: url })} 
                            className="flex-shrink-0" 
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2"> /* Keep this label */
                        Etiquetas
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="música, piano, estudiante (separadas por comas)"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Separa las etiquetas con comas</p> {/* Keep this paragraph */}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
                    />
                    <label htmlFor="is_featured" className="ml-2 block text-sm text-slate-700">
                      <Star className="w-4 h-4 inline mr-1" /> {/* Keep this icon */}
                      Contenido destacado (aparecerá en la página principal)
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <Button type="submit" disabled={submitting || !!urlError} className="flex-1">
                      {submitting ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Guardando...
                        </>
                      ) : ( /* Keep this conditional rendering */
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingItem ? 'Actualizar Contenido' : 'Agregar Contenido'}
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                /* Preview Tab */
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6">
                    {urlPreview ? (
                      <div> {/* Keep this div */}
                        <h3 className="text-lg font-semibold mb-4">{formData.title}</h3>
                        {formData.media_type === 'youtube' && (
                          <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                            {(() => {
                              const videoId = extractYouTubeId(formData.media_url)
                              return videoId ? (
                                <iframe
                                  width="100%"
                                  height="280"
                                  src={`https://www.youtube.com/embed/${videoId}`}
                                  title={formData.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded"> {/* Keep this div */}
                                  <Youtube className="w-16 h-16 text-gray-400" />
                                  <span className="ml-2 text-gray-500">Video de YouTube no válido</span>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                        {formData.media_type === 'instagram' && (
                          <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50 mb-4">
                            <div className="flex items-center justify-center mb-4">
                              <Instagram className="w-12 h-12 text-pink-500" />
                            </div> {/* Keep this div */}
                            <h4 className="text-center font-medium text-slate-700 mb-2">{formData.title || 'Contenido de Instagram'}</h4>
                            <p className="text-center text-slate-600 text-sm mb-4">Vista previa del contenido de Instagram</p>
                            <a 
                              href={formData.media_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                            > {/* Keep this anchor tag */}
                              <Instagram className="w-4 h-4 mr-2" />
                              Ver en Instagram
                            </a>
                          </div>
                        )}
                        {(formData.media_type === 'photo' || formData.media_type === 'video') && (
                          <div className="border rounded-lg overflow-hidden mb-4">
                            {formData.media_type === 'photo' ? (
                              <img /* Keep this img tag */
                                src={formData.media_url} 
                                alt={formData.title}
                                className="w-full max-h-80 object-contain bg-gray-50"
                              />
                            ) : (
                              <video 
                                src={formData.media_url}
                                controls /* Keep this controls attribute */
                                className="w-full max-h-80 object-contain bg-black"
                              />
                            )}
                          </div>
                        )}
                        {formData.description && (
                          <p className="text-slate-600 mt-4">{formData.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-4 text-sm text-slate-500"> {/* Keep this div */}
                          <span className="bg-slate-100 px-2 py-1 rounded">{formData.category}</span>
                          {formData.is_featured && (
                            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              Destacado
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500"> {/* Keep this div */}
                        <Eye className="w-12 h-12 mx-auto mb-2" />
                        <p>Completa el título y contenido multimedia para ver la vista previa</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={() => setActiveTab('form')} variant="outline" className="flex-1">
                      Volver al Formulario
                    </Button>
                    {formData.media_url && (
                      <Button 
                        onClick={() => window.open(formData.media_url, '_blank')} 
                        variant="outline"
                        className="flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Original
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mediaItems.map((item) => {
          const IconComponent = getMediaIcon(item.media_type)
          return (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                {renderMediaPreview(item)}

                {/* Featured badge */}
                {item.is_featured && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Destacado
                  </div>
                )}

                {/* Media type indicator */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded">
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1 truncate">{item.title}</h3> {/* Keep this heading */}
                <p className="text-sm text-slate-600 mb-2 line-clamp-2"> {/* Keep this paragraph */}
                  {item.description || 'Sin descripción'}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="bg-slate-100 px-2 py-1 rounded">{item.category}</span> {/* Keep this span */}
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.open(item.media_url, '_blank')}
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {mediaItems.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            No hay contenido multimedia
          </h3>
          <p className="text-slate-500 mb-4">
            Comienza agregando fotos, videos de YouTube o contenido de Instagram.
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Elemento
          </Button>
        </div>
      )}
    </div>
  )
}
