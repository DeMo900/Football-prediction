CREATE TYPE bet_status AS ENUM ('pending', 'won', 'lost');
CREATE TYPE predection AS ENUM ('home', 'draw', 'away');
CREATE TABLE bets (
id SERIAL PRIMARY KEY,
user_id INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
game_id INT NOT NULL,
prediction predection NOT NULL,
amount NUMERIC(10,2) NOT NULL,
status bet_status DEFAULT 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);