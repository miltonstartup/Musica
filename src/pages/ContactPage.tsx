import React, { useState } from 'react'
import { useContactMessages } from '../hooks/useContactMessages'
import { Button } from '../components/Button' // Keep this import
import { Card } from '../components/Card'
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Send, CheckCircle } from 'lucide-react'

type InquiryType = 'general' | 'lessons' | 'events' | 'technical'

interface ContactFormData {
  name: string
  email: string
  phone: string
  inquiry_type: InquiryType
  message: string
}

export function ContactPage() {
  const { createMessage } = useContactMessages()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    inquiry_type: 'general',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const inquiryTypes = [
    { value: 'general' as InquiryType, label: 'Consulta General' },
    { value: 'lessons' as InquiryType, label: 'Información sobre Clases' },
    { value: 'events' as InquiryType, label: 'Eventos y Recitales' },
    { value: 'technical' as InquiryType, label: 'Soporte Técnico' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setLoading(true)

    try {
      await createMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        inquiry_type: formData.inquiry_type,
      })
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiry_type: 'general',
        message: ''
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al enviar el mensaje')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim()

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Contáctanos
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          ¿Tienes preguntas sobre nuestros servicios? ¿Te gustaría agendar una clase? 
          Estamos aquí para ayudarte en tu viaje musical.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-8">
          {/* Contact Details */} {/* Keep this comment */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Información de Contacto</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">Email</p>
                  <a href="mailto:hola@armoniamusical.com" className="text-slate-600 hover:text-amber-600 transition-colors">
                    hola@armoniamusical.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">Teléfono</p>
                  <a href="tel:+5551234567" className="text-slate-600 hover:text-amber-600 transition-colors">
                    (555) 123-4567
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">Dirección</p>
                  <p className="text-slate-600">
                    Calle Música 123<br />
                    Ciudad Armonía, CP 12345
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-800">Horarios de Atención</p>
                  <div className="text-slate-600 text-sm space-y-1">
                    <p>Lunes - Viernes: 9:00 AM - 8:00 PM</p>
                    <p>Sábados: 9:00 AM - 6:00 PM</p>
                    <p>Domingos: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Social Media */}
          <Card className="p-6"> {/* Keep this Card component */}
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-amber-100 transition-colors group">
                <Facebook className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
              </a>
              <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-amber-100 transition-colors group">
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
              </a>
              <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-amber-100 transition-colors group">
                <Youtube className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
              </a>
            </div>
          </Card>

          {/* Map Placeholder */}
          <Card className="p-6"> {/* Keep this Card component */}
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Ubicación</h3>
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Mapa interactivo próximamente</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-8"> {/* Keep this Card component */}
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Envíanos un Mensaje</h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">¡Mensaje enviado con éxito!</p>
                  <p className="text-sm text-green-600">Te contactaremos pronto.</p>
                </div>
              </div>
            )}

            {(error || submitError) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error || submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-6"> {/* Keep this div */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div> {/* Keep this div */}
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Phone and Inquiry Type Row */}
              <div className="grid md:grid-cols-2 gap-6"> {/* Keep this div */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono (Opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div> {/* Keep this div */}
                  <label htmlFor="inquiry_type" className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Consulta
                  </label>
                  <select
                    id="inquiry_type"
                    name="inquiry_type"
                    value={formData.inquiry_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  >
                    {inquiryTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div> {/* Keep this div */}
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end"> {/* Keep this div */}
                <Button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Enviando...' : 'Enviar Mensaje'}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}