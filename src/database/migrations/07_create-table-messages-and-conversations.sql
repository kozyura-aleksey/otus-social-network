CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
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
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id BIGINT,
    sender_id BIGINT,
    message TEXT,
    created_at TIMESTAMP,

    CONSTRAINT fk_messages_conversations
     FOREIGN KEY (conversation_id)
     REFERENCES conversations(id)
     ON DELETE CASCADE
);

CREATE UNIQUE INDEX conversations_pair_idx
ON conversations (
  LEAST(user_id, friend_id),
  GREATEST(user_id, friend_id)
);

