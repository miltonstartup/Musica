import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Button } from '../components/Button'
import { Card, CardContent, CardHeader } from '../components/Card'
import { useServices } from '../hooks/useServices'
import { appointmentsApi } from '../api/appointments'
import { formatTime, formatDate } from '../lib/utils'
import { Spinner } from '../components/Spinner'

const bookingSchema = z.object({
  client_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  client_email: z.string().email('Por favor ingresa una dirección de correo válida'),
  service_id: z.string().min(1, 'Por favor selecciona un servicio'),
  notes: z.string().optional()
})

type BookingFormData = z.infer<typeof bookingSchema>

export function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  
  const { services, loading: servicesLoading } = useServices()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  })

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime('')
    
    if (date) {
      setLoadingSlots(true)
      try {
        const dateStr = date.toISOString().split('T')[0]
        const slots = await appointmentsApi.getAvailableSlots(dateStr)
        setAvailableSlots(slots)
      } catch (error) {
        console.error('Error loading available slots:', error)
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    } else {
      setAvailableSlots([])
    }
  }

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      setBookingError('Por favor selecciona una fecha y hora')
      return
    }

    setSubmitting(true)
    setBookingError(null)

    try {
      const selectedService = services.find(s => s.id === data.service_id)
      if (!selectedService) {
        throw new Error('Servicio seleccionado no encontrado')
      }

      const appointmentDate = selectedDate.toISOString().split('T')[0]

      await appointmentsApi.create({
        client_name: data.client_name,
        client_email: data.client_email,
        appointment_date: appointmentDate,
        appointment_time: selectedTime,
        service_id: data.service_id,
        notes: data.notes
      })

      setBookingSuccess(true)
      reset()
      setSelectedDate(undefined)
      setSelectedTime('')
      setAvailableSlots([])
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Fallo al reservar la cita')
    } finally {
      setSubmitting(false)
    }
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              ¡Solicitud de Reserva Enviada!
            </h2>
            <p className="text-slate-600 mb-6">
              Gracias por tu solicitud de reserva. Revisaré tu solicitud y me pondré en contacto contigo 
              dentro de 24 horas para confirmar tu lección.
            </p>
            <Button 
              onClick={() => setBookingSuccess(false)}
              className="w-full"
            >
              Reservar Otra Lección
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">
            Agenda tu Lección de Música
          </h1>
          <p className="text-xl text-slate-600">
            Elige tu fecha, hora y servicio preferido para reservar tu lección de música personalizada.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendar Selection */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-amber-600" />
                    Selecciona una Fecha
                  </h2>
                </CardHeader>
                <CardContent>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={[isPastDate, isWeekend]}
                    className="mx-auto"
                    classNames={{
                      day_selected: 'bg-amber-600 text-white hover:bg-amber-700',
                      day_today: 'text-amber-600 font-bold',
                      day: 'hover:bg-amber-50'
                    }}
                  />
                  <div className="mt-4 text-sm text-slate-600">
                    <p>• Lecciones disponibles de lunes a viernes</p>
                    <p>• Horarios de fin de semana pueden estar disponibles bajo petición</p>
                  </div>
                </CardContent>
              </Card>

              {/* Time & Service Selection */}
              <div className="space-y-6">
                {/* Time Selection */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-amber-600" />
                      Selecciona una Hora
                    </h2>
                  </CardHeader>
                  <CardContent>
                    {!selectedDate ? (
                      <p className="text-slate-500 text-center py-8">
                        Por favor selecciona una fecha primero
                      </p>
                    ) : loadingSlots ? (
                      <div className="flex justify-center py-8">
                        <Spinner />
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">
                        No hay horarios disponibles para {formatDate(selectedDate)}
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`p-2 text-sm rounded border transition-colors ${
                              selectedTime === slot
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-amber-600 hover:text-amber-600'
                            }`}
                          >
                            {formatTime(slot)}
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Service Selection */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-slate-800">
                      Seleccionar Servicio
                    </h2>
                  </CardHeader>
                  <CardContent>
                    {servicesLoading ? (
                      <div className="flex justify-center py-4">
                        <Spinner />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {services.map((service) => (
                          <label key={service.id} className="flex items-center p-3 border rounded hover:bg-amber-50 cursor-pointer">
                            <input
                              type="radio"
                              value={service.id}
                              {...register('service_id')}
                              className="mr-3 text-amber-600 focus:ring-amber-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-slate-800">{service.name}</div>
                              <div className="text-sm text-slate-600">
                                ${service.price} • {service.duration_minutes} minutos
                              </div>
                            </div>
                          </label>
                        ))}
                        {errors.service_id && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.service_id.message}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Student Information */}
            <Card className="mt-8">
              <CardHeader>
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <User className="w-5 h-5 mr-2 text-amber-600" />
                  Información del Estudiante
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre del Estudiante *
                    </label>
                    <input
                      type="text"
                      {...register('client_name')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Ingresa el nombre completo del estudiante"
                    />
                    {errors.client_name && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.client_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Dirección de Correo *
                    </label>
                    <input
                      type="email"
                      {...register('client_email')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Ingresa la dirección de correo"
                    />
                    {errors.client_email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.client_email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Notas Adicionales (Opcional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Cualquier meta específica, nivel de experiencia o solicitudes especiales..."
                  />
                </div>

                {bookingError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-700 text-sm">{bookingError}</p>
                  </div>
                )}

                <div className="mt-6">
                  <Button 
                    type="submit" 
                    disabled={submitting || !selectedDate || !selectedTime}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Enviando Solicitud...
                      </>
                    ) : (
                      'Enviar Solicitud de Reserva'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </div>
  )
}