import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Calendar, User, CheckCircle, XCircle, AlertCircle, Filter, Clock } from 'lucide-react' // Keep these imports
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { formatDate } from '../../lib/utils'
import { paymentsApi } from '../../api/payments'
import { appointmentsApi } from '../../api/appointments'
import { formatPrice, formatTime } from '../../lib/utils'
import type { Payment, Appointment } from '../../types'

type FilterStatus = 'all' | 'pending' | 'completed' | 'failed' | 'cancelled'

export { EnhancedPaymentsManagement }

function EnhancedPaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [paymentsData, appointmentsData] = await Promise.all([
        paymentsApi.getAll(),
        appointmentsApi.getAll()
      ])
      setPayments(paymentsData)
      setAppointments(appointmentsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar los pagos.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (paymentId: string, status: 'completed' | 'pending' | 'cancelled' | 'failed') => {
    const actionVerb = status === 'completed' ? 'completar' : status === 'cancelled' ? 'cancelar' : status === 'failed' ? 'marcar como fallido' : 'marcar como pendiente';
    if (!confirm(`¿Estás seguro de que quieres ${actionVerb} este pago?`)) return
    
    setUpdatingStatus(paymentId)
    try {
      await paymentsApi.updateStatus(paymentId, status)
      await loadData() // Refresh data
    } catch (error) {
      alert('Error al actualizar el pago: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getAppointmentDetails = (appointmentId: string | null) => {
    if (!appointmentId) return { clientName: 'N/A', appointmentDate: 'N/A', appointmentTime: 'N/A' }
    const appointment = appointments.find(apt => apt.id === appointmentId)
    return {
      clientName: appointment?.client_name || 'Cliente Desconocido',
      appointmentDate: appointment?.appointment_date ? formatDate(appointment.appointment_date) : 'N/A',
      appointmentTime: appointment?.appointment_time ? formatTime(appointment.appointment_time) : 'N/A'
    }
  }

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true
    return payment.status === filter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100'
      case 'failed':
      case 'cancelled':
        return 'text-red-700 bg-red-100'
      default:
        return 'text-yellow-700 bg-yellow-100'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar los pagos</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={loadData}>Intentar de nuevo</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Pagos</h2>
          <p className="text-slate-600 mt-1">Revisa y gestiona el historial de pagos de las lecciones</p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterStatus)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Todos los Pagos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
            <option value="failed">Fallidos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">
              {formatPrice(payments.reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <div className="text-sm text-slate-600">Total Recaudado</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-slate-600">Pagos Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-slate-600">Pagos Completados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {payments.filter(p => p.status === 'failed' || p.status === 'cancelled').length}
            </div>
            <div className="text-sm text-slate-600">Pagos Fallidos/Cancelados</div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <div className="grid gap-4">
        {filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {filter === 'all' ? 'No se encontraron pagos' : `No hay pagos ${filter}`}
              </h3>
              <p className="text-slate-600">
                {filter === 'all' 
                  ? 'El historial de pagos aparecerá aquí.'
                  : `No se encontraron pagos con estado "${filter}".`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment) => {
            const appointmentDetails = getAppointmentDetails(payment.appointment_id)
            return (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {appointmentDetails.clientName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                            <span>Monto: <span className="font-semibold text-green-600">{formatPrice(payment.amount)}</span></span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            <span>Fecha de Pago: {formatDate(payment.payment_date)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" />
                            <span>Cita: {appointmentDetails.appointmentDate} a las {appointmentDetails.appointmentTime}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-slate-400" />
                            <span>Método: {payment.payment_method || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      {payment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(payment.id, 'completed')}
                          disabled={updatingStatus === payment.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {updatingStatus === payment.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Completar
                            </>
                          )}
                        </Button>
                      )}
                      {payment.status !== 'cancelled' && payment.status !== 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(payment.id, 'cancelled')}
                          disabled={updatingStatus === payment.id}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                      {payment.status !== 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(payment.id, 'pending')}
                          disabled={updatingStatus === payment.id}
                          className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Marcar Pendiente
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}