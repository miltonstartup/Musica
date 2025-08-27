import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, AlertCircle, FileText, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card' // Keep this import
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { ImageUpload } from '../../components/ImageUpload'
import { useBlogPosts } from '../../hooks/useBlogPosts'
import { blogApi } from '../../api/blog'
import { formatDate } from '../../lib/utils'
import type { BlogPost, CreateBlogPostData } from '../../types'

export function BlogManagement() {
  const { blogPosts, loading, error, refreshBlogPosts } = useBlogPosts()
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateBlogPostData>({
    title: '',
    slug: '',
    content: '',
    image_url: '',
    published_date: new Date().toISOString().slice(0, 16)
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug || '',
      content: post.content,
      image_url: post.image_url || '',
      published_date: new Date(post.published_date).toISOString().slice(0, 16)
    })
    setIsCreating(false)
    setFormError(null)
    setPreviewMode(false)
  }

  const handleCreate = () => {
    setEditingPost(null)
    setFormData({
      title: '',
      slug: '',
      content: '',
      image_url: '',
      published_date: new Date().toISOString().slice(0, 16)
    })
    setIsCreating(true)
    setFormError(null)
    setPreviewMode(false)
  }

  const handleCancel = () => {
    setEditingPost(null)
    setIsCreating(false)
    setFormData({
      title: '',
      slug: '',
      content: '',
      image_url: '',
      published_date: new Date().toISOString().slice(0, 16)
    })
    setFormError(null)
    setPreviewMode(false)
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: !editingPost ? generateSlug(title) : (formData.slug || '')
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)

    try {
      const submitData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        published_date: new Date(formData.published_date).toISOString()
      }
      
      if (editingPost) {
        await blogApi.update(editingPost.id, submitData)
      } else {
        await blogApi.create(submitData)
      }
      refreshBlogPosts()
      handleCancel()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación del blog?')) return
    
    setDeleting(id)
    try {
      await blogApi.delete(id)
      refreshBlogPosts()
    } catch (error) {
      alert('Error al eliminar la publicación: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setDeleting(null)
    }
  }

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-slate-800 mb-2 mt-4">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        )
      }
      return (
        <p key={index} className="text-slate-600 mb-3 leading-relaxed">
          {paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, i) => {
            if (part.includes('</strong>')) {
              const [bold, rest] = part.split('</strong>')
              return (
                <span key={i}>
                  <strong>{bold}</strong>
                  {rest}
                </span>
              )
            }
            return <span key={i}>{part}</span>
          })}
        </p>
      )
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar las publicaciones</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={refreshBlogPosts}>Intentar de nuevo</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión del Blog</h2>
          <p className="text-slate-600 mt-1">Crea y gestiona publicaciones del blog</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Publicación
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingPost) && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingPost ? 'Editar Publicación' : 'Crear Nueva Publicación'}
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={previewMode ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!previewMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2"> {/* Keep this label */}
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Ingresa el título de la publicación"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2"> {/* Keep this label */}
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="slug-amigable-para-url"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div> {/* Keep this div */}
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Imagen Destacada
                    </label>
                    <ImageUpload
                      currentImageUrl={formData.image_url}
                      onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                      bucket="blog-images"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2"> {/* Keep this label */}
                      Fecha de Publicación *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.published_date}
                      onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2"> {/* Keep this label */}
                    Contenido *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={12}
                    placeholder="Write your blog post content here...
Escribe el contenido de tu publicación aquí...
Usa **texto** para encabezados y subtítulos.
Separa los párrafos con dos saltos de línea."
                    required
                  />
                  {/* Keep this tip */}
                  <p className="text-sm text-slate-500 mt-2"> {/* Keep this paragraph */}
                    Consejo: Usa **texto** para encabezados y separa párrafos con dobles saltos de línea.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-700 text-sm">{formError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" /> {/* Keep this spinner */}
                        {editingPost ? 'Actualizando...' : 'Creando...'}
                      </>
                    ) : (
                      editingPost ? 'Actualizar Publicación' : 'Crear Publicación'
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="prose prose-lg max-w-none">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">{formData.title}</h1>
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <div className="text-sm text-slate-500 mb-6">
                  Publicado el {formatDate(formData.published_date)}
                </div>
                <div>
                  {formatContent(formData.content)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Blog Posts List */}
      <div className="grid gap-4">
        {blogPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" /> {/* Keep this icon */}
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No se encontraron publicaciones</h3>
              <p className="text-slate-600 mb-4">Crea tu primera publicación para compartir ideas con tus estudiantes.</p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Publicación
              </Button>
            </CardContent>
          </Card>
        ) : (
          blogPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-800 line-clamp-1"> {/* Keep this heading */}
                        {post.title}
                      </h3>
                      <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        /{post.slug}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Publicado el {formatDate(post.published_date)}</span>
                      </div>
                      <div>
                        {Math.ceil(post.content.length / 1000)} min read
                      </div>
                    </div>
                    
                    <p className="text-slate-600 line-clamp-2 mb-3">
                      {post.content.substring(0, 200).replace(/\*\*/g, '')}...
                    </p>
                    
                    {post.image_url && (
                      <div className="text-sm text-slate-500">
                        <span>Imagen destacada: {post.image_url}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      title="View Post"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                      title="Edit Post"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      title="Delete Post"
                    >
                      {deleting === post.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}