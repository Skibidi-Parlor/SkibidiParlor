DROP TABLE IF EXISTS user_account;
CREATE TABLE user_account(id SERIAL PRIMARY KEY,
                          username VARCHAR(255) NOT NULL,
                          nickname VARCHAR(255),
                          email VARCHAR(255) NOT NULL,
                          passwordHash TEXT NOT NULL,
                          pfp_path TEXT);

DROP TABLE IF EXISTS game;
CREATE TABLE game(id SERIAL PRIMARY KEY,
                  name VARCHAR(255) NOT NULL);

DROP TABLE IF EXISTS scores;
CREATE TABLE scores(id SERIAL PRIMARY KEY,
                    user_id INTEGER,
                    game_id INTEGER,
                    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user_account(id) ON UPDATE CASCADE ON DELETE CASCADE,
                    CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES game(id) ON UPDATE CASCADE ON DELETE CASCADE,
                    points INTEGER,
                    timestamp timestamp);



ALTER SEQUENCE user_account_id_seq RESTART WITH 1;
ALTER SEQUENCE game_id_seq RESTART WITH 1;
ALTER SEQUENCE game_id_seq RESTART WITH 1;


INSERT INTO user_account(username, nickname, email, passwordHash, pfp_path)
VALUES
('chillwafflez', 'Justin Nguyen', 'chillwafflez@gmail.com', 'blahblahblah', 'https://random.image/img1.jpg'),
('saltybagels', 'Justine Nagooyen', 'skibidi@gmail.com', 'blahblahblah', 'https://random.image/img2.jpg');

INSERT INTO game(name)
VALUES
('Trivia Night'),
('Topping Trouble'),
('4x4 Matcher Game');

INSERT INTO scores(user_id, game_id, points, timestamp)
VALUES
(1, 1, 5, '2024-09-18 10:30:00'),
(1, 1, 2, '2024-09-18 10:34:12'),
(1, 2, 7, '2024-09-18 10:34:12'),
(1, 2, 2, '2024-09-18 10:34:12'),
(1, 2, 9, '2024-09-18 10:34:12'),
(1, 3, 10, '2024-09-18 10:34:12'),
(2, 1, 5, '2024-09-18 10:30:00'),
(2, 1, 2, '2024-09-18 10:34:12'),
(2, 1, 1, '2024-09-18 10:34:12'),
(2, 2, 2, '2024-09-18 10:34:12'),
(2, 3, 1, '2024-09-18 10:34:12'),
(2, 3, 5, '2024-09-18 10:34:12'),
(2, 3, 8, '2024-09-18 10:34:12');