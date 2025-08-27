import { createSupabaseApi } from './baseApi'
import type { Testimonial, CreateTestimonialData } from '../types'

export const testimonialsApi = createSupabaseApi<Testimonial>('testimonials')