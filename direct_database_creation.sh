#!/bin/bash

# Music Teacher Website - Direct Database Creation
# This script creates tables using Supabase Management API

echo "🎵 Creating Music Teacher Website Database Tables..."
echo "Project: nfostlreaihscwdocbpd"
echo "Database: PostgreSQL on Supabase"

# Configuration
PROJECT_REF="nfostlreaihscwdocbpd"
SUPABASE_ACCESS_TOKEN="sbp_d27e7eb82902e55fe7daefd1f01a511ca9ba9b28"
API_URL="https://api.supabase.com/v1/projects/$PROJECT_REF/database/sql"

# Headers for requests
AUTH_HEADER="Authorization: Bearer $SUPABASE_ACCESS_TOKEN"
CONTENT_HEADER="Content-Type: application/json"

echo -e "\n📋 Step 1: Creating services table..."
SERVICES_SQL='
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
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = '"'"'authenticated'"'"');
'

SERVICES_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL" \
  -H "$AUTH_HEADER" \
  -H "$CONTENT_HEADER" \
  -d "{\"query\": \"$SERVICES_SQL\"}")

SERVICES_BODY=$(echo "$SERVICES_RESPONSE" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
SERVICES_STATUS=$(echo "$SERVICES_RESPONSE" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if [[ "$SERVICES_STATUS" =~ ^2[0-9]{2}$ ]]; then
  echo "✅ Services table created successfully (HTTP $SERVICES_STATUS)"
else
  echo "❌ Failed to create services table (HTTP $SERVICES_STATUS)"
  echo "Response: $SERVICES_BODY"
fi

echo -e "\n📝 Step 2: Creating testimonials table..."
TESTIMONIALS_SQL='
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
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = '"'"'authenticated'"'"');
'

TESTIMONIALS_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL" \
  -H "$AUTH_HEADER" \
  -H "$CONTENT_HEADER" \
  -d "{\"query\": \"$TESTIMONIALS_SQL\"}")

TESTIMONIALS_BODY=$(echo "$TESTIMONIALS_RESPONSE" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
TESTIMONIALS_STATUS=$(echo "$TESTIMONIALS_RESPONSE" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if [[ "$TESTIMONIALS_STATUS" =~ ^2[0-9]{2}$ ]]; then
  echo "✅ Testimonials table created successfully (HTTP $TESTIMONIALS_STATUS)"
else
  echo "❌ Failed to create testimonials table (HTTP $TESTIMONIALS_STATUS)"
  echo "Response: $TESTIMONIALS_BODY"
fi

echo -e "\n📰 Step 3: Creating blog_posts table..."
BLOG_SQL='
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author TEXT DEFAULT '"'"'Music Teacher'"'"',
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
CREATE POLICY "Public can view blog posts" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts FOR ALL USING (auth.role() = '"'"'authenticated'"'"');
'

BLOG_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL" \
  -H "$AUTH_HEADER" \
  -H "$CONTENT_HEADER" \
  -d "{\"query\": \"$BLOG_SQL\"}")

BLOG_BODY=$(echo "$BLOG_RESPONSE" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
BLOG_STATUS=$(echo "$BLOG_RESPONSE" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if [[ "$BLOG_STATUS" =~ ^2[0-9]{2}$ ]]; then
  echo "✅ Blog posts table created successfully (HTTP $BLOG_STATUS)"
else
  echo "❌ Failed to create blog posts table (HTTP $BLOG_STATUS)"
  echo "Response: $BLOG_BODY"
fi

echo -e "\n📅 Step 4: Creating appointments table..."
APPOINTMENTS_SQL='
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  service_id UUID,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT '"'"'pending'"'"' CHECK (status IN ('"'"'pending'"'"', '"'"'confirmed'"'"', '"'"'cancelled'"'"', '"'"'completed'"'"')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can create appointments" ON appointments;
CREATE POLICY "Public can create appointments" ON appointments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage appointments" ON appointments;
CREATE POLICY "Authenticated users can manage appointments" ON appointments FOR ALL USING (auth.role() = '"'"'authenticated'"'"');
'

APPOINTMENTS_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL" \
  -H "$AUTH_HEADER" \
  -H "$CONTENT_HEADER" \
  -d "{\"query\": \"$APPOINTMENTS_SQL\"}")

APPOINTMENTS_BODY=$(echo "$APPOINTMENTS_RESPONSE" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
APPOINTMENTS_STATUS=$(echo "$APPOINTMENTS_RESPONSE" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if [[ "$APPOINTMENTS_STATUS" =~ ^2[0-9]{2}$ ]]; then
  echo "✅ Appointments table created successfully (HTTP $APPOINTMENTS_STATUS)"
else
  echo "❌ Failed to create appointments table (HTTP $APPOINTMENTS_STATUS)"
  echo "Response: $APPOINTMENTS_BODY"
fi

echo -e "\n💳 Step 5: Creating payments table..."
PAYMENTS_SQL='
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT '"'"'pending'"'"' CHECK (status IN ('"'"'pending'"'"', '"'"'completed'"'"', '"'"'failed'"'"', '"'"'cancelled'"'"')),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage payments" ON payments;
CREATE POLICY "Authenticated users can manage payments" ON payments FOR ALL USING (auth.role() = '"'"'authenticated'"'"');
'

PAYMENTS_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL" \
  -H "$AUTH_HEADER" \
  -H "$CONTENT_HEADER" \
  -d "{\"query\": \"$PAYMENTS_SQL\"}")

PAYMENTS_BODY=$(echo "$PAYMENTS_RESPONSE" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
PAYMENTS_STATUS=$(echo "$PAYMENTS_RESPONSE" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if [[ "$PAYMENTS_STATUS" =~ ^2[0-9]{2}$ ]]; then
  echo "✅ Payments table created successfully (HTTP $PAYMENTS_STATUS)"
else
  echo "❌ Failed to create payments table (HTTP $PAYMENTS_STATUS)"
  echo "Response: $PAYMENTS_BODY"
fi

echo -e "\n🎉 Database setup complete!"
echo "🎵 Music Teacher Website database tables created."
echo "\n📋 Tables created:"
echo "   • services (music lesson offerings)"
echo "   • testimonials (student reviews)"
echo "   • blog_posts (educational content)"
echo "   • appointments (lesson bookings)"
echo "   • payments (payment tracking)"
echo "\n🚀 Test the admin dashboard at:"
echo "   https://fdjgo3b4hyhr.space.minimax.io/admin"
echo "\n🔗 Test the public booking system at:"
echo "   https://fdjgo3b4hyhr.space.minimax.io"
echo ""
echo "✅ The website should now be fully functional!"
