@@ .. @@
 CREATE TABLE IF NOT EXISTS contact_messages (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   phone VARCHAR(50),
   message TEXT NOT NULL,
   inquiry_type VARCHAR(50) NOT NULL DEFAULT 'general',
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
-  is_read BOOLEAN DEFAULT FALSE
+  is_read BOOLEAN DEFAULT FALSE,
+  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
 );