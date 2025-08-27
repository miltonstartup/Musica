import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { BarChart3, Calendar, FileText, Star, Users, DollarSign, Image, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Link } from 'react-router-dom'

export function AdminDashboard() {
  const { user, loading } = useAuth()

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
                  <p className="text-2xl font-bold text-slate-800">124</p>
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
                  <p className="text-2xl font-bold text-slate-800">18</p>
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
                  <p className="text-2xl font-bold text-slate-800">$3,420</p>
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
                  <p className="text-2xl font-bold text-slate-800">4.9</p>
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