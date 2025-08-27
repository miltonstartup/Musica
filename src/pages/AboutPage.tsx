import React from 'react'
import { Award, Music, Star, Users, Calendar, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card, CardContent } from '../components/Card'

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-amber-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-6">
                Acerca de tu Profesora de Música
              </h1>
              <p className="text-xl text-slate-600 mb-6">
                ¡Hola! Soy Sarah Michelle, una educadora musical apasionada con más de 15 años de experiencia 
                ayudando a estudiantes a descubrir el poder transformador de la música.
              </p>
              <p className="text-lg text-slate-600 mb-8">
                Mi viaje comenzó a los 5 años cuando toqué las teclas del piano por primera vez, y esa chispa 
                solo se ha vuelto más brillante a lo largo de los años. Creo que cada persona tiene potencial musical 
                esperando ser descubierto, y estoy aquí para guiarte en ese hermoso viaje.
              </p>
              <Link to="/reservar">
                <Button size="lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Comienza tu Viaje Musical
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="/images/professional-music-teacher-piano-lesson-studio.jpg" 
                alt="Profesora de música Sarah Michelle"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-amber-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm">Estudiantes Felices</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience & Credentials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Experiencia y Credenciales
            </h2>
            <p className="text-lg text-slate-600">
              Una trayectoria integral en educación y interpretación musical
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Award className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">
                  Maestría en Educación Musical
                </h3>
                <p className="text-slate-600 text-sm">
                  Berklee College of Music
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Music className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">
                  15+ Años Enseñando
                </h3>
                <p className="text-slate-600 text-sm">
                  Todas las edades y niveles
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">
                  Intérprete Profesional
                </h3>
                <p className="text-slate-600 text-sm">
                  Concertista de piano y compositora
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">
                  500+ Estudiantes Enseñados
                </h3>
                <p className="text-slate-600 text-sm">
                  De principiantes a avanzados
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-amber-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Mi Filosofía de Enseñanza
            </h2>
            <p className="text-lg text-slate-600">
              La educación musical debe ser alegre, desafiante y profundamente personal
            </p>
          </div>

          <div className="prose prose-lg mx-auto text-slate-600">
            <p>
              Creo que cada estudiante es único, con sus propios intereses musicales, estilo de aprendizaje 
              y metas. Mi enfoque es encontrar a cada estudiante donde está y guiarlo hacia donde 
              quiere estar, fomentando tanto la habilidad técnica como la expresión creativa.
            </p>
            
            <p>
              Ya seas un niño de 5 años tomando su primera lección de piano o un adulto de 50 años 
              persiguiendo finalmente el sueño de toda la vida de aprender violín, creo un ambiente de apoyo donde 
              los errores son oportunidades de aprendizaje y cada pequeño éxito se celebra.
            </p>
            
            <p>
              La música tiene el poder de mejorar el desarrollo cognitivo, la expresión emocional y la 
              conexión social. A través de orientación paciente, apoyo alentador e instrucción personalizada, 
              ayudo a mis estudiantes no solo a aprender a tocar música, sino a entenderla y amarla verdaderamente.
            </p>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Áreas de Especialización
            </h2>
            <p className="text-lg text-slate-600">
              Instrucción integral en múltiples instrumentos y disciplinas musicales
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Instrumentos</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                  Piano (Clásico, Jazz, Popular)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                  Guitarra (Acústica, Eléctrica, Clásica)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                  Violín (Clásico, Folk, Contemporáneo)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                  Teoría Musical y Composición
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Tipos de Estudiantes</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                  Niños (5+ años) - Construyendo habilidades fundamentales
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                  Adolescentes - Preparándose para audiciones y competencias
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                  Adultos - Regresando a la música o empezando de nuevo
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                  Adultos mayores - Aprendizaje de por vida y beneficios cognitivos
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Hagamos Música Juntos
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Estoy emocionada de conocer tus metas musicales y ayudarte a alcanzarlas. 
            Todo gran músico comenzó con una sola lección.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservar">
              <Button variant="secondary" size="lg">
                Agenda tu Primera Lección
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-amber-600">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}