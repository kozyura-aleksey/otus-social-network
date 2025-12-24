INSERT INTO friends (user_id, friend_id)
SELECT
  u.user_id,
  f.friend_id
FROM generate_series(1, 100) AS u(user_id)
JOIN generate_series(1, 100) AS f(friend_id)
  ON f.friend_id <> u.user_id
ON CONFLICT DO NOTHING;
