INSERT INTO posts (user_id, text)
SELECT
  gs,
  CASE (random() * 5)::int
    WHEN 0 THEN 'Сегодня отличный день'
    WHEN 1 THEN 'Работаю над новым проектом'
    WHEN 2 THEN 'Вышел на прогулку'
    WHEN 3 THEN 'Пью кофе и думаю о жизни'
    ELSE 'Это мой очередной пост'
  END
FROM generate_series(1, 1000000) gs;
