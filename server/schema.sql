CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY, 
    email TEXT NOT NULL, 
    password TEXT NOT NULL
);