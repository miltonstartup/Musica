import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Star, AlertCircle, User } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { useAdminForm } from '../../hooks/useAdminForm'
import { useTestimonials } from '../../hooks/useTestimonials'
import { testimonialsApi } from '../../api/testimonials'
import { formatDate } from '../../lib/utils'
import type { Testimonial, CreateTestimonialData } from '../../types'

export function TestimonialsManagement() {
  const { testimonials, loading, error, refreshTestimonials } = useTestimonials()
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const initialFormData: CreateTestimonialData = {
    author_name: '',
    content: '',
    rating: 5
  }
  
  const {
    editingItem: editingTestimonial,
    isCreating,
    formData,
    setFormData,
    submitting,
    formError,
    handleEdit,
    handleCreate,
    handleCancel,
    handleSubmit
  } = useAdminForm<Testimonial, CreateTestimonialData>({
    initialData: initialFormData,
    createFn: testimonialsApi.create,
    updateFn: testimonialsApi.update,
    onSuccess: refreshTestimonials
  })

  const mapTestimonialToFormData = (testimonial: Testimonial): CreateTestimonialData => ({
    author_name: testimonial.author_name,
    content: testimonial.content,
    rating: testimonial.rating
  })

  const handleEditTestimonial = (testimonial: Testimonial) => {
    handleEdit(testimonial, mapTestimonialToFormData)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    
    setDeleting(id)
    try {
      await testimonialsApi.delete(id)
      refreshTestimonials()
    } catch (error) {
      alert('Error deleting testimonial: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Testimonials</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={refreshTestimonials}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Testimonials Management</h2>
          <p className="text-slate-600 mt-1">Manage student reviews and testimonials</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Testimonial
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingTestimonial) && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-800">
              {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., Sarah Johnson"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Testimonial Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={5}
                  placeholder="Write the testimonial content here..."
                  required
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
                      {editingTestimonial ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'
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

      {/* Testimonials List */}
      <div className="grid gap-4">
        {testimonials.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Testimonials Found</h3>
              <p className="text-slate-600 mb-4">Add your first testimonial to showcase student feedback.</p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Testimonial
              </Button>
            </CardContent>
          </Card>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      {[...Array(5 - testimonial.rating)].map((_, i) => (
                        <Star key={i + testimonial.rating} className="w-4 h-4 text-slate-300" />
                      ))}
                    </div>
                    
                    <blockquote className="text-slate-600 mb-4 text-lg leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {testimonial.author_name}
                        </div>
                        <div className="text-xs text-slate-400">
                          Added {formatDate(testimonial.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTestimonial(testimonial)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={deleting === testimonial.id}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {deleting === testimonial.id ? (
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