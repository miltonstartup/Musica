import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, DollarSign, Calendar, AlertCircle, CheckCircle, User, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { formatPrice, formatDate } from '../../lib/utils'
import { paymentsApi } from '../../api/payments'
import type { Payment, CreatePaymentData } from '../../types'

type PaymentFormData = {
  appointment_id: string
  amount: number
  payment_method: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  notes: string
}

const initialFormData: PaymentFormData = {
  appointment_id: '',
  amount: 0,
  payment_method: 'cash',
  status: 'pending',
  notes: ''
}

const paymentMethods = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta de Crédito/Débito' },
  { value: 'bank_transfer', label: 'Transferencia Bancaria' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other', label: 'Otro' }
]

const paymentStatuses = [
  { value: 'pending', label: 'Pendiente', color: 'text-yellow-700 bg-yellow-100' },
  { value: 'completed', label: 'Completado', color: 'text-green-700 bg-green-100' },
  { value: 'failed', label: 'Fallido', color: 'text-red-700 bg-red-100' },
  { value: 'cancelled', label: 'Cancelado', color: 'text-gray-700 bg-gray-100' }
]

export function EnhancedPaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await paymentsApi.getAll()
      setPayments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pagos')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment)
    setFormData({
      appointment_id: payment.appointment_id || '',
      amount: payment.amount,
      payment_method: payment.payment_method || 'cash',
      status: payment.status,
      notes: payment.notes || ''
    })
    setIsCreating(false)
    setFormError(null)
  }

  const handleCreate = () => {
    setEditingPayment(null)
    setFormData(initialFormData)
    setIsCreating(true)
    setFormError(null)
  }

  const handleCancel = () => {
    setEditingPayment(null)
    setIsCreating(false)
    setFormData(initialFormData)
    setFormError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)

    try {
      const paymentData: CreatePaymentData = {
        appointment_id: formData.appointment_id || undefined,
        amount: formData.amount,
        payment_method: formData.payment_method,
        status: formData.status,
        notes: formData.notes
      }

      if (editingPayment) {
        await paymentsApi.update(editingPayment.id, paymentData)
      } else {
        await paymentsApi.create(paymentData)
      }
      await loadPayments()
      handleCancel()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Error al procesar el pago')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este registro de pago?')) return
    
    setDeleting(id)
    try {
      await paymentsApi.delete(id)
      await loadPayments()
    } catch (error) {
      alert('Error al eliminar pago: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setDeleting(null)
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'completed' | 'failed' | 'cancelled') => {
    try {
      await paymentsApi.updateStatus(id, newStatus)
      await loadPayments()
    } catch (error) {
      alert('Error al actualizar estado: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    }
  }

  const getStatusDisplay = (status: string) => {
    const statusConfig = paymentStatuses.find(s => s.value === status)
    return statusConfig || { value: status, label: status, color: 'text-gray-700 bg-gray-100' }
  }

  const filteredPayments = payments.filter(payment => 
    filterStatus === 'all' || payment.status === filterStatus
  )

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const thisMonthRevenue = payments.filter(p => 
    p.status === 'completed' && 
    new Date(p.payment_date).getMonth() === new Date().getMonth()
  ).reduce((sum, p) => sum + p.amount, 0)

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Pagos</h2>
          <p className="text-slate-600 mt-1">Administra y rastrea todos los pagos de clases</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Registrar Pago
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Payment Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-slate-800">{formatPrice(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Este Mes</p>
                <p className="text-2xl font-bold text-slate-800">{formatPrice(thisMonthRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Pendientes</p>
                <p className="text-2xl font-bold text-slate-800">{formatPrice(pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Pagos</p>
                <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">Filtrar por estado:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">Todos los pagos</option>
          {paymentStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingPayment) && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-800">
              {editingPayment ? 'Editar Pago' : 'Registrar Nuevo Pago'}
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID de Cita (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.appointment_id}
                    onChange={(e) => setFormData({ ...formData, appointment_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="ID de la cita relacionada"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monto *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Método de Pago *
                  </label>
                  <select
                    required
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'completed' | 'failed' | 'cancelled' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {paymentStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                  placeholder="Notas adicionales sobre el pago..."
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm">{formError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      {editingPayment ? 'Actualizando...' : 'Registrando...'}
                    </>
                  ) : (
                    editingPayment ? 'Actualizar Pago' : 'Registrar Pago'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Payments List */}
      <div className="grid gap-4">
        {filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {filterStatus === 'all' ? 'No hay pagos registrados' : `No hay pagos con estado "${getStatusDisplay(filterStatus).label}"`}
              </h3>
              <p className="text-slate-600 mb-4">
                {filterStatus === 'all' 
                  ? 'Comienza registrando el primer pago de una clase.'
                  : 'Intenta cambiar el filtro para ver otros pagos.'
                }
              </p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primer Pago
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment) => {
            const statusConfig = getStatusDisplay(payment.status)
            return (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 text-slate-400 mr-2" />
                          <span className="text-lg font-semibold text-slate-800">
                            {formatPrice(payment.amount)}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div>
                          <p className="font-medium text-slate-800">Método de Pago</p>
                          <p>{paymentMethods.find(m => m.value === payment.payment_method)?.label || payment.payment_method}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">Fecha de Pago</p>
                          <p>{formatDate(payment.payment_date)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">ID de Cita</p>
                          <p>{payment.appointment_id || 'No especificado'}</p>
                        </div>
                      </div>
                      
                      {payment.notes && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-md">
                          <p className="text-sm text-slate-600">
                            <strong>Notas:</strong> {payment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      {payment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(payment.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Marcar Pagado
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(payment)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(payment.id)}
                        disabled={deleting === payment.id}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        {deleting === payment.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
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
