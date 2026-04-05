CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) ,
    google_id TEXT,
    coins NUMERIC(10,2) NOT NULL DEFAULT 1000,
    wins INT DEFAULT 0 ,
    ip TEXT,
    last_claim BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);