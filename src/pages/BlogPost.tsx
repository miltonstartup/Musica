import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom' // Keep this import
import { Calendar, BookOpen, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/Card'
import { Button } from '../components/Button'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { Spinner } from '../components/Spinner'
import { formatDate } from '../lib/utils'
import { blogApi } from '../api/blog'
import type { BlogPost as BlogPostType } from '../types'

export { BlogPost }

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('No se encontró el slug de la publicación.')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const fetchedPost = await blogApi.getBySlug(slug)
        if (fetchedPost) {
          setPost(fetchedPost)
        } else {
          setError('Publicación no encontrada.')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la publicación.')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-2xl font-bold text-slate-800 mb-4 mt-6">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        )
      }
      return (
        <p key={index} className="text-lg text-slate-700 mb-4 leading-relaxed">
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
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link to="/blog">
            <Button>Volver al Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Publicación no encontrada</h2>
          <p className="text-slate-600 mb-6">La publicación que buscas no existe o ha sido eliminada.</p>
          <Link to="/blog">
            <Button>Volver al Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-amber-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="w-16 h-16 text-amber-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-slate-800 mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center text-slate-600 text-lg">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Publicado el {formatDate(post.published_date)}</span>
          </div>
        </div>
      </section>

      {/* Blog Post Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}
          <div className="prose max-w-none">
            {formatContent(post.content)}
          </div>
          <div className="mt-12 text-center">
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Todas las Publicaciones
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}