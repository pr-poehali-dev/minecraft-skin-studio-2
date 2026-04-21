CREATE TABLE t_p95279231_minecraft_skin_studi.orders (
  id SERIAL PRIMARY KEY,
  order_number INT NOT NULL,
  client_nick VARCHAR(200) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  description TEXT,
  deadline VARCHAR(100),
  tg_username VARCHAR(200),
  ds_username VARCHAR(200),
  vk_username VARCHAR(200),
  status VARCHAR(50) DEFAULT 'new',
  assigned_to INT REFERENCES t_p95279231_minecraft_skin_studi.staff(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE
);