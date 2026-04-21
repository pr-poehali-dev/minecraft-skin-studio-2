CREATE TABLE t_p95279231_minecraft_skin_studi.order_messages (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  sender_type VARCHAR(20) NOT NULL,
  sender_name VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);