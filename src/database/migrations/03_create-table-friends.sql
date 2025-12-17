CREATE TABLE IF NOT EXISTS friends (
  user_id   BIGINT NOT NULL,
  friend_id BIGINT NOT NULL,

  CONSTRAINT pk_friends PRIMARY KEY (user_id, friend_id),

  CONSTRAINT fk_friends_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_friends_friend
    FOREIGN KEY (friend_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
