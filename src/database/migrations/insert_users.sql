INSERT INTO users ("first_name", "last_name", "city", "birth_date", "gender", "email", "password")
SELECT 
    first_name,
    last_name,
    city,
    birth_date,
    gender,
    lower(first_name || '.' || last_name || substring(md5(random()::text) from 1 for 6) || '@example.com') AS email,
    '$2b$05$hRv7EEsdwmw3BIFXPlPQzusuSLankMPDSEetjCplyKRJNHZcV1nV6' AS password -- пароль password для всех пользоавтелей
FROM (
    SELECT
        (ARRAY[
            'Иван','Александр','Кирилл','Михаил','Дмитрий','Василий','Роберт',
            'Павел','Сергей','Егор','Андрей','Антон','Максим','Олег','Владимир',
            'Николай','Георгий','Тимофей','Ярослав','Артур'
        ])[floor(random() * 20 + 1)] AS first_name,

        (ARRAY[
            'Абрамов','Иванов','Петров','Сидоров','Фёдоров','Орлов','Смирнов',
            'Кузнецов','Попов','Васильев','Новиков','Морозов','Егоров','Соловьёв',
            'Волков','Зайцев','Беляев','Тарасов','Куликов','Макаров'
        ])[floor(random() * 20 + 1)] AS last_name,

        (ARRAY[
            'Москва','Санкт-Петербург','Калининград','Севастополь','Казань',
            'Екатеринбург','Новосибирск','Самара','Омск','Челябинск','Ростов-на-Дону',
            'Уфа','Красноярск','Воронеж','Пермь','Волгоград','Саратов',
            'Тюмень','Иркутск','Барнаул'
        ])[floor(random() * 20 + 1)] AS city,

        date '1950-01-01' + (trunc(random() * 24000)::int) * interval '1 day' AS birth_date,

        (ARRAY['male', 'female'])[floor(random() * 2 + 1)] AS gender
    FROM generate_series(1, 1000000)
) AS t;


