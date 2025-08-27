Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { imageData, fileName, bucket = 'blog-images' } = requestData;

    if (!imageData || !fileName) {
      return new Response(
        JSON.stringify({ error: { message: 'Missing imageData or fileName' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Supabase service role key
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!supabaseServiceKey || !supabaseUrl) {
      return new Response(
        JSON.stringify({ error: { message: 'Supabase credentials not found' } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract base64 data (remove data:image/...;base64, prefix)
    const base64Data = imageData.split(',')[1];
    if (!base64Data) {
      return new Response(
        JSON.stringify({ error: { message: 'Invalid image data format' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert base64 to Uint8Array
    const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload to Supabase Storage
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/${bucket}/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'image/jpeg',
          'Cache-Control': '3600'
        },
        body: bytes
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      return new Response(
        JSON.stringify({ error: { message: `Upload failed: ${errorText}` } }),
        { status: uploadResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;

    return new Response(
      JSON.stringify({ data: { publicUrl } }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: error.message || 'Internal server error' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});