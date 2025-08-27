import { supabase } from '../services/supabase'
import type { Appointment, CreateAppointmentData } from '../types'

export const appointmentsApi = {
  // Get all appointments
  async getAll(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get appointments by date range
  async getByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .order('appointment_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get available time slots for a specific date
  async getAvailableSlots(date: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .eq('status', 'confirmed')

    if (error) throw error

    // Generate available slots (9 AM to 6 PM, hourly)
    const availableSlots: string[] = []
    const bookedTimes = new Set(data?.map(apt => apt.appointment_time) || [])

    for (let hour = 9; hour <= 18; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00:00`
      if (!bookedTimes.has(timeSlot)) {
        availableSlots.push(timeSlot)
      }
    }

    return availableSlots
  },

  // Create new appointment
  async create(appointmentData: CreateAppointmentData): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ ...appointmentData, status: 'pending' }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update appointment status
  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete appointment
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}