import { useData } from './useData'
import { blogApi } from '../api/blog'
import type { BlogPost } from '../types'

export function useBlogPosts() {
  const { data: blogPosts, loading, error, refresh: refreshBlogPosts } = useData<BlogPost>(blogApi.getAll)
  return { blogPosts, loading, error, refreshBlogPosts }
}