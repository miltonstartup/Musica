import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, ArrowRight, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/Card'
import { Button } from '../components/Button'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { Spinner } from '../components/Spinner'
import { formatDate } from '../lib/utils'
import type { BlogPost } from '../types'

export function BlogPage() {
  const { blogPosts, loading, error } = useBlogPosts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])

  React.useEffect(() => {
    if (!blogPosts) return
    
    const filtered = searchTerm
      ? blogPosts.filter(post => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : blogPosts
    
    setFilteredPosts(filtered)
  }, [blogPosts, searchTerm])

  const getExcerpt = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No se pudieron cargar las publicaciones del blog</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-amber-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="w-16 h-16 text-amber-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-slate-800 mb-6"> {/* Keep this heading */}
            Blog de Educación Musical
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Perspectivas, consejos e inspiración para tu viaje musical. 
            Descubre artículos sobre técnica, hábitos de práctica, teoría musical y más.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative"> {/* Keep this div */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {searchTerm ? 'No se encontraron artículos' : 'No hay publicaciones de blog disponibles'} {/* Translate this */}
              </h3>
              <p className="text-slate-600">
                {searchTerm 
                  ? `No hay artículos que coincidan con "${searchTerm}". Intenta con un término de búsqueda diferente.`
                  : 'Vuelve pronto para nuevos artículos sobre educación musical y consejos de práctica.'
                }
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden"> {/* Keep this div */}
                    <img 
                      src={post.image_url || '/images/placeholders/elegant_music_education_blog_placeholder.jpg'} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center text-sm text-slate-500 mb-2"> {/* Keep this div */}
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(post.published_date)}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 line-clamp-2"> {/* Keep this heading */}
                      {post.title}
                    </h2>
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
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-amber-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Manténte Actualizado con Consejos Musicales
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Recibe los últimos artículos, consejos de práctica e ideas musicales en tu bandeja de entrada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="flex-1 px-4 py-3 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <Button variant="secondary">
              Suscribirse
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}