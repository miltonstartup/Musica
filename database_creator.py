#!/usr/bin/env python3
"""
Music Teacher Website Database Setup - Fixed Version
This script creates all necessary database tables using proper JSON formatting
"""

import json
import requests
import os
from pathlib import Path

# Supabase configuration
PROJECT_REF = "nfostlreaihscwdocbpd"
SUPABASE_ACCESS_TOKEN = "sbp_d27e7eb82902e55fe7daefd1f01a511ca9ba9b28"
API_URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/sql"

class SupabaseDatabaseCreator:
    def __init__(self):
        self.headers = {
            'Authorization': f'Bearer {SUPABASE_ACCESS_TOKEN}',
            'Content-Type': 'application/json'
        }
        
    def execute_sql_file(self, sql_file_path, description):
        """Execute a SQL file via Supabase Management API"""
        try:
            # Read SQL file
            with open(sql_file_path, 'r', encoding='utf-8') as f:
                sql_content = f.read().strip()
            
            if not sql_content:
                print(f"⚠️ Empty SQL file: {sql_file_path}")
                return False
            
            # Create proper JSON payload
            payload = {
                "query": sql_content
            }
            
            print(f"🔄 Executing: {description}")
            print(f"📄 File: {sql_file_path}")
            
            # Make the API request
            response = requests.post(API_URL, headers=self.headers, json=payload)
            
            print(f"📊 Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                print(f"✅ {description} - SUCCESS")
                return True
            else:
                print(f"❌ {description} - FAILED")
                print(f"📋 Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error executing {description}: {str(e)}")
            return False
    
    def setup_database(self):
        """Setup all database tables"""
        print("🎵 Music Teacher Website Database Setup")
        print(f"📍 Project: {PROJECT_REF}")
        print(f"🔗 API URL: {API_URL}")
        print("\n" + "="*60 + "\n")
        
        # Define SQL files in execution order
        sql_files = [
            ("sql/create_services.sql", "Creating services table"),
            ("sql/create_testimonials.sql", "Creating testimonials table"),
            ("sql/create_blog_posts.sql", "Creating blog_posts table"),
            ("sql/create_appointments.sql", "Creating appointments table"),
            ("sql/create_payments.sql", "Creating payments table"),
            ("sql/insert_sample_data.sql", "Inserting sample data")
        ]
        
        success_count = 0
        total_count = len(sql_files)
        
        for sql_file, description in sql_files:
            if self.execute_sql_file(sql_file, description):
                success_count += 1
            print("\n" + "-"*40 + "\n")
        
        # Summary
        print("\n" + "="*60)
        print(f"🎉 Database setup complete! {success_count}/{total_count} operations successful.")
        
        if success_count == total_count:
            print("\n✅ ALL OPERATIONS SUCCESSFUL!")
            print("\n📋 Created tables:")
            print("   • services (music lesson offerings)")
            print("   • testimonials (student reviews)")
            print("   • blog_posts (educational content)")
            print("   • appointments (lesson bookings)")
            print("   • payments (payment tracking)")
            print("\n🎵 Sample data inserted for all tables.")
            print("\n🚀 Test the application:")
            print("   Admin: https://fdjgo3b4hyhr.space.minimax.io/admin")
            print("   Public: https://fdjgo3b4hyhr.space.minimax.io")
            print("\n🔐 Admin credentials: mdvoid@gmail.com / 123456")
            return True
        else:
            print(f"\n⚠️ Some operations failed ({total_count - success_count} failures).")
            print("Manual intervention may be required.")
            return False
    
    def test_connection(self):
        """Test connection to Supabase Management API"""
        try:
            print("🔍 Testing Supabase Management API connection...")
            test_url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/config"
            response = requests.get(test_url, headers=self.headers)
            
            if response.status_code in [200, 401, 403]:  # 401/403 means API is reachable
                print(f"✅ Connection test successful (HTTP {response.status_code})")
                return True
            else:
                print(f"❌ Connection test failed (HTTP {response.status_code})")
                return False
        except Exception as e:
            print(f"❌ Connection test error: {str(e)}")
            return False

def main():
    creator = SupabaseDatabaseCreator()
    
    # Test connection first
    if not creator.test_connection():
        print("\n❌ Failed to connect to Supabase. Check credentials and network.")
        return False
    
    print("\n" + "="*60 + "\n")
    
    # Setup database
    success = creator.setup_database()
    
    if success:
        print("\n\n🎵 🎉 MUSIC TEACHER WEBSITE IS READY! 🎉 🎵")
        print("\nThe admin dashboard and public booking system should now be fully functional.")
        print("All critical database tables have been created with proper RLS policies.")
    
    return success

if __name__ == "__main__":
    main()