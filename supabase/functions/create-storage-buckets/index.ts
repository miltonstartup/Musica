import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Missing Supabase credentials')
    }

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Define buckets to create
    const buckets = [
      {
        id: 'blog-images',
        name: 'blog-images',
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      },
      {
        id: 'service-images',
        name: 'service-images', 
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      },
      {
        id: 'media-gallery',
        name: 'media-gallery',
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/avi', 'video/mov'],
        fileSizeLimit: 52428800 // 50MB for videos
      },
      {
        id: 'media-gallery-thumbnails',
        name: 'media-gallery-thumbnails',
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      }
    ]

    const results = []

    for (const bucket of buckets) {
      try {
        // Check if bucket exists
        const { data: existingBucket } = await supabaseAdmin.storage.getBucket(bucket.id)
        
        if (existingBucket) {
          results.push({
            bucket: bucket.id,
            status: 'exists',
            message: `Bucket ${bucket.id} already exists`
          })
          continue
        }

        // Create bucket
        const { data, error } = await supabaseAdmin.storage.createBucket(bucket.id, {
          public: bucket.public,
          allowedMimeTypes: bucket.allowedMimeTypes,
          fileSizeLimit: bucket.fileSizeLimit
        })

        if (error) {
          results.push({
            bucket: bucket.id,
            status: 'error',
            message: error.message
          })
        } else {
          results.push({
            bucket: bucket.id,
            status: 'created',
            message: `Successfully created bucket ${bucket.id}`
          })
        }
      } catch (bucketError) {
        results.push({
          bucket: bucket.id,
          status: 'error',
          message: bucketError instanceof Error ? bucketError.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.status === 'created' || r.status === 'exists').length
    const totalCount = buckets.length

    return new Response(
      JSON.stringify({
        success: successCount === totalCount,
        message: `Storage setup complete: ${successCount}/${totalCount} buckets ready`,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Storage setup error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Storage setup failed',
        error: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})