import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    // Get service role key from environment
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

    // Create services table
    const { error: servicesError } = await supabaseAdmin.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS services (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          price NUMERIC(10,2) NOT NULL,
          duration_minutes INTEGER NOT NULL DEFAULT 60,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE services ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        DROP POLICY IF EXISTS "Public can view services" ON services;
        CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;
        CREATE POLICY "Authenticated users can manage services" ON services 
          FOR ALL USING (auth.role() = 'authenticated');
      `
    })

    if (servicesError) {
      console.error('Services table error:', servicesError)
    }

    // Create testimonials table
    const { error: testimonialsError } = await supabaseAdmin.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS testimonials (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          author_name TEXT NOT NULL,
          content TEXT NOT NULL,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
          date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
        CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;
        CREATE POLICY "Authenticated users can manage testimonials" ON testimonials 
          FOR ALL USING (auth.role() = 'authenticated');
      `
    })

    if (testimonialsError) {
      console.error('Testimonials table error:', testimonialsError)
    }

    // Create blog_posts table
    const { error: blogError } = await supabaseAdmin.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS blog_posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT,
          image_url TEXT,
          published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          author TEXT DEFAULT 'Music Teacher',
          slug TEXT UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
        CREATE POLICY "Public can view blog posts" ON blog_posts FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;
        CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts 
          FOR ALL USING (auth.role() = 'authenticated');
      `
    })

    if (blogError) {
      console.error('Blog posts table error:', blogError)
    }

    // Create appointments table
    const { error: appointmentsError } = await supabaseAdmin.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS appointments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          client_name TEXT NOT NULL,
          client_email TEXT NOT NULL,
          client_phone TEXT,
          service_id UUID,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index
        CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
        CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

        -- Enable RLS
        ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        DROP POLICY IF EXISTS "Public can create appointments" ON appointments;
        CREATE POLICY "Public can create appointments" ON appointments FOR INSERT WITH CHECK (true);
        
        DROP POLICY IF EXISTS "Authenticated users can manage appointments" ON appointments;
        CREATE POLICY "Authenticated users can manage appointments" ON appointments 
          FOR ALL USING (auth.role() = 'authenticated');
      `
    })

    if (appointmentsError) {
      console.error('Appointments table error:', appointmentsError)
    }

    // Create payments table
    const { error: paymentsError } = await supabaseAdmin.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS payments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          appointment_id UUID,
          amount NUMERIC(10,2) NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
          payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          payment_method TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index
        CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

        -- Enable RLS
        ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        DROP POLICY IF EXISTS "Authenticated users can manage payments" ON payments;
        CREATE POLICY "Authenticated users can manage payments" ON payments 
          FOR ALL USING (auth.role() = 'authenticated');
      `
    })

    if (paymentsError) {
      console.error('Payments table error:', paymentsError)
    }

    // Check if any errors occurred
    const errors = [servicesError, testimonialsError, blogError, appointmentsError, paymentsError].filter(Boolean)
    
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Some tables failed to create',
          errors: errors 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'All database tables created successfully',
        tables: ['services', 'testimonials', 'blog_posts', 'appointments', 'payments']
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Database setup error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to setup database',
        error: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})