CREATE TABLE t_p95279231_minecraft_skin_studi.staff_messages (
  id SERIAL PRIMARY KEY,
  sender_name VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);