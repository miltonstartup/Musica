import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Mail,
  Image as ImageIcon,
  Music,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { useServices } from '../../hooks/useServices'
import { useTestimonials } from '../../hooks/useTestimonials'
import { useBlogPosts } from '../../hooks/useBlogPosts'
import { useContactMessages, useUnreadMessages } from '../../hooks/useContactMessages'
import { appointmentsApi } from '../../api/appointments'
import { paymentsApi } from '../../api/payments'

export { AdminDashboard }

function AdminDashboard() {
  const { services, loading: servicesLoading, error: servicesError } = useServices()
  const { testimonials, loading: testimonialsLoading, error: testimonialsError } = useTestimonials()
  const { blogPosts, loading: blogLoading, error: blogError } = useBlogPosts()
  const { unreadMessages, loading: messagesLoading, error: messagesError } = useUnreadMessages()

  const [appointmentsStats, setAppointmentsStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0
  })
  const [paymentsStats, setPaymentsStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    paidCount: 0,
    pendingCount: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true)
      setStatsError(null)
      try {
        // Try to fetch appointments, but don't fail if it errors
        try {
          const allAppointments = await appointmentsApi.getAll()
          const pendingAppointments = allAppointments.filter(a => a.status === 'pending').length
          const confirmedAppointments = allAppointments.filter(a => a.status === 'confirmed').length
          const cancelledAppointments = allAppointments.filter(a => a.status === 'cancelled').length

          setAppointmentsStats({
            total: allAppointments.length,
            pending: pendingAppointments,
            confirmed: confirmedAppointments,
            cancelled: cancelledAppointments
          })
        } catch (appointmentsError) {
          console.warn('Could not load appointments stats:', appointmentsError)
          setAppointmentsStats({ total: 0, pending: 0, confirmed: 0, cancelled: 0 })
        }

        // Try to fetch payment stats, but don't fail if it errors
        try {
          const paymentStatsData = await paymentsApi.getStats()
          setPaymentsStats(paymentStatsData)
        } catch (paymentsError) {
          console.warn('Could not load payments stats:', paymentsError)
          setPaymentsStats({ totalRevenue: 0, pendingAmount: 0, paidCount: 0, pendingCount: 0 })
        }

      } catch (err) {
        console.warn('General stats error:', err)
        // Don't set error state, just use default values
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [])

  // Only show loading if core data is loading
  const coreLoading = servicesLoading || testimonialsLoading || blogLoading
  const coreError = servicesError || testimonialsError || blogError

  if (coreLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (coreError) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar el panel de control</h3>
        <p className="text-slate-600 mb-4">{coreError}</p>
        <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
      </div>
    )
  }

  const adminNavItems = [
    { name: 'Servicios', path: '/admin/services', icon: Music, count: services.length },
    { name: 'Citas', path: '/admin/appointments', icon: Calendar, count: appointmentsStats.total, badge: appointmentsStats.pending > 0 ? appointmentsStats.pending : undefined },
    { name: 'Blog', path: '/admin/blog', icon: BookOpen, count: blogPosts.length },
    { name: 'Testimonios', path: '/admin/testimonials', icon: Users, count: testimonials.length },
    { name: 'Pagos', path: '/admin/payments', icon: DollarSign, count: paymentsStats.paidCount },
    { name: 'Galería', path: '/admin/media', icon: ImageIcon, count: 0 }, // Count not directly available from hook
    { name: 'Mensajes', path: '/admin/messages', icon: MessageSquare, count: unreadMessages.length, badge: unreadMessages.length > 0 ? unreadMessages.length : undefined },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Panel de Administración</h1>
      <p className="text-slate-600">Bienvenido al panel de control. Aquí puedes gestionar todo el contenido de tu sitio web.</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Citas Pendientes</p>
                <h2 className="text-3xl font-bold text-yellow-600">{appointmentsStats.pending}</h2>
              </div>
              <Calendar className="w-10 h-10 text-yellow-500" />
            </div>
            <Link to="/admin/appointments" className="text-sm text-amber-600 hover:underline mt-4 block">
              Ver todas las citas
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Mensajes No Leídos</p>
                <h2 className="text-3xl font-bold text-blue-600">{unreadMessages.length}</h2>
              </div>
              <Mail className="w-10 h-10 text-blue-500" />
            </div>
            <Link to="/admin/messages" className="text-sm text-amber-600 hover:underline mt-4 block">
              Ver todos los mensajes
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Ingresos Totales (Estimado)</p>
                <h2 className="text-3xl font-bold text-green-600">${paymentsStats.totalRevenue.toFixed(2)}</h2>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
            <Link to="/admin/payments" className="text-sm text-amber-600 hover:underline mt-4 block">
              Ver historial de pagos
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adminNavItems.map((item) => (
          <Link key={item.name} to={item.path}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-slate-800">{item.name}</h3>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {item.name === 'Citas' ? `${item.count} total` : `${item.count} elementos`}
                  </p>
                </div>
                <item.icon className="w-8 h-8 text-amber-600" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}