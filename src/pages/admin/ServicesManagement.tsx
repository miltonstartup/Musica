import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card'
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
    if (!confirm('Are you sure you want to delete this service?')) return
    
    setDeleting(id)
    try {
      await servicesApi.delete(id)
      refreshServices()
    } catch (error) {
      alert('Error deleting service: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Services</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={refreshServices}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Services Management</h2>
          <p className="text-slate-600 mt-1">Manage your music lesson offerings and pricing</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingService) && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-800">
              {editingService ? 'Edit Service' : 'Create New Service'}
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., Piano Lessons"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="75.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="60"
                    min="15"
                    step="15"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Image
                  </label>
                  <ImageUpload
                    currentImageUrl={formData.image_url}
                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    bucket="service-images"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={4}
                  placeholder="Describe what students will learn in this service..."
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
                      {editingService ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingService ? 'Update Service' : 'Create Service'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
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
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Services Found</h3>
              <p className="text-slate-600 mb-4">Create your first service to get started.</p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-slate-800">{service.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-semibold">{formatPrice(service.price)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-blue-600" />
                          <span>{service.duration_minutes} minutes</span>
                        </div>
                      </div>
                    </div>
                    {service.description && (
                      <p className="text-slate-600 mb-3 line-clamp-2">{service.description}</p>
                    )}
                    {service.image_url && (
                      <div className="text-sm text-slate-500">
                        <span>Image: {service.image_url}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
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