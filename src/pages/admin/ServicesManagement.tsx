import React, { useState } from 'react'
import { Plus, Edit2, Trash2, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card' // Keep this import
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { ImageUpload } from '../../components/ImageUpload'
import { useAdminForm } from '../../hooks/useAdminForm'
import { useServices } from '../../hooks/useServices'
import { servicesApi } from '../../api/services'
import { formatPrice } from '../../lib/utils'
import type { Service, CreateServiceData } from '../../types'

export function ServicesManagement() {
  const { services, loading, error, refreshServices } = useServices()
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const initialFormData: CreateServiceData = {
    name: '',
    description: '',
    price: 0,
    duration_minutes: 60,
    image_url: ''
  }
  
  const {
    editingItem: editingService,
    isCreating,
    formData,
    setFormData,
    submitting,
    formError,
    handleEdit,
    handleCreate,
    handleCancel,
    handleSubmit
  } = useAdminForm<Service, CreateServiceData>({
    initialData: initialFormData,
    createFn: servicesApi.create,
    updateFn: servicesApi.update,
    onSuccess: refreshServices
  })

  const mapServiceToFormData = (service: Service): CreateServiceData => ({
    name: service.name,
    description: service.description || '',
    price: service.price,
    duration_minutes: service.duration_minutes,
    image_url: service.image_url || ''
  })

  const handleEditService = (service: Service) => {
    handleEdit(service, mapServiceToFormData)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return
    
    setDeleting(id)
    try {
      await servicesApi.delete(id)
      refreshServices()
    } catch (error) {
      alert('Error al eliminar el servicio: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setDeleting(null)
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
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar los servicios</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={refreshServices}>Intentar de nuevo</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Servicios</h2>
          <p className="text-slate-600 mt-1">Administra tus ofertas de clases de música y precios</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Nuevo Servicio
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingService) && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-800"> {/* Keep this heading */}
              {editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2"> {/* Keep this label */}
                    Nombre del Servicio *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Ej: Clases de Piano"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2"> {/* Keep this label */}
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="75.00" // Keep as is, it's a numerical example
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div> {/* Keep this div */}
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duración (minutos) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="60" // Keep as is, it's a numerical example
                    min="15"
                    step="15"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2"> {/* Keep this label */}
                    Imagen del Servicio
                  </label>
                  <div className="space-y-2">
                    <ImageUpload
                      currentImageUrl={formData.image_url}
                      onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                      bucket="service-images"
                      allowUrlInput={true}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2"> {/* Keep this label */}
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={4}
                  placeholder="Describe lo que los estudiantes aprenderán en este servicio..."
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
                      {editingService ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    editingService ? 'Actualizar Servicio' : 'Crear Servicio'
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

      {/* Services List */}
      <div className="grid gap-4">
        {services.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No se encontraron servicios</h3>
              <p className="text-slate-600 mb-4">Crea tu primer servicio para empezar.</p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Servicio
              </Button>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-3"> {/* Adjusted for better responsiveness */}
                      <h3 className="text-xl font-semibold text-slate-800">{service.name}</h3> {/* Keep this heading */}
                      <div className="flex items-center gap-2 text-sm text-slate-600"> {/* Adjusted gap */}
                        <div className="flex items-center"> {/* Keep this div */}
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-semibold">{formatPrice(service.price)}</span>
                        </div>
                        <div className="flex items-center"> {/* Keep this div */}
                          <Clock className="w-4 h-4 mr-1 text-blue-600" />
                          <span>{service.duration_minutes} minutos</span>
                        </div>
                      </div>
                    </div>
                    {service.description && ( /* Keep this conditional rendering */
                      <p className="text-slate-600 mb-3 line-clamp-2">{service.description}</p>
                    )}
                    {service.image_url && (
                      <div className="text-sm text-slate-500">
                        <span>Image: {service.image_url}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      disabled={deleting === service.id}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {deleting === service.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}