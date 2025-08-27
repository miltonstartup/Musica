-- New Tables for Enhanced Music Teacher Website
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Media Gallery Table
CREATE TABLE IF NOT EXISTS media_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('photo', 'video', 'youtube', 'instagram')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE
);

-- 2. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  inquiry_type VARCHAR(50) NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS)
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media_gallery
-- Allow public read access
CREATE POLICY "Public read access for media_gallery" ON media_gallery
  FOR SELECT USING (true);

-- Allow authenticated users (admin) full access
CREATE POLICY "Admin full access for media_gallery" ON media_gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for contact_messages
-- Allow public insert (for contact form submissions)
CREATE POLICY "Public insert access for contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) full access
CREATE POLICY "Admin full access for contact_messages" ON contact_messages
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_gallery_category ON media_gallery(category);
CREATE INDEX IF NOT EXISTS idx_media_gallery_featured ON media_gallery(is_featured);
CREATE INDEX IF NOT EXISTS idx_media_gallery_created_at ON media_gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);

-- Sample data for media_gallery (optional)
INSERT INTO media_gallery (title, description, media_type, media_url, category, is_featured) VALUES
('Recital de Piano Primavera 2024', 'Estudiantes presentando sus piezas favoritas', 'photo', '/images/piano-recital-students-performance.jpg', 'recitales', true),
('Clase de Guitarra Avanzada', 'Técnicas avanzadas de fingerpicking', 'photo', '/images/advanced-guitar-lesson-technique.jpg', 'clases', true),
('Masterclass de Violín', 'Técnica de arco y expresividad', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'clases', true),
('Concierto de Estudiantes', 'Presentación anual de fin de año', 'photo', '/images/student-concert-performance-hall.jpg', 'eventos', false);

-- Sample data for contact_messages (optional)
INSERT INTO contact_messages (name, email, message, inquiry_type) VALUES
('María García', 'maria@email.com', 'Hola, estoy interesada en clases de piano para mi hija de 8 años. ¿Podrían proporcionarme más información sobre horarios y precios?', 'lessons'),
('Carlos López', 'carlos@email.com', '¿Ofrecen clases de guitarra para principiantes adultos? Me gustaría comenzar a aprender.', 'lessons'),
('Ana Martínez', 'ana@email.com', 'Me encantó el recital de la semana pasada. ¿Cuándo será el próximo evento?', 'events');

COMMIT;