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

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
CREATE POLICY "Public can view blog posts" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts 
  FOR ALL USING (auth.role() = 'authenticated');