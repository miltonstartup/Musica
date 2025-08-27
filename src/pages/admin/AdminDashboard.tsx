import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { BarChart3, Calendar, FileText, Star, Users, DollarSign, Image, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Link } from 'react-router-dom'
import { servicesApi } from '../../api/services'
import { appointmentsApi } from '../../api/appointments'
import { testimonialsApi } from '../../api/testimonials'
import { paymentsApi } from '../../api/payments'
import { contactMessagesApi } from '../../api/contact-messages'
import { Spinner } from '../../components/Spinner'

export function AdminDashboard() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 0,
    weeklyAppointments: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    unreadMessages: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    try {
      setStatsLoading(true)
      
      // Get all data in parallel
      const [appointments, payments, testimonials, messages] = await Promise.all([
        appointmentsApi.getAll(),
        paymentsApi.getAll(),
        testimonialsApi.getAll(),
        contactMessagesApi.getUnread()
      ])

      // Calculate stats
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const weeklyAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointment_date)
        return aptDate >= weekStart
      }).length

      const monthlyRevenue = payments.filter(payment => {
        const paymentDate = new Date(payment.payment_date)
        return paymentDate >= monthStart && payment.status === 'completed'
      }).reduce((sum, payment) => sum + payment.amount, 0)

      const totalStudents = new Set(appointments.map(apt => apt.client_email)).size

      const averageRating = testimonials.length > 0 
        ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length 
        : 0

      setStats({
        totalStudents,
        weeklyAppointments,
        monthlyRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
        unreadMessages: messages.length
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const dashboardItems = [
    {
      title: 'Gestión de Servicios',
      description: 'Agregar, editar y gestionar tus servicios musicales y precios',
      icon: FileText,
      link: '/admin/services',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Citas',
      description: 'Ver y gestionar las reservas de clases de estudiantes',
      icon: Calendar,
      link: '/admin/appointments',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Galería Multimedia',
      description: 'Administrar fotos, videos y contenido de redes sociales',
      icon: Image,
      link: '/admin/media',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      title: 'Mensajes de Contacto',
      description: 'Gestionar y responder a mensajes de contacto',
      icon: MessageSquare,
      link: '/admin/messages',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Gestión del Blog',
      description: 'Crear y gestionar publicaciones del blog',
      icon: FileText,
      link: '/admin/blog',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Testimonios',
      description: 'Gestionar testimonios y reseñas de estudiantes',
      icon: Star,
      link: '/admin/testimonials',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Seguimiento de Pagos',
      description: 'Rastrear y gestionar pagos de lecciones',
      icon: DollarSign,
      link: '/admin/payments',
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Análisis',
      description: 'Ver informes y estadísticas',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Panel de Administración</h1>
              <p className="text-slate-600 mt-1">¡Bienvenido de vuelta! Gestiona tu negocio de enseñanza musical.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">
                  Ver Sitio Web
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Estudiantes</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {statsLoading ? <Spinner size="sm" /> : stats.totalStudents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Esta Semana</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {statsLoading ? <Spinner size="sm" /> : stats.weeklyAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Ingresos Mensuales</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {statsLoading ? <Spinner size="sm" /> : `$${stats.monthlyRevenue.toFixed(0)}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Calificación Prom.</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {statsLoading ? <Spinner size="sm" /> : stats.averageRating || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Card key={item.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${item.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    {item.description}
                  </p>
                  <Link to={item.link}>
                    <Button className="w-full">
                      Gestionar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}