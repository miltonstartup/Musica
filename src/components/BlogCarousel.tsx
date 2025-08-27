import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent } from './Card'
import { Button } from './Button'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { formatDate } from '../lib/utils'

export function BlogCarousel() {
  const { blogPosts, loading } = useBlogPosts()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visiblePosts, setVisiblePosts] = useState(3)

  // Responsive carousel - adjust visible posts based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisiblePosts(1)
      } else if (window.innerWidth < 1024) {
        setVisiblePosts(2)
      } else {
        setVisiblePosts(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (loading || !blogPosts || blogPosts.length === 0) {
    return null
  }

  const maxSlides = Math.max(0, blogPosts.length - visiblePosts)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1))
  }

  const getExcerpt = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  return (
    <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Últimos Artículos del Blog
          </h2>
          <p className="text-lg text-slate-600">
            Descubre insights, consejos y cultura musical en nuestros artículos más recientes
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / visiblePosts)}%)`
              }}
            >
              {blogPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className={`flex-shrink-0 px-3`}
                  style={{ width: `${100 / visiblePosts}%` }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image_url || '/images/placeholders/elegant_music_education_blog_placeholder.jpg'} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <CardContent className="p-6 flex flex-col justify-between h-64">
                      <div>
                        <div className="flex items-center text-sm text-slate-500 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(post.published_at)}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                          {getExcerpt(post.content.replace(/\*\*([^*]+)\*\*/g, '$1'))}
                        </p>
                        {formatDate(post.published_date)}
                      </div>
                      
                      <Link to={`/blog/${post.slug}`} className="mt-auto">
                        <Button variant="outline" size="sm" className="w-full">
                          Leer Artículo
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {blogPosts.length > visiblePosts && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 hover:border-amber-300 z-10"
                aria-label="Artículo anterior"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 hover:border-amber-300 z-10"
                aria-label="Siguiente artículo"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </>
          )}

          {/* Slide Indicators */}
          {blogPosts.length > visiblePosts && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxSlides + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentSlide ? 'bg-amber-600' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Ir al slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Blog Posts Link */}
        <div className="text-center mt-8">
          <Link to="/blog">
            <Button>
              Ver Todos los Artículos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogCarousel