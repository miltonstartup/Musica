CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials 
  FOR ALL USING (auth.role() = 'authenticated');