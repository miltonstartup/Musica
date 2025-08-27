import React from 'react'
import { Clock, DollarSign, Calendar } from 'lucide-react'
import { Button } from '../components/Button' // Keep this import
import { Card, CardContent, CardHeader } from '../components/Card'
import { useServices } from '../hooks/useServices'
import { Spinner } from '../components/Spinner'
import { formatPrice } from '../lib/utils'
import { Link } from 'react-router-dom'
export function ServicesPage() {
  const { services, loading, error } = useServices()

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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No se pudieron cargar los servicios</h2>
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
          <h1 className="text-4xl font-bold text-slate-800 mb-6"> {/* Keep this heading */}
            Clases y Servicios Musicales
          </h1>
          <p className="text-xl text-slate-600">
            Instrucción profesional adaptada a tu viaje musical. 
            Elige entre lecciones individuales o programas integrales diseñados para ayudarte a alcanzar tus metas musicales.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={service.image_url || '/images/elegant_music_notes_sheet_pattern_background.jpg'} /* Keep this image source */
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <CardHeader>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {service.name} {/* Keep this heading */}
                  </h2>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 text-slate-600"> {/* Keep this div */}
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span>{service.duration_minutes} minutos</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-2xl text-amber-600">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-slate-500">por lección</span> {/* Keep this span */}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Link to="/reservar">
                      <Button className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Reservar esta Clase
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Qué se Incluye en Cada Lección {/* Keep this heading */}
            </h2>
            <p className="text-lg text-slate-600">
              Cada sesión personalizada incluye todo lo que necesitas para progresar con confianza
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> {/* Keep this div */}
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Instrucción Personalizada
              </h3>
              <p className="text-slate-600">
                Cada lección se adapta a tu estilo de aprendizaje individual, ritmo e intereses musicales
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> {/* Keep this div */}
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Horarios Flexibles
              </h3>
              <p className="text-slate-600">
                Elige horarios de lección que funcionen con tu agenda, incluyendo tardes y fines de semana
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> {/* Keep this div */}
                <DollarSign className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Todos los Materiales Incluidos
              </h3>
              <p className="text-slate-600">
                Partituras, ejercicios de práctica y recursos de aprendizaje están incluidos en cada lección
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Comenzar tu Viaje Musical?
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Reserva tu primera lección hoy y da el primer paso hacia alcanzar tus metas musicales.
          </p>
          <Link to="/reservar">
            <Button variant="secondary" size="lg">
              Agenda tu Lección Ahora
              <Calendar className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}