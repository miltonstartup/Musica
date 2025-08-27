import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://nfostlreaihscwdocbpd.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mb3N0bHJlYWloc2N3ZG9jYnBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4Nzg4OCwiZXhwIjoyMDcxNzYzODg4fQ.t8V771FbPnCpUN5N9FoIbHsBhq9CcMxDldlpDg3SRrk'

// Create admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTables() {
  console.log('🎵 Starting Music Teacher Website Database Setup...')
  
  // Test connection first
  try {
    const { data, error } = await supabaseAdmin.from('information_schema.tables').select('table_name').limit(1)
    if (error) {
      console.log('⚠️ Connection test failed:', error.message)
    } else {
      console.log('✅ Successfully connected to Supabase')
    }
  } catch (err) {
    console.log('⚠️ Connection error:', err.message)
  }
  
  const tables = [
    {
      name: 'services',
      sql: `
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
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Public can view services" ON services;
        DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;
        
        -- Create policies
        CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
        CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');
      `
    },
    {
      name: 'testimonials',
      sql: `
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
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
        DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;
        
        -- Create policies
        CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (true);
        CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
      `
    },
    {
      name: 'blog_posts',
      sql: `
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
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
        DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;
        
        -- Create policies
        CREATE POLICY "Public can view blog posts" ON blog_posts FOR SELECT USING (true);
        CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
      `
    },
    {
      name: 'appointments',
      sql: `
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
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
        CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
        
        -- Enable RLS
        ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Public can create appointments" ON appointments;
        DROP POLICY IF EXISTS "Authenticated users can manage appointments" ON appointments;
        
        -- Create policies
        CREATE POLICY "Public can create appointments" ON appointments FOR INSERT WITH CHECK (true);
        CREATE POLICY "Authenticated users can manage appointments" ON appointments FOR ALL USING (auth.role() = 'authenticated');
      `
    },
    {
      name: 'payments',
      sql: `
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
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
        
        -- Enable RLS
        ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Authenticated users can manage payments" ON payments;
        
        -- Create policies
        CREATE POLICY "Authenticated users can manage payments" ON payments FOR ALL USING (auth.role() = 'authenticated');
      `
    }
  ]
  
  let successCount = 0
  
  for (const table of tables) {
    console.log(`\n📋 Creating ${table.name} table...`)
    
    try {
      const { data, error } = await supabaseAdmin.rpc('exec_sql', {
        query: table.sql
      })
      
      if (error) {
        console.log(`❌ Failed to create ${table.name}:`, error.message)
        console.log('Error details:', error)
      } else {
        console.log(`✅ Successfully created ${table.name} table`)
        successCount++
      }
    } catch (err) {
      console.log(`❌ Error creating ${table.name}:`, err.message)
    }
  }
  
  console.log(`\n🎉 Database setup complete! ${successCount}/${tables.length} tables created successfully.`)
  
  if (successCount === tables.length) {
    console.log('\n🎵 All tables created successfully!')
    console.log('🚀 The admin dashboard should now work properly.')
    console.log('\n📋 Created tables:')
    console.log('   - services (music lesson offerings)')
    console.log('   - testimonials (student reviews)')
    console.log('   - blog_posts (educational content)')
    console.log('   - appointments (lesson bookings)')
    console.log('   - payments (payment tracking)')
    console.log('\n🔗 Test the admin dashboard at:')
    console.log('   https://fdjgo3b4hyhr.space.minimax.io/admin')
    
    // Insert sample data
    console.log('\n📝 Inserting sample data...')
    await insertSampleData()
  } else {
    console.log('\n⚠️ Some tables failed to create. Manual setup may be required.')
  }
}

async function insertSampleData() {
  try {
    // Insert sample services
    const { error: servicesError } = await supabaseAdmin.from('services').insert([
      {
        name: 'Clases de Piano',
        description: 'Aprende piano desde cero o perfecciona tu técnica con nuestro método personalizado.',
        price: 45.00,
        duration_minutes: 60,
        image_url: '/images/piano_service.jpg'
      },
      {
        name: 'Clases de Guitarra',
        description: 'Domina la guitarra acústica o eléctrica con técnicas modernas y clásicas.',
        price: 40.00,
        duration_minutes: 60,
        image_url: '/images/guitar_service.jpg'
      },
      {
        name: 'Clases de Violín',
        description: 'Desarrolla tu habilidad en el violín con un enfoque técnico y expresivo.',
        price: 50.00,
        duration_minutes: 60,
        image_url: '/images/violin_service.jpg'
      }
    ])
    
    if (servicesError) {
      console.log('⚠️ Failed to insert sample services:', servicesError.message)
    } else {
      console.log('✅ Sample services inserted successfully')
    }
    
    // Insert sample testimonials
    const { error: testimonialsError } = await supabaseAdmin.from('testimonials').insert([
      {
        author_name: 'María González',
        content: 'Excelente profesora, muy paciente y dedicada. Mis hijos han aprendido muchísimo.',
        rating: 5
      },
      {
        author_name: 'Carlos Rodríguez',
        content: 'Las clases de guitarra superaron mis expectativas. Recomiendo totalmente.',
        rating: 5
      },
      {
        author_name: 'Ana Martínez',
        content: 'Profesionalismo y calidad en cada clase. Mi hija está encantada con el piano.',
        rating: 5
      }
    ])
    
    if (testimonialsError) {
      console.log('⚠️ Failed to insert sample testimonials:', testimonialsError.message)
    } else {
      console.log('✅ Sample testimonials inserted successfully')
    }
    
    // Insert sample blog posts
    const { error: blogError } = await supabaseAdmin.from('blog_posts').insert([
      {
        title: 'Beneficios de Aprender Música en la Infancia',
        content: 'La música es una herramienta poderosa para el desarrollo cognitivo de los niños. Estudios han demostrado que aprender un instrumento musical mejora la memoria, la concentración y las habilidades matemáticas...',
        excerpt: 'Descubre cómo la música potencia el desarrollo cognitivo infantil.',
        slug: 'beneficios-musica-infancia'
      },
      {
        title: 'Cómo Elegir tu Primer Instrumento Musical',
        content: 'Elegir el primer instrumento es una decisión importante que puede marcar tu relación con la música para toda la vida. Considera factores como tu edad, gustos musicales y objetivos...',
        excerpt: 'Guía completa para seleccionar el instrumento perfecto para ti.',
        slug: 'elegir-primer-instrumento'
      }
    ])
    
    if (blogError) {
      console.log('⚠️ Failed to insert sample blog posts:', blogError.message)
    } else {
      console.log('✅ Sample blog posts inserted successfully')
    }
    
  } catch (error) {
    console.log('❌ Error inserting sample data:', error.message)
  }
}

// Run the setup
createTables().catch(console.error)