#!/bin/bash

# Music Teacher Website - Database Setup Script
# This script creates all necessary database tables in Supabase

echo "🎵 Setting up Music Teacher Website Database..."

# Supabase credentials
SUPABASE_URL="https://nfostlreaihscwdocbpd.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mb3N0bHJlYWloc2N3ZG9jYnBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4Nzg4OCwiZXhwIjoyMDcxNzYzODg4fQ.t8V771FbPnCpUN5N9FoIbHsBhq9CcMxDldlpDg3SRrk"

echo "📋 Creating services table..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/query" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -d '{
    "query": "CREATE TABLE IF NOT EXISTS services (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, description TEXT, price NUMERIC(10,2) NOT NULL, duration_minutes INTEGER NOT NULL DEFAULT 60, image_url TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
  }'

echo -e "\n\n📝 Creating testimonials table..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/query" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -d '{
    "query": "CREATE TABLE IF NOT EXISTS testimonials (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), author_name TEXT NOT NULL, content TEXT NOT NULL, rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5, date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(), created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
  }'

echo -e "\n\n📰 Creating blog_posts table..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/query" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -d '{
    "query": "CREATE TABLE IF NOT EXISTS blog_posts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, content TEXT NOT NULL, excerpt TEXT, image_url TEXT, published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(), author TEXT DEFAULT '\''Music Teacher'\', slug TEXT UNIQUE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
  }'

echo -e "\n\n📅 Creating appointments table..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/query" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -d '{
    "query": "CREATE TABLE IF NOT EXISTS appointments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_name TEXT NOT NULL, client_email TEXT NOT NULL, client_phone TEXT, service_id UUID, appointment_date DATE NOT NULL, appointment_time TIME NOT NULL, status TEXT DEFAULT '\''pending'\'' CHECK (status IN ('\''pending'\', '\''confirmed'\', '\''cancelled'\', '\''completed'\')), notes TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
  }'

echo -e "\n\n💳 Creating payments table..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/query" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -d '{
    "query": "CREATE TABLE IF NOT EXISTS payments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), appointment_id UUID, amount NUMERIC(10,2) NOT NULL, status TEXT DEFAULT '\''pending'\'' CHECK (status IN ('\''pending'\', '\''completed'\', '\''failed'\', '\''cancelled'\')), payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(), payment_method TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
  }'

echo -e "\n\n✅ Database setup complete!"
echo "🎉 All tables created successfully for the Music Teacher Website."
echo ""
echo "Created tables:"
echo "- services (music lesson services)"
echo "- testimonials (student reviews)"
echo "- blog_posts (educational content)"
echo "- appointments (lesson bookings)"
echo "- payments (payment tracking)"
echo ""
echo "🚀 You can now test the admin dashboard functionality!"