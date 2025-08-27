// Direct database setup using raw SQL commands
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
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Missing Supabase credentials')
    }

    // SQL commands to create all tables
    const createTablesSQL = `
      -- Drop existing tables if they exist
      DROP TABLE IF EXISTS payments CASCADE;
      DROP TABLE IF EXISTS appointments CASCADE;
      DROP TABLE IF EXISTS blog_posts CASCADE;
      DROP TABLE IF EXISTS testimonials CASCADE;
      DROP TABLE IF EXISTS services CASCADE;

      -- Create services table
      CREATE TABLE services (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          price NUMERIC(10,2) NOT NULL,
          duration_minutes INTEGER NOT NULL DEFAULT 60,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create testimonials table
      CREATE TABLE testimonials (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          author_name TEXT NOT NULL,
          content TEXT NOT NULL,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
          date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create blog_posts table
      CREATE TABLE blog_posts (
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

      -- Create appointments table
      CREATE TABLE appointments (
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

      -- Create payments table
      CREATE TABLE payments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          appointment_id UUID,
          amount NUMERIC(10,2) NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
          payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          payment_method TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_date);
      CREATE INDEX IF NOT EXISTS idx_services_price ON services(price);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

      -- Enable Row Level Security
      ALTER TABLE services ENABLE ROW LEVEL SECURITY;
      ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
      ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
      ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

      -- Services policies
      CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
      CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

      -- Testimonials policies
      CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (true);
      CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

      -- Blog posts policies
      CREATE POLICY "Public can view blog posts" ON blog_posts FOR SELECT USING (true);
      CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

      -- Appointments policies
      CREATE POLICY "Public can create appointments" ON appointments FOR INSERT WITH CHECK (true);
      CREATE POLICY "Authenticated users can manage appointments" ON appointments FOR ALL USING (auth.role() = 'authenticated');

      -- Payments policies
      CREATE POLICY "Authenticated users can manage payments" ON payments FOR ALL USING (auth.role() = 'authenticated');
    `

    // Execute SQL directly via PostgreSQL REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({ query: createTablesSQL })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Database setup failed: ${response.status} - ${errorText}`)
    }

    const result = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database setup completed successfully',
        result: result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Direct database setup error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Database setup failed',
        error: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})