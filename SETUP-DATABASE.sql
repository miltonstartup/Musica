# Database Setup SQL Script
# Run this in your Supabase SQL Editor

-- Drop existing tables if they exist (optional - for fresh setup)
-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS appointments CASCADE;
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- DROP TABLE IF EXISTS testimonials CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;

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

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

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

-- Insert initial services data
INSERT INTO services (name, description, price, duration_minutes, image_url) VALUES
('Piano Lessons', 'Learn to play piano with professional instruction tailored to your skill level. From beginner basics to advanced techniques, I will guide you through proper technique, music theory, and repertoire development.', 75.00, 60, '/images/professional-piano-lesson-teacher-student-studio.jpg'),
('Guitar Lessons', 'Master the guitar with personalized lessons covering acoustic and electric guitar techniques. Learn chords, scales, fingerpicking, and your favorite songs in various musical styles.', 70.00, 60, '/images/professional-guitar-music-lesson-teacher-student.jpg'),
('Violin Lessons', 'Develop proper violin technique and musicianship through structured lessons. Focus on bowing techniques, intonation, vibrato, and classical as well as contemporary repertoire.', 80.00, 60, '/images/professional-violin-music-lesson-instruction.jpg'),
('Music Theory', 'Comprehensive music theory lessons to enhance your understanding of music. Learn harmony, composition, analysis, and how theory applies to your instrument of choice.', 65.00, 45, '/images/elegant_vintage_sheet_music_background.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert testimonials data
INSERT INTO testimonials (author, content, author_role) VALUES
('Sarah Johnson', 'My daughter has been taking piano lessons for over a year now and her progress has been incredible. The patience and encouragement she receives makes every lesson enjoyable and productive.', 'Parent of Piano Student'),
('Mike Rodriguez', 'As an adult beginner, I was nervous about starting guitar lessons, but the teaching approach made me feel comfortable from day one. I am now playing songs I never thought possible!', 'Adult Guitar Student'),
('Emily Chen', 'The violin instruction I receive is exceptional. The focus on proper technique and musical expression has helped me develop not just as a player, but as a musician.', 'Advanced Violin Student'),
('Robert Thompson', 'Music theory seemed impossible to understand until I started these lessons. Everything is explained clearly with practical examples that connect to real music.', 'Music Theory Student'),
('Lisa Martinez', 'After years of wanting to learn piano, I finally took the leap at age 35. The supportive teaching style and flexible scheduling made it possible to pursue my musical dreams.', 'Adult Piano Student'),
('David Kim', 'My son has gained so much confidence through his guitar lessons. Not only has his musical ability improved, but his overall self-esteem has grown tremendously.', 'Parent of Guitar Student')
ON CONFLICT (id) DO NOTHING;

-- Insert blog posts data
INSERT INTO blog_posts (title, slug, content, image_url) VALUES
('The Benefits of Learning Music as an Adult', 'benefits-learning-music-adult', 'Many adults believe it is too late to start learning a musical instrument, but this couldn''t be further from the truth. Learning music as an adult offers numerous cognitive, emotional, and social benefits.

Adult learners bring unique advantages to music education: discipline, life experience, and clear goals. Unlike children, adults can appreciate the theoretical aspects of music and often progress rapidly in areas like music theory and composition.

Research shows that learning music as an adult can improve memory, enhance cognitive flexibility, and even delay age-related cognitive decline. The neuroplasticity of the adult brain means that new neural pathways can still be formed and strengthened through musical practice.

Additionally, music provides an excellent outlet for stress relief and emotional expression. Many of my adult students find that their weekly music lessons become a cherished break from their busy professional lives.

Whether you are picking up where you left off in childhood or starting completely fresh, it is never too late to begin your musical journey. The key is finding the right instructor who understands the unique needs and goals of adult learners.', '/images/elegant_music_notes_sheet_pattern_background.jpg'),
('Choosing Your First Instrument: A Guide for Beginners', 'choosing-first-instrument-guide-beginners', 'Selecting your first musical instrument is an exciting decision that will shape your musical journey. Here are key factors to consider when making this important choice.

**Consider Your Musical Preferences**
Think about the type of music you most enjoy listening to. If you love classical music, piano or violin might be ideal. Rock and pop fans often gravitate toward guitar, while jazz enthusiasts might consider piano or saxophone.

**Physical Considerations**
Some instruments require specific physical attributes. Guitar requires finger strength and dexterity, while wind instruments need good lung capacity. Piano is accessible to almost everyone and provides an excellent foundation for understanding music theory.

**Practice Space and Volume**
Consider your living situation. Acoustic instruments like violin and guitar can be practiced with mutes or played at lower volumes. Piano offers digital options with headphones, making it neighbor-friendly.

**Budget Considerations**
Factor in not just the initial instrument cost, but ongoing expenses like lessons, maintenance, and accessories. Piano students can start with a digital keyboard, while string instruments can be rented initially.

**Long-term Commitment**
Consider which instrument you can envision yourself playing for years to come. The most important factor is choosing an instrument that genuinely excites you and motivates you to practice regularly.

Remember, there is no perfect first instrument - only the perfect instrument for you. Take time to try different options and consult with a music teacher who can provide personalized guidance based on your goals and circumstances.', '/images/elegant-grand-piano-keys-close-up-dramatic-lighting.jpg'),
('Building Effective Practice Habits', 'building-effective-practice-habits', 'Developing consistent and effective practice habits is crucial for musical progress. Quality practice time is more valuable than long, unfocused sessions.

**Establish a Regular Schedule**
Consistency is key to building muscle memory and maintaining progress. Even 15-20 minutes of daily practice is more beneficial than one long session per week. Choose a time when you can focus without distractions.

**Set Specific Goals**
Instead of just "practicing piano," set specific objectives like "master the left hand of measure 16-32" or "play the scale exercise at 120 BPM." Specific goals make practice sessions more productive and measurable.

**Use a Practice Journal**
Track your practice sessions, noting what you worked on, challenges encountered, and goals for next time. This helps identify patterns and ensures you address all areas that need improvement.

**Practice Slowly**
Speed comes with accuracy and muscle memory. Always practice new material slowly enough to play it perfectly, then gradually increase the tempo. Playing fast but sloppy creates bad habits that are difficult to unlearn.

**Break Down Difficult Sections**
When you encounter challenging passages, isolate them and practice them separately. Work on just a few measures at a time until they become comfortable, then integrate them back into the full piece.

**End on a Positive Note**
Always conclude your practice session by playing something you enjoy and can perform well. This leaves you feeling accomplished and motivated for your next practice session.

Remember, effective practice is about problem-solving and mindful repetition, not mindless repetition. Quality always trumps quantity in music practice.', '/images/elegant_piano_keys_close_up_warm_light.jpg'),
('The Importance of Music Theory in Modern Learning', 'importance-music-theory-modern-learning', 'Music theory might seem like an intimidating subject, but it serves as the foundation for understanding how music works. Whether you''re a beginner or an advanced player, theory knowledge enhances your musical experience in countless ways.

**Understanding Musical Language**
Music theory is like learning the grammar of a language. It helps you understand why certain chord progressions sound pleasing, how melodies are constructed, and how different musical elements work together to create emotion and meaning.

**Improved Communication**
When you understand theory, you can communicate more effectively with other musicians. Terms like "dominant seventh" or "relative minor" become tools that help you collaborate and learn from others more efficiently.

**Enhanced Creativity**
Contrary to popular belief, theory doesn''t limit creativity—it enhances it. Understanding the rules gives you a foundation from which to break them purposefully. Many of the greatest musical innovations came from composers who thoroughly understood traditional theory.

**Faster Learning**
With theoretical knowledge, you can recognize patterns in music that would otherwise seem random. This pattern recognition accelerates your ability to learn new pieces and understand different musical styles.

**Better Improvisation**
Whether you''re playing jazz, blues, or just jamming with friends, theory knowledge provides a roadmap for improvisation. You''ll understand which notes and chords work well together, giving you confidence to explore and express yourself musically.

Remember, theory should complement your playing, not replace the joy of making music. The goal is to enhance your understanding and enjoyment of this beautiful art form.', '/images/vintage_distressed_music_notes_sheet_background_pattern.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Create admin user (optional - you can also do this through Supabase Auth UI)
-- Note: Replace with your actual admin email and a secure password
-- This is just a template - you should create the admin user through Supabase dashboard

-- SELECT 'Database setup complete! You can now:'
-- SELECT '1. Create an admin user in Supabase Auth'
-- SELECT '2. Test the website booking system'
-- SELECT '3. Access the admin dashboard'
-- SELECT '4. Manage content through the admin interface'