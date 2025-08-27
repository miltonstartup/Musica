-- Sample data for services
INSERT INTO services (name, description, price, duration_minutes, image_url) VALUES
('Clases de Piano', 'Aprende piano desde cero o perfecciona tu técnica con nuestro método personalizado.', 45.00, 60, '/images/elegant-piano-lesson-teacher-student-studio.jpg'),
('Clases de Guitarra', 'Domina la guitarra acústica o eléctrica con técnicas modernas y clásicas.', 40.00, 60, '/images/professional-guitar-music-lesson-teacher-student.jpg'),
('Clases de Violín', 'Desarrolla tu habilidad en el violín con un enfoque técnico y expresivo.', 50.00, 60, '/images/professional-violin-music-lesson.jpg'),
('Teoría Musical', 'Comprende los fundamentos de la música: armonía, ritmo y composición.', 35.00, 45, '/images/elegant_vintage_sheet_music_background.jpg')
ON CONFLICT DO NOTHING;

-- Sample data for testimonials
INSERT INTO testimonials (author_name, content, rating) VALUES
('María González', 'Excelente profesora, muy paciente y dedicada. Mis hijos han aprendido muchísimo.', 5),
('Carlos Rodríguez', 'Las clases de guitarra superaron mis expectativas. Recomiendo totalmente.', 5),
('Ana Martínez', 'Profesionalismo y calidad en cada clase. Mi hija está encantada con el piano.', 5),
('José López', 'Métodos de enseñanza muy efectivos. He progresado más de lo que imaginaba.', 4)
ON CONFLICT DO NOTHING;

-- Sample data for blog posts
INSERT INTO blog_posts (title, content, excerpt, slug) VALUES
('Beneficios de Aprender Música en la Infancia', 
 'La música es una herramienta poderosa para el desarrollo cognitivo de los niños. Estudios han demostrado que aprender un instrumento musical mejora la memoria, la concentración y las habilidades matemáticas. Además, la música fomenta la creatividad y la expresión emocional, proporcionando a los niños una salida saludable para sus sentimientos. Los niños que aprenden música también desarrollan mejor disciplina y paciencia, habilidades que les servirán en todas las áreas de la vida.', 
 'Descubre cómo la música potencia el desarrollo cognitivo infantil.',
 'beneficios-musica-infancia'),
('Cómo Elegir tu Primer Instrumento Musical', 
 'Elegir el primer instrumento es una decisión importante que puede marcar tu relación con la música para toda la vida. Considera factores como tu edad, gustos musicales y objetivos. El piano es excelente para principiantes porque permite visualizar la teoría musical fácilmente. La guitarra es portátil y versátil, perfecta para tocar diferentes estilos. El violín ofrece expresividad única pero requiere más paciencia inicial. Sea cual sea tu elección, lo importante es comenzar con entusiasmo y dedicación.', 
 'Guía completa para seleccionar el instrumento perfecto para ti.',
 'elegir-primer-instrumento'),
('La Importancia de la Práctica Diaria', 
 'La constancia es clave en el aprendizaje musical. Dedicar tiempo diario, aunque sean 15-20 minutos, es más efectivo que sesiones largas esporádicas. La práctica regular desarrolla la memoria muscular y mejora la técnica gradualmente. Establece una rutina fija, crea un espacio de práctica cómodo y establece metas pequeñas y alcanzables. Recuerda que el progreso musical es como construir una casa: ladrillo a ladrillo, día a día.', 
 'Tips para mantener una rutina de práctica efectiva.',
 'importancia-practica-diaria')
ON CONFLICT (slug) DO NOTHING;