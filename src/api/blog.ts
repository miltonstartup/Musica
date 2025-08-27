import { supabase } from '../services/supabase'
import type { BlogPost, CreateBlogPostData } from '../types'

export const blogApi = {
  // Get all blog posts
  async getAll(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get blog post by slug
  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // Get blog post by ID
  async getById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // Create new blog post
  async create(blogData: CreateBlogPostData): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([blogData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update blog post
  async update(id: string, updates: Partial<CreateBlogPostData>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete blog post
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}