INSERT INTO Users (username, email, password_hash, role) VALUES
  ('alice123', 'alice@example.com', 'hashed123', 'owner'),
  ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
  ('carol123', 'carol@example.com', 'hashed789', 'owner'),
  ('phuc', 'phuc@example.com', 'hashed1234', 'walker'),
  ('anh', 'anh@example.com', 'hashed12345', 'owner');




INSERT INTO Dogs (owner_id, name, size) VALUES
  ((SELECT user_id FROM Users WHERE username='alice123'), 'Max', 'medium'),
  ((SELECT user_id FROM Users WHERE username='bob123'), 'Khai', 'small'),
  ((SELECT user_id FROM Users WHERE username='carol123'), 'Bella', 'small'),
  ((SELECT user_id FROM Users WHERE username='phuc123'), 'Thinh', 'small'),
  ((SELECT user_id FROM Users WHERE username='anh123'), 'Duong', 'medium');




INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
  ((SELECT dog_id FROM Dogs WHERE name='Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
  ((SELECT dog_id FROM Dogs WHERE name='Rocky'), '2025-06-11 7:00:00', 15, 'Parklands', 'open'),
  ((SELECT dog_id FROM Dogs WHERE name='Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
  ((SELECT dog_id FROM Dogs WHERE name='Milo'), '2025-06-12 10:30:00', 20, 'Beachside Ave', 'open'),
  ((SELECT dog_id FROM Dogs WHERE name='Luna'), '2025-06-12 12:00:00', 60, 'Botanic Garden', 'accepted');