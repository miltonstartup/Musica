import { supabase } from '../services/supabase'
import type { Service, CreateServiceData } from '../types'

export const servicesApi = {
  // Get all services
  async getAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get service by ID
  async getById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // Create new service
  async create(serviceData: CreateServiceData): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update service
  async update(id: string, updates: Partial<CreateServiceData>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete service
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}