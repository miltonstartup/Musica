import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AdminDashboard } from './AdminDashboard'
import { ServicesManagement } from './ServicesManagement'
import { AppointmentsManagement } from './AppointmentsManagement'
import { BlogManagement } from './BlogManagement'
import { TestimonialsManagement } from './TestimonialsManagement'
import { EnhancedPaymentsManagement } from './EnhancedPaymentsManagement'
import { EnhancedMediaManagement } from './EnhancedMediaManagement'
import { MessagesManagement } from './MessagesManagement'
import { Spinner } from '../../components/Spinner'

export function AdminLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<ServicesManagement />} />
          <Route path="appointments" element={<AppointmentsManagement />} />
          <Route path="media" element={<EnhancedMediaManagement />} />
          <Route path="messages" element={<MessagesManagement />} />
          <Route path="blog" element={<BlogManagement />} />
          <Route path="testimonials" element={<TestimonialsManagement />} />
          <Route path="payments" element={<EnhancedPaymentsManagement />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  )
}