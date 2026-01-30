CREATE TABLE IF NOT EXISTS dialogs (
    id SERIAL PRIMARY KEY,
    message VARCHAR(1000),
    user_id BIGINT NOT NULL,
    friend_id BIGINT NOT NULL,

    CONSTRAINT fk_friends_user
     FOREIGN KEY (user_id)
     REFERENCES users(id)
     ON DELETE CASCADE,

    CONSTRAINT fk_friends_friend
     FOREIGN KEY (friend_id)
     REFERENCES users(id)
     ON DELETE CASCADE
)