CREATE TABLE t_p95279231_minecraft_skin_studi.reviews (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(200) NOT NULL,
  rating INT NOT NULL,
  text TEXT NOT NULL,
  tg_username VARCHAR(200),
  is_approved BOOLEAN DEFAULT FALSE,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p95279231_minecraft_skin_studi.gallery (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(200),
  uploaded_by_name VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p95279231_minecraft_skin_studi.counters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  value INT DEFAULT 0
);