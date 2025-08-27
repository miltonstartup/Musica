import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Music, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/Card'
import { Button } from '../components/Button'
import { Spinner } from '../components/Spinner'
import { formatDate } from '../lib/utils'

export { AboutPage }

function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-amber-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">
            Acerca de Mí
          </h1>
          <p className="text-xl text-slate-600">
            Mi pasión es inspirar el amor por la música en estudiantes de todas las edades.
          </p>
        </div>
      </section>

      {/* Teacher Biography */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Music Teacher Portrait"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
            <div className="absolute -bottom-4 -right-4 bg-amber-600 text-white p-4 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm">Años de Experiencia</div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Mi Viaje Musical y Filosofía de Enseñanza
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Desde una edad temprana, la música ha sido el centro de mi vida. Comencé mis estudios de piano a los cinco años y desde entonces, mi amor por el arte musical no ha hecho más que crecer. Obtuve mi licenciatura en Interpretación Musical de la prestigiosa Universidad de Música, donde me especialicé en piano y teoría musical.
            </p>
            <p className="text-lg text-slate-600 mb-6">
              Mi filosofía de enseñanza se centra en crear un ambiente de aprendizaje positivo, alentador y personalizado. Creo firmemente que cada estudiante es único, con sus propias fortalezas, desafíos y aspiraciones. Por ello, adapto mis métodos para satisfacer las necesidades individuales, fomentando no solo la habilidad técnica, sino también la creatividad, la expresión y el disfrute de la música.
            </p>
            <p className="text-lg text-slate-600 mb-8">
              Me dedico a nutrir el potencial musical de cada estudiante, ayudándoles a desarrollar una base sólida en técnica, teoría y musicalidad, mientras cultivan una pasión duradera por la música.
            </p>
            <Link to="/contacto">
              <Button variant="primary">
                Contáctame
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Credentials and Experience */}
      <section className="py-16 bg-amber-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Credenciales y Experiencia
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Una sólida formación académica y años de experiencia práctica.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Award className="w-16 h-16 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Educación Formal
              </h3>
              <p className="text-slate-600">
                Licenciatura en Interpretación Musical, Universidad de Música.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Music className="w-16 h-16 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Experiencia Docente
              </h3>
              <p className="text-slate-600">
                Más de 15 años enseñando piano, guitarra, violín y teoría musical.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="w-16 h-16 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Desarrollo Profesional
              </h3>
              <p className="text-slate-600">
                Participación continua en talleres y seminarios de pedagogía musical.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Empezar tu Viaje Musical?
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Da el primer paso hacia la realización musical. Reserva tu clase personalizada hoy.
          </p>
          <Link to="/reservar">
            <Button variant="secondary" size="lg">
              Agenda tu Primera Clase
              <Calendar className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}