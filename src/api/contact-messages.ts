import { supabase } from '../services/supabase'
import type { ContactMessage, CreateContactMessageData } from '../types'

export const contactMessagesApi = {
  // Get all contact messages
  async getAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get unread contact messages
  async getUnread(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get contact message by ID
  async getById(id: string): Promise<ContactMessage | null> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // Create new contact message
  async create(messageData: CreateContactMessageData): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Mark message as read
  async markAsRead(id: string): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Add admin response
  async addResponse(id: string, response: string): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ 
        admin_response: response, 
        is_read: true,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete contact message
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}