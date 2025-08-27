import React, { useState } from 'react'
import { useMediaGallery } from '../../hooks/useMediaGallery'
import { MediaItem } from '../../types'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image, 
  Video, 
  Youtube, 
  Instagram,
  Star,
  Eye,
  Upload,
  Save,
  X
} from 'lucide-react'

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
  { value: 'recitales', label: 'Recitales' },
  { value: 'clases', label: 'Clases' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'estudiantes', label: 'Estudiantes' },
  { value: 'general', label: 'General' }
]

const mediaTypes = [
  { value: 'photo' as const, label: 'Foto', icon: Image },
  { value: 'video' as const, label: 'Video', icon: Video },
  { value: 'youtube' as const, label: 'YouTube', icon: Youtube },
  { value: 'instagram' as const, label: 'Instagram', icon: Instagram }
]

export function MediaManagement() {
  const { mediaItems, loading, error, addMediaItem, editMediaItem, removeMediaItem, fetchMediaItems } = useMediaGallery()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [formData, setFormData] = useState<MediaFormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingItem) {
        await editMediaItem(editingItem.id, formData)
      } else {
        // Convert tags string to array for API
        const mediaItemData = {
          ...formData,
          tags: formData.tags, // Keep as string since MediaGallery expects string
          updated_at: new Date().toISOString()
        }
        await addMediaItem(mediaItemData)
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
      is_featured: item.is_featured
    })
    setEditingItem(item)
    setIsFormOpen(true)
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

  const renderMediaThumbnail = (item: MediaItem) => {
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
      const videoId = item.media_url.includes('watch?v=') 
        ? item.media_url.split('watch?v=')[1].split('&')[0]
        : item.media_url.split('youtu.be/')[1]?.split('?')[0]
      
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
          <p className="text-slate-600 mt-1">Administra fotos, videos y contenido multimedia</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Contenido
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Media Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {editingItem ? 'Editar Contenido Multimedia' : 'Agregar Contenido Multimedia'}
                </h2>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Título del contenido multimedia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Descripción del contenido"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tipo de Contenido *
                    </label>
                    <select
                      required
                      value={formData.media_type}
                      onChange={(e) => setFormData({ ...formData, media_type: e.target.value as MediaFormData['media_type'] })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {mediaTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categoría *
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL del Contenido *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.media_url}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL de Miniatura (Opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Etiquetas (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="música, piano, estudiantes (separadas por comas)"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Separa las etiquetas con comas
                  </p>
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
                    Contenido destacado
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingItem ? 'Actualizar' : 'Agregar'}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
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
                {renderMediaThumbnail(item)}
                
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
                <h3 className="font-semibold text-slate-800 mb-1 truncate">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                  {item.description || 'Sin descripción'}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="bg-slate-100 px-2 py-1 rounded">{item.category}</span>
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
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            Agrega fotos, videos o contenido de redes sociales para comenzar.
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