import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react' // Keep these imports
import { Card, CardContent, CardHeader } from '../components/Card'
import { Button } from '../components/Button'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { Spinner } from '../components/Spinner'
import { formatDate } from '../lib/utils'

export { BlogCarousel }

function BlogCarousel() {
  const { blogPosts, loading, error } = useBlogPosts()

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  const featuredPosts = blogPosts.slice(0, 3) // Display up to 3 latest posts

  if (loading) {
    return (
      <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12">
            Últimas Publicaciones del Blog
          </h2>
          <Spinner size="lg" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12">
            Últimas Publicaciones del Blog
          </h2>
          <p className="text-red-600">Error al cargar las publicaciones del blog: {error}</p>
        </div>
      </section>
    )
  }

  if (featuredPosts.length === 0) {
    return null // Don't render section if no posts
  }

  return (
    <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Últimas Publicaciones del Blog
          </h2>
          <p className="text-lg text-slate-600">
            Mantente al día con nuestros consejos y perspectivas musicales
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image_url || '/images/placeholders/elegant_music_education_blog_placeholder.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center text-sm text-slate-500 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.published_date)}
                </div>
                <h3 className="text-xl font-bold text-slate-800 line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 line-clamp-4">
                  {getExcerpt(post.content.replace(/\*\*([^*]+)\*\*/g, '$1'))}
                </p>
                <Link to={`/blog/${post.slug}`}>
                  <Button variant="outline" className="w-full">
                    Leer Más
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/blog">
            <Button>
              Ver Todas las Publicaciones
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}