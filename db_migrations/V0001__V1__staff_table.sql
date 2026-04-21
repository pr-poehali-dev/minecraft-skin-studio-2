CREATE TABLE t_p95279231_minecraft_skin_studi.staff (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(200) NOT NULL,
  role VARCHAR(50) DEFAULT 'worker',
  works_count INT DEFAULT 0,
  experience_text VARCHAR(200),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);