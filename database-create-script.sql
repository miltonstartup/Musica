-- Music Teacher Website Database Creation Script
-- Run this in Supabase SQL Editor

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_date);
CREATE INDEX IF NOT EXISTS idx_services_price ON services(price);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Enable Row Level Security (RLS) on all tables
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

-- Insert sample data for testing

-- Sample services
INSERT INTO services (name, description, price, duration_minutes, image_url) VALUES
('Clases de Piano', 'Aprende piano desde cero o perfecciona tu técnica con nuestro método personalizado.', 45.00, 60, '/images/piano_service.jpg'),
('Clases de Guitarra', 'Domina la guitarra acústica o eléctrica con técnicas modernas y clásicas.', 40.00, 60, '/images/guitar_service.jpg'),
('Clases de Violín', 'Desarrolla tu habilidad en el violín con un enfoque técnico y expresivo.', 50.00, 60, '/images/violin_service.jpg'),
('Teoría Musical', 'Comprende los fundamentos de la música: armonía, ritmo y composición.', 35.00, 45, '/images/theory_service.jpg');

-- Sample testimonials
INSERT INTO testimonials (author_name, content, rating) VALUES
('María González', 'Excelente profesora, muy paciente y dedicada. Mis hijos han aprendido muchísimo.', 5),
('Carlos Rodríguez', 'Las clases de guitarra superaron mis expectativas. Recomiendo totalmente.', 5),
('Ana Martínez', 'Profesionalismo y calidad en cada clase. Mi hija está encantada con el piano.', 5),
('José López', 'Métodos de enseñanza muy efectivos. He progresado más de lo que imaginaba.', 4);

-- Sample blog posts
INSERT INTO blog_posts (title, content, excerpt, slug) VALUES
('Beneficios de Aprender Música en la Infancia', 
 'La música es una herramienta poderosa para el desarrollo cognitivo de los niños. Estudios han demostrado que aprender un instrumento musical mejora la memoria, la concentración y las habilidades matemáticas...', 
 'Descubre cómo la música potencia el desarrollo cognitivo infantil.',
 'beneficios-musica-infancia'),
('Cómo Elegir tu Primer Instrumento Musical', 
 'Elegir el primer instrumento es una decisión importante que puede marcar tu relación con la música para toda la vida. Considera factores como tu edad, gustos musicales y objetivos...', 
 'Guía completa para seleccionar el instrumento perfecto para ti.',
 'elegir-primer-instrumento'),
('La Importancia de la Práctica Diaria', 
 'La constancia es clave en el aprendizaje musical. Dedicar tiempo diario, aunque sean 15-20 minutos, es más efectivo que sesiones largas esporádicas...', 
 'Tips para mantener una rutina de práctica efectiva.',
 'importancia-practica-diaria');

COMMIT;