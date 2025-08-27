import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Star, BookOpen, ArrowRight, Play, Youtube, Instagram } from 'lucide-react'
import { Button } from '../components/Button'
import { Card, CardContent } from '../components/Card'
import { useServices } from '../hooks/useServices'
import { useTestimonials } from '../hooks/useTestimonials'
import { useFeaturedMedia } from '../hooks/useMediaGallery'
import { formatPrice, extractYouTubeId } from '../lib/utils'
import { BlogCarousel } from '../components/BlogCarousel'
import { Spinner } from '../components/Spinner'

export function HomePage() {
  const { services, loading: servicesLoading } = useServices()
  const { testimonials, loading: testimonialsLoading } = useTestimonials()
  const { featuredItems, loading: mediaLoading } = useFeaturedMedia()

  const featuredServices = services.slice(0, 3)
  const featuredTestimonials = testimonials.slice(0, 3)
  const featuredPhotos = featuredItems.filter(item => item.media_type === 'photo').slice(0, 4)
  const featuredVideos = featuredItems.filter(item => item.media_type === 'youtube' || item.media_type === 'video').slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-amber-50"
        style={{
          backgroundImage: 'url(/images/elegant-grand-piano-keys-close-up-dramatic-lighting.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Descubre tu Pasión Musical
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200">
            Clases personalizadas de piano, guitarra y violín para inspirar y nutrir tu viaje musical único
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservar">
              <Button size="lg" className="w-full sm:w-auto">
                <Calendar className="w-5 h-5 mr-2" />
                Reserva tu Primera Clase
              </Button>
            </Link>
            <Link to="/servicios">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-slate-800">
                Explorar Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Tu Viaje Musical Comienza Aquí
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Con más de 15 años de experiencia en instrucción musical profesional, siento pasión por 
                ayudar a estudiantes de todas las edades a descubrir la alegría y satisfacción que viene de hacer música. 
                Ya seas un principiante completo o busques refinar habilidades avanzadas, 
                proporciono instrucción personalizada que te encuentra exactamente donde estás.
              </p>
              <p className="text-lg text-slate-600 mb-8">
                Mi enfoque combina técnica tradicional con métodos de enseñanza modernos, creando 
                un ambiente de aprendizaje atractivo y de apoyo donde los estudiantes prosperan.
              </p>
              <Link to="/acerca-de">
                <Button variant="outline">
                  Conoce más sobre mí
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="/images/professional-music-teacher-piano-lesson-studio.jpg" 
                alt="Profesora de música en estudio"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-amber-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm">Años de Experiencia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery Section */}
      {!mediaLoading && featuredPhotos.length > 0 && (
        <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Galería Destacada
              </h2>
              <p className="text-lg text-slate-600">
                Momentos especiales de nuestras clases y logros estudiantiles
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredPhotos.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-md">
                  <img 
                    src={item.media_url} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-sm font-medium text-center px-2">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/galeria">
                <Button>
                  Ver Galería Completa
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Videos Section */}
      {!mediaLoading && featuredVideos.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Videos Destacados
              </h2>
              <p className="text-lg text-slate-600">
                Descubre nuestras clases y presentaciones a través de estos videos
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map((video) => {
                const isYoutube = video.media_type === 'youtube'
                const videoId = isYoutube ? extractYouTubeId(video.media_url) : null
                
                return (
                  <div key={video.id} className="group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        {isYoutube && videoId ? (
                          <div className="relative bg-black rounded-t-lg overflow-hidden">
                            <iframe
                              width="100%"
                              height="192"
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-48"
                            />
                          </div>
                        ) : isYoutube ? (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <Youtube className="w-12 h-12 text-gray-400" />
                            <span className="ml-2 text-gray-500">Video no válido</span>
                          </div>
                        ) : video.media_type === 'instagram' ? (
                          <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center rounded-t-lg">
                            <div className="text-center">
                              <Instagram className="w-12 h-12 text-pink-500 mb-2" />
                              <p className="text-sm text-slate-600 font-medium">Contenido de Instagram</p>
                            </div>
                          </div>
                        ) : (
                          <div className="relative bg-black rounded-t-lg overflow-hidden">
                            <video 
                              src={video.media_url}
                              className="w-full h-48 object-cover"
                              controls
                              preload="metadata"
                            />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-800 mb-2">{video.title}</h3>
                        {video.description && (
                          <p className="text-slate-600 text-sm line-clamp-2">{video.description}</p>
                        )}
                        {video.media_type === 'instagram' && (
                          <div className="mt-2">
                            <a 
                              href={video.media_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 transition-colors"
                            >
                              <Instagram className="w-4 h-4 mr-1" />
                              Ver en Instagram
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/galeria">
                <Button>
                  Ver Todos los Videos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Clases y Servicios Musicales
            </h2>
            <p className="text-lg text-slate-600">
              Instrucción profesional adaptada a tus aspiraciones musicales
            </p>
          </div>

          {servicesLoading ? (
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {featuredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={service.image_url || '/images/elegant_music_notes_sheet_pattern_background.jpg'} 
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {formatPrice(service.price)}
                      </div>
                      <div className="text-sm text-slate-500">
                        {service.duration_minutes} minutos
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/servicios">
              <Button>
                Ver Todos los Servicios
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Lo que Dicen los Estudiantes
            </h2>
            <p className="text-lg text-slate-600">
              Escucha de estudiantes que han descubierto su potencial musical
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-slate-600 mb-4">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="text-right">
                      <div className="font-semibold text-slate-800">
                        {testimonial.author_name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Carousel */}
      <BlogCarousel />

      {/* Call to Action */}
      <section className="py-16 bg-amber-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-amber-200" />
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Comenzar tu Viaje Musical?
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Da el primer paso hacia la realización musical. Reserva tu clase personalizada hoy 
            y descubre la alegría de hacer música.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservar">
              <Button variant="secondary" size="lg">
                Programa tu Primera Clase
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-amber-600">
                Contáctanos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}