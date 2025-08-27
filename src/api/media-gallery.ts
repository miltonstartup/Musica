import { createSupabaseApi } from './baseApi'
import { supabase } from '../services/supabase'
import type { MediaGallery, CreateMediaGalleryData } from '../types'

const baseApi = createSupabaseApi<MediaGallery>('media_gallery')

export const mediaGalleryApi = {
  ...baseApi,
  // Get featured media items
  async getFeatured(): Promise<MediaGallery[]> {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get media items by category
  async getByCategory(category: string): Promise<MediaGallery[]> {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get media items by type
  async getByType(mediaType: 'photo' | 'video' | 'youtube' | 'instagram'): Promise<MediaGallery[]> {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .eq('media_type', mediaType)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Toggle featured status
  async toggleFeatured(id: string, isFeatured: boolean): Promise<MediaGallery> {
    const { data, error } = await supabase
      .from('media_gallery')
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}