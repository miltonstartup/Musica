-- Enhanced Database Setup with New Tables for Spanish Music Teacher Website
-- Run this in your Supabase SQL Editor

-- Create services table
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

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    author_role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    service_id UUID,
    is_booked BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID,
    amount NUMERIC(10,2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media_gallery table for multimedia features
CREATE TABLE IF NOT EXISTS media_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video', 'youtube', 'instagram')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT NOT NULL,
    tags TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table for contact form
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    inquiry_type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Services policies - public read, authenticated write
DROP POLICY IF EXISTS "Services are publicly readable" ON services;
CREATE POLICY "Services are publicly readable" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;
CREATE POLICY "Authenticated users can manage services" ON services 
FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials policies - public read, authenticated write
DROP POLICY IF EXISTS "Testimonials are publicly readable" ON testimonials;
CREATE POLICY "Testimonials are publicly readable" ON testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials 
FOR ALL USING (auth.role() = 'authenticated');

-- Blog posts policies - public read, authenticated write
DROP POLICY IF EXISTS "Blog posts are publicly readable" ON blog_posts;
CREATE POLICY "Blog posts are publicly readable" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts 
FOR ALL USING (auth.role() = 'authenticated');

-- Appointments policies - public can create, authenticated can manage
DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
CREATE POLICY "Anyone can create appointments" ON appointments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view appointments" ON appointments;
CREATE POLICY "Anyone can view appointments" ON appointments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage appointments" ON appointments;
CREATE POLICY "Authenticated users can manage appointments" ON appointments 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;
CREATE POLICY "Authenticated users can delete appointments" ON appointments 
FOR DELETE USING (auth.role() = 'authenticated');

-- Payments policies - authenticated only
DROP POLICY IF EXISTS "Authenticated users can manage payments" ON payments;
CREATE POLICY "Authenticated users can manage payments" ON payments 
FOR ALL USING (auth.role() = 'authenticated');

-- Media gallery policies - public read, authenticated write
DROP POLICY IF EXISTS "Media gallery is publicly readable" ON media_gallery;
CREATE POLICY "Media gallery is publicly readable" ON media_gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage media gallery" ON media_gallery;
CREATE POLICY "Authenticated users can manage media gallery" ON media_gallery 
FOR ALL USING (auth.role() = 'authenticated');

-- Contact messages policies - public can create, authenticated can manage
DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage contact messages" ON contact_messages;
CREATE POLICY "Authenticated users can manage contact messages" ON contact_messages 
FOR ALL USING (auth.role() = 'authenticated');

-- Clear existing data and insert Spanish content
DELETE FROM services;
DELETE FROM testimonials;
DELETE FROM blog_posts;

-- Insert Spanish services data
INSERT INTO services (name, description, price, duration_minutes, image_url) VALUES
('Clases de Piano', 'Aprende a tocar piano con instrucción profesional adaptada a tu nivel. Desde fundamentos básicos hasta técnicas avanzadas, te guiaré a través de la técnica adecuada, teoría musical y desarrollo del repertorio.', 75.00, 60, '/images/professional-piano-lesson-teacher-student-studio.jpg'),
('Clases de Guitarra', 'Domina la guitarra con lecciones personalizadas que cubren técnicas de guitarra acústica y eléctrica. Aprende acordes, escalas, fingerpicking y tus canciones favoritas en varios estilos musicales.', 70.00, 60, '/images/professional-guitar-music-lesson-teacher-student.jpg'),
('Clases de Violín', 'Desarrolla la técnica adecuada del violín y la musicalidad a través de lecciones estructuradas. Enfócate en técnicas de arco, entonación, vibrato y repertorio clásico y contemporáneo.', 80.00, 60, '/images/professional-violin-music-lesson-instruction.jpg'),
('Teoría Musical', 'Lecciones integrales de teoría musical para mejorar tu comprensión de la música. Aprende armonía, composición, análisis y cómo la teoría se aplica a tu instrumento de elección.', 65.00, 45, '/images/elegant_vintage_sheet_music_background.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert Spanish testimonials data
INSERT INTO testimonials (author, content, author_role) VALUES
('María González', 'Mi hija ha estado tomando clases de piano por más de un año y su progreso ha sido increíble. La paciencia y el aliento que recibe hace que cada lección sea agradable y productiva.', 'Madre de Estudiante de Piano'),
('Miguel Rodríguez', 'Como principiante adulto, estaba nervioso por empezar clases de guitarra, pero el enfoque de enseñanza me hizo sentir cómodo desde el primer día. ¡Ahora estoy tocando canciones que nunca pensé posibles!', 'Estudiante Adulto de Guitarra'),
('Ana Martín', 'La instrucción de violín que recibo es excepcional. El enfoque en la técnica adecuada y la expresión musical me ha ayudado a desarrollarme no solo como intérprete, sino como músico.', 'Estudiante Avanzada de Violín'),
('Carlos Ruiz', 'La teoría musical parecía imposible de entender hasta que comencé estas lecciones. Todo se explica claramente con ejemplos prácticos que se conectan con la música real.', 'Estudiante de Teoría Musical'),
('Laura Sánchez', 'Después de años de querer aprender piano, finalmente di el paso a los 35 años. El estilo de enseñanza de apoyo y la programación flexible hicieron posible perseguir mis sueños musicales.', 'Estudiante Adulta de Piano'),
('David López', 'Mi hijo ha ganado mucha confianza a través de sus clases de guitarra. No solo ha mejorado su habilidad musical, sino que su autoestima general ha crecido tremendamente.', 'Padre de Estudiante de Guitarra')
ON CONFLICT (id) DO NOTHING;

-- Insert Spanish blog posts data
INSERT INTO blog_posts (title, slug, content, image_url) VALUES
('Los Beneficios de Aprender Música Siendo Adulto', 'beneficios-aprender-musica-adulto', 'Muchos adultos creen que es demasiado tarde para empezar a aprender un instrumento musical, pero esto no podría estar más lejos de la verdad. Aprender música como adulto ofrece numerosos beneficios cognitivos, emocionales y sociales.

Los estudiantes adultos aportan ventajas únicas a la educación musical: disciplina, experiencia de vida y objetivos claros. A diferencia de los niños, los adultos pueden apreciar los aspectos teóricos de la música y a menudo progresan rápidamente en áreas como la teoría musical y la composición.

La investigación muestra que aprender música como adulto puede mejorar la memoria, aumentar la flexibilidad cognitiva e incluso retrasar el deterioro cognitivo relacionado con la edad. La neuroplasticidad del cerebro adulto significa que aún se pueden formar y fortalecer nuevas vías neurales a través de la práctica musical.

Además, la música proporciona una excelente salida para el alivio del estrés y la expresión emocional. Muchos de mis estudiantes adultos encuentran que sus lecciones de música semanales se convierten en un descanso preciado de sus ocupadas vidas profesionales.

Ya sea que estés retomando donde lo dejaste en la infancia o comenzando completamente desde cero, nunca es demasiado tarde para comenzar tu viaje musical. La clave es encontrar el instructor adecuado que comprenda las necesidades y objetivos únicos de los estudiantes adultos.', '/images/elegant_music_notes_sheet_pattern_background.jpg'),
('Eligiendo tu Primer Instrumento: Una Guía para Principiantes', 'eligiendo-primer-instrumento-guia-principiantes', 'Seleccionar tu primer instrumento musical es una decisión emocionante que dará forma a tu viaje musical. Aquí tienes factores clave a considerar al tomar esta importante decisión.

**Considera tus Preferencias Musicales**
Piensa en el tipo de música que más disfrutas escuchando. Si amas la música clásica, el piano o el violín podrían ser ideales. Los fanáticos del rock y pop a menudo gravitan hacia la guitarra, mientras que los entusiastas del jazz podrían considerar el piano o el saxofón.

**Consideraciones Físicas**
Algunos instrumentos requieren atributos físicos específicos. La guitarra requiere fuerza y destreza en los dedos, mientras que los instrumentos de viento necesitan buena capacidad pulmonar. El piano es accesible para casi todos y proporciona una excelente base para comprender la teoría musical.

**Espacio de Práctica y Volumen**
Considera tu situación de vida. Los instrumentos acústicos como el violín y la guitarra se pueden practicar con sordinas o tocar a volúmenes más bajos. El piano ofrece opciones digitales con auriculares, haciéndolo amigable con los vecinos.

**Consideraciones de Presupuesto**
Factoriza no solo el costo inicial del instrumento, sino también los gastos continuos como lecciones, mantenimiento y accesorios. Los estudiantes de piano pueden comenzar con un teclado digital, mientras que los instrumentos de cuerda se pueden alquilar inicialmente.

**Compromiso a Largo Plazo**
Considera qué instrumento puedes imaginarte tocando durante años. El factor más importante es elegir un instrumento que genuinamente te emocione y te motive a practicar regularmente.

Recuerda, no hay un primer instrumento perfecto, solo el instrumento perfecto para ti. Tómate el tiempo para probar diferentes opciones y consulta con un profesor de música que pueda proporcionar orientación personalizada basada en tus objetivos y circunstancias.', '/images/elegant-grand-piano-keys-close-up-dramatic-lighting.jpg'),
('Construyendo Hábitos de Práctica Efectivos', 'construyendo-habitos-practica-efectivos', 'Desarrollar hábitos de práctica consistentes y efectivos es crucial para el progreso musical. El tiempo de práctica de calidad es más valioso que sesiones largas y sin enfoque.

**Establece un Horario Regular**
La consistencia es clave para construir memoria muscular y mantener el progreso. Incluso 15-20 minutos de práctica diaria es más beneficioso que una sesión larga por semana. Elige un momento cuando puedas concentrarte sin distracciones.

**Establece Objetivos Específicos**
En lugar de solo "practicar piano", establece objetivos específicos como "dominar la mano izquierda del compás 16-32" o "tocar el ejercicio de escala a 120 BPM". Los objetivos específicos hacen que las sesiones de práctica sean más productivas y medibles.

**Usa un Diario de Práctica**
Registra tus sesiones de práctica, anotando en qué trabajaste, los desafíos encontrados y los objetivos para la próxima vez. Esto ayuda a identificar patrones y asegura que abordes todas las áreas que necesitan mejora.

**Practica Lentamente**
La velocidad viene con la precisión y la memoria muscular. Siempre practica material nuevo lo suficientemente lento como para tocarlo perfectamente, luego aumenta gradualmente el tempo. Tocar rápido pero descuidado crea malos hábitos que son difíciles de desaprender.

**Desglosa Secciones Difíciles**
Cuando encuentres pasajes desafiantes, áislalos y practícalos por separado. Trabaja solo en unos pocos compases a la vez hasta que se vuelvan cómodos, luego intégralos de vuelta a la pieza completa.

**Termina con una Nota Positiva**
Siempre concluye tu sesión de práctica tocando algo que disfrutes y puedas interpretar bien. Esto te deja sintiéndote realizado y motivado para tu próxima sesión de práctica.

Recuerda, la práctica efectiva se trata de resolver problemas y repetición consciente, no repetición sin sentido. La calidad siempre supera a la cantidad en la práctica musical.', '/images/elegant_piano_keys_close_up_warm_light.jpg'),
('La Importancia de la Teoría Musical en el Aprendizaje Moderno', 'importancia-teoria-musical-aprendizaje-moderno', 'La teoría musical podría parecer un tema intimidante, pero sirve como la base para entender cómo funciona la música. Ya seas principiante o músico avanzado, el conocimiento teórico mejora tu experiencia musical de innumerables maneras.

**Entendiendo el Lenguaje Musical**
La teoría musical es como aprender la gramática de un idioma. Te ayuda a entender por qué ciertas progresiones de acordes suenan agradables, cómo se construyen las melodías y cómo diferentes elementos musicales trabajan juntos para crear emoción y significado.

**Comunicación Mejorada**
Cuando entiendes la teoría, puedes comunicarte más efectivamente con otros músicos. Términos como "séptima dominante" o "menor relativo" se convierten en herramientas que te ayudan a colaborar y aprender de otros más eficientemente.

**Creatividad Mejorada**
Contrario a la creencia popular, la teoría no limita la creatividad, la mejora. Entender las reglas te da una base desde la cual romperlas intencionalmente. Muchas de las innovaciones musicales más grandes vinieron de compositores que entendían a fondo la teoría tradicional.

**Aprendizaje Más Rápido**
Con conocimiento teórico, puedes reconocer patrones en la música que de otra manera parecerían aleatorios. Este reconocimiento de patrones acelera tu capacidad de aprender nuevas piezas y entender diferentes estilos musicales.

**Mejor Improvisación**
Ya sea que estés tocando jazz, blues o simplemente improvisando con amigos, el conocimiento teórico proporciona un mapa para la improvisación. Entenderás qué notas y acordes funcionan bien juntos, dándote confianza para explorar y expresarte musicalmente.

Recuerda, la teoría debe complementar tu interpretación, no reemplazar la alegría de hacer música. El objetivo es mejorar tu comprensión y disfrute de esta hermosa forma de arte.', '/images/vintage_distressed_music_notes_sheet_background_pattern.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample media gallery data
INSERT INTO media_gallery (title, description, media_type, media_url, thumbnail_url, category, tags, is_featured) VALUES
('Profesor en el Estudio', 'Profesor de música en su estudio profesional', 'photo', '/images/professional-music-teacher-piano-lesson-studio.jpg', '/images/professional-music-teacher-piano-lesson-studio.jpg', 'Profesor', 'profesor,estudio,piano', true),
('Clase de Piano', 'Lección de piano en progreso', 'photo', '/images/professional-piano-lesson-teacher-student-studio.jpg', '/images/professional-piano-lesson-teacher-student-studio.jpg', 'Clases', 'piano,lección,estudiante', true),
('Clase de Guitarra', 'Instrucción personalizada de guitarra', 'photo', '/images/professional-guitar-music-lesson-teacher-student.jpg', '/images/professional-guitar-music-lesson-teacher-student.jpg', 'Clases', 'guitarra,lección,estudiante', true),
('Clase de Violín', 'Lección de violín profesional', 'photo', '/images/professional-violin-music-lesson-instruction.jpg', '/images/professional-violin-music-lesson-instruction.jpg', 'Clases', 'violín,lección,técnica', true),
('Teclas de Piano Elegantes', 'Close-up artístico de teclas de piano', 'photo', '/images/elegant-grand-piano-keys-close-up-dramatic-lighting.jpg', '/images/elegant-grand-piano-keys-close-up-dramatic-lighting.jpg', 'Instrumentos', 'piano,teclas,elegante', false),
('Partitura Musical', 'Partituras clásicas vintage', 'photo', '/images/elegant_vintage_sheet_music_background.jpg', '/images/elegant_vintage_sheet_music_background.jpg', 'Teoría', 'partitura,música,teoría', false)
ON CONFLICT (id) DO NOTHING;