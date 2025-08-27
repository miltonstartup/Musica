import { useState, useEffect } from 'react'
import { BlogPost } from '../types'
import { blogApi } from '../api/blog'

export function useBlogPosts() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      setLoading(true)
      const data = await blogApi.getAll()
      setBlogPosts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const refreshBlogPosts = () => {
    loadBlogPosts()
  }

  return { blogPosts, loading, error, refreshBlogPosts }
}