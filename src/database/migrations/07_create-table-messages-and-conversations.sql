CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
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
    id BIGSERIAL,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message TEXT,
    created_at TIMESTAMP,

    PRIMARY KEY (conversation_id, id),

    CONSTRAINT fk_messages_conversations
        FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE
);

SELECT create_reference_table('users');

SELECT create_distributed_table('conversations', 'id');

SELECT create_distributed_table('messages', 'conversation_id');


