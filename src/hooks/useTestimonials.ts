import { useState, useEffect } from 'react'
import { Testimonial } from '../types'
import { testimonialsApi } from '../api/testimonials'

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const data = await testimonialsApi.getAll()
      setTestimonials(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const refreshTestimonials = () => {
    loadTestimonials()
  }

  return { testimonials, loading, error, refreshTestimonials }
}