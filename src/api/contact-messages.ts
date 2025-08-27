import { createSupabaseApi } from './baseApi'
import { supabase } from '../services/supabase'
import type { ContactMessage, CreateContactMessageData } from '../types'

const baseApi = createSupabaseApi<ContactMessage>('contact_messages')

export const contactMessagesApi = {
  ...baseApi,
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
  }
}