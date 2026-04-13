ALTER TABLE bets
ADD CONSTRAINT check_amount CHECK (amount > 0);
ALTER TABLE users 
ADD CONSTRAINT check_coins CHECK (coins >= 0);
