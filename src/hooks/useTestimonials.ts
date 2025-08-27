import { useData } from './useData'
import { testimonialsApi } from '../api/testimonials'
import { Testimonial } from '../types'

export function useTestimonials() {
  const { data: testimonials, loading, error, refresh: refreshTestimonials } = useData<Testimonial>(testimonialsApi.getAll)
  return { testimonials, loading, error, refreshTestimonials }
}