import { supabase } from '../services/supabase'
import type { Testimonial, CreateTestimonialData } from '../types'

export const testimonialsApi = {
  // Get all testimonials
  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get testimonial by ID
  async getById(id: string): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // Create new testimonial
  async create(testimonialData: CreateTestimonialData): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonialData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update testimonial
  async update(id: string, updates: Partial<CreateTestimonialData>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete testimonial
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}