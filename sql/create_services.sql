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

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;
CREATE POLICY "Authenticated users can manage services" ON services 
  FOR ALL USING (auth.role() = 'authenticated');