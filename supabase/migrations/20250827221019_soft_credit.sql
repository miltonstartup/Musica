@@ .. @@
 -- Appointments policies - public can create, authenticated can manage
 DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
-CREATE POLICY "Anyone can create appointments" ON appointments FOR INSERT WITH CHECK (true);
+CREATE POLICY "Public can create appointments" ON appointments 
+FOR INSERT TO anon, authenticated WITH CHECK (true);
 
 DROP POLICY IF EXISTS "Anyone can view appointments" ON appointments;
-CREATE POLICY "Anyone can view appointments" ON appointments FOR SELECT USING (true);
+CREATE POLICY "Public can view appointments" ON appointments 
+FOR SELECT TO anon, authenticated USING (true);
 
 DROP POLICY IF EXISTS "Authenticated users can manage appointments" ON appointments;
 CREATE POLICY "Authenticated users can manage appointments" ON appointments 
-FOR UPDATE USING (auth.role() = 'authenticated');
+FOR UPDATE TO authenticated USING (true);
 
 DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;
 CREATE POLICY "Authenticated users can delete appointments" ON appointments 
-FOR DELETE USING (auth.role() = 'authenticated');
+FOR DELETE TO authenticated USING (true);