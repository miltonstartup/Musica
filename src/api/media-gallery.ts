import { supabase } from '../services/supabase'
import type { MediaGallery, CreateMediaGalleryData } from '../types'

export const mediaGalleryApi = {
  // Get all media items
  async getAll(): Promise<MediaGallery[]> {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

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

  // Get media item by ID
  async getById(id: string): Promise<MediaGallery | null> {
    const { data, error } = await supabase
      .from('media_gallery')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // Create new media item
  async create(mediaData: CreateMediaGalleryData): Promise<MediaGallery> {
    const { data, error } = await supabase
      .from('media_gallery')
      .insert([mediaData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update media item
  async update(id: string, updates: Partial<CreateMediaGalleryData>): Promise<MediaGallery> {
    const { data, error } = await supabase
      .from('media_gallery')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete media item
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('media_gallery')
      .delete()
      .eq('id', id)

    if (error) throw error
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