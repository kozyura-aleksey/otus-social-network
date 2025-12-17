CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    text TEXT NOT NULL,
    user_id BIGINT NOT NULL,

    CONSTRAINT fk_users_user_id
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);
