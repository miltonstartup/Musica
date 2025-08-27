export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  author_name: string
  content: string
  rating: number
  date_created: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string | null
  content: string
  excerpt: string | null
  published_date: string
  author: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  client_name: string
  client_email: string
  client_phone: string | null
  service_id: string | null
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  appointment_id: string | null
  amount: number
  payment_date: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  payment_method: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MediaGallery {
  id: string
  title: string
  description: string | null
  media_type: 'photo' | 'video' | 'youtube' | 'instagram'
  media_url: string
  thumbnail_url: string | null
  category: string
  tags: string[] | null
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  inquiry_type: string
  is_read: boolean
  admin_response: string | null // Ensure this is nullable
  created_at: string
  updated_at: string
}

export interface CreateAppointmentData {
  client_name: string
  client_email: string
  client_phone?: string
  service_id: string
  appointment_date: string
  appointment_time: string
  notes?: string
}

export interface CreateServiceData {
  name: string
  description?: string
  price: number
  duration_minutes: number
  image_url?: string
}

export interface CreateTestimonialData {
  author_name: string
  content: string
  rating?: number
}

export interface CreateBlogPostData {
  title: string
  slug?: string
  content: string
  excerpt?: string
  author?: string
  image_url?: string
  published_date?: string
}

export interface CreatePaymentData {
  appointment_id?: string
  amount: number
  payment_method?: string
  status?: 'pending' | 'completed' | 'failed' | 'cancelled'
  notes?: string
}

export interface CreateMediaGalleryData {
  title: string
  description?: string
  media_type: 'photo' | 'video' | 'youtube' | 'instagram'
  media_url: string
  thumbnail_url?: string
  category: string
  tags?: string[]
  is_featured?: boolean
}

export interface CreateContactMessageData {
  name: string
  email: string
  phone?: string
  message: string
  inquiry_type: string
  is_read?: boolean
  admin_response?: string | null
}

// Type aliases for compatibility
export type MediaItem = MediaGallery