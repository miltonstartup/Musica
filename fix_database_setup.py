#!/usr/bin/env python3
"""
Music Teacher Website Database Setup
This script creates all necessary database tables in Supabase
"""

import requests
import json
import time

# Supabase configuration
SUPABASE_URL = "https://nfostlreaihscwdocbpd.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mb3N0bHJlYWloc2N3ZG9jYnBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4Nzg4OCwiZXhwIjoyMDcxNzYzODg4fQ.t8V771FbPnCpUN5N9FoIbHsBhq9CcMxDldlpDg3SRrk"

class SupabaseDatabaseSetup:
    def __init__(self):
        self.base_url = SUPABASE_URL
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'apikey': SUPABASE_SERVICE_ROLE_KEY
        }
    
    def create_table(self, table_name, table_sql):
        """Create a single table using direct SQL"""
        try:
            # Try different endpoints that might work
            endpoints = [
                f"{self.base_url}/rest/v1/rpc/query",
                f"{self.base_url}/rest/v1/rpc/exec_sql",
                f"{self.base_url}/sql",
            ]
            
            for endpoint in endpoints:
                print(f"🔄 Trying endpoint: {endpoint}")
                
                if 'sql' in endpoint:
                    # Direct SQL endpoint
                    response = requests.post(
                        endpoint,
                        headers=self.headers,
                        data=table_sql
                    )
                else:
                    # RPC endpoints
                    data = {"query": table_sql}
                    response = requests.post(
                        endpoint,
                        headers=self.headers,
                        json=data
                    )
                
                print(f"📊 Status: {response.status_code}")
                print(f"📋 Response: {response.text[:200]}...")
                
                if response.status_code in [200, 201]:
                    print(f"✅ Successfully created {table_name} table!")
                    return True
                elif response.status_code == 404:
                    print(f"❌ Endpoint {endpoint} not found, trying next...")
                    continue
                else:
                    print(f"⚠️ Failed with status {response.status_code}: {response.text}")
            
            print(f"❌ Failed to create {table_name} table with all endpoints")
            return False
            
        except Exception as e:
            print(f"❌ Error creating {table_name} table: {str(e)}")
            return False
    
    def create_all_tables(self):
        """Create all required tables for the music teacher website"""
        print("🎵 Starting Music Teacher Website Database Setup...\n")
        
        tables = {
            'services': '''
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
                CREATE POLICY IF NOT EXISTS "Public can view services" ON services FOR SELECT USING (true);
                CREATE POLICY IF NOT EXISTS "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');
            ''',
            
            'testimonials': '''
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
                CREATE POLICY IF NOT EXISTS "Public can view testimonials" ON testimonials FOR SELECT USING (true);
                CREATE POLICY IF NOT EXISTS "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
            ''',
            
            'blog_posts': '''
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
                CREATE POLICY IF NOT EXISTS "Public can view blog posts" ON blog_posts FOR SELECT USING (true);
                CREATE POLICY IF NOT EXISTS "Authenticated users can manage blog posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
            ''',
            
            'appointments': '''
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
                CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
                CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
                ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
                CREATE POLICY IF NOT EXISTS "Public can create appointments" ON appointments FOR INSERT WITH CHECK (true);
                CREATE POLICY IF NOT EXISTS "Authenticated users can manage appointments" ON appointments FOR ALL USING (auth.role() = 'authenticated');
            ''',
            
            'payments': '''
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
                CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
                ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
                CREATE POLICY IF NOT EXISTS "Authenticated users can manage payments" ON payments FOR ALL USING (auth.role() = 'authenticated');
            '''
        }
        
        success_count = 0
        for table_name, table_sql in tables.items():
            print(f"\n📋 Creating {table_name} table...")
            if self.create_table(table_name, table_sql):
                success_count += 1
            time.sleep(1)  # Brief pause between requests
        
        print(f"\n🎉 Database setup complete! {success_count}/{len(tables)} tables created successfully.")
        
        if success_count == len(tables):
            print("✅ All tables created successfully!")
            print("🚀 The admin dashboard should now work properly.")
            return True
        else:
            print("⚠️ Some tables failed to create. Manual setup may be required.")
            return False
    
    def test_connection(self):
        """Test the Supabase connection"""
        try:
            print("🔍 Testing Supabase connection...")
            response = requests.get(
                f"{self.base_url}/rest/v1/",
                headers=self.headers
            )
            print(f"📊 Connection test status: {response.status_code}")
            return response.status_code in [200, 404]  # 404 is OK for root endpoint
        except Exception as e:
            print(f"❌ Connection test failed: {str(e)}")
            return False

def main():
    setup = SupabaseDatabaseSetup()
    
    # Test connection first
    if not setup.test_connection():
        print("❌ Failed to connect to Supabase. Check your credentials.")
        return
    
    # Create all tables
    success = setup.create_all_tables()
    
    if success:
        print("\n🎵 Music Teacher Website database is ready!")
        print("\n📋 Created tables:")
        print("   - services (music lesson offerings)")
        print("   - testimonials (student reviews)")
        print("   - blog_posts (educational content)")
        print("   - appointments (lesson bookings)")
        print("   - payments (payment tracking)")
        print("\n🚀 You can now test the admin dashboard at:")
        print("   https://fdjgo3b4hyhr.space.minimax.io/admin")
    else:
        print("\n⚠️ Database setup incomplete. Some manual configuration may be needed.")

if __name__ == "__main__":
    main()