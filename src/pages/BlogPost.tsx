import React, { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'
import { blogApi } from '../api/blog'
import { Button } from '../components/Button'
import { Spinner } from '../components/Spinner'
import { formatDate } from '../lib/utils'
import type { BlogPost as BlogPostType } from '../types'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const loadPost = async () => {
      try {
        setLoading(true)
        const data = await blogApi.getBySlug(slug)
        if (!data) {
          setError('Blog post not found')
        } else {
          setPost(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          // Header
          return (
            <h3 key={index} className="text-xl font-semibold text-slate-800 mb-4 mt-8">
              {paragraph.replace(/\*\*/g, '')}
            </h3>
          )
        }
        // Regular paragraph
        return (
          <p key={index} className="text-slate-600 leading-relaxed mb-6">
            {paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}
          </p>
        )
      })
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {(post.image_url || true) && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={post.image_url || '/images/placeholders/elegant_music_education_blog_placeholder.jpg'} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex items-center text-slate-500 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="mr-4">{formatDate(post.published_at)}</span>
              <Clock className="w-4 h-4 mr-2" />
              <span>{Math.ceil(post.content.length / 1000)} min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            {post.content
              .split('\n\n')
              .map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-slate-800 mb-4 mt-8">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  )
                }
                return (
                  <p key={index} className="text-slate-600 leading-relaxed mb-6">
                    {paragraph.split(/\*\*([^*]+)\*\*/).map((part, i) => {
                      return i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                    })}
                  </p>
                )
              })
            }
          </article>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Apply these insights to your musical practice and experience the joy of making music.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button variant="secondary" size="lg">
                Book a Lesson
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-amber-600">
                Read More Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}