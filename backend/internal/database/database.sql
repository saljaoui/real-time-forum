-- database: :memory:

CREATE TABLE user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname text   not NULL UNIQUE,
    -- age text   not NULL,
    age INT CHECK (age BETWEEN 16 AND 100),
    gender TEXT NOT NULL CHECK (gender = 'Male' OR gender = 'Female'),
    firstname text   not NULL,
    lastname text not NULL,
    email TEXT NOT NULL UNIQUE CHECK (email LIKE '%@%.%'),
    password text not NULL,
    expires DATETIME,
    CreateAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UUID text,
    status text
);

CREATE TABLE post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    card_id INTEGER,
    FOREIGN KEY (card_id) REFERENCES card(id)
);

CREATE TABLE category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text not NULL
);


CREATE TABLE post_category (
    post_id INTEGER,
    category_id INTEGER,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES post(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE card (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE comment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER,
    target_id INTEGER,
    FOREIGN KEY (card_id) REFERENCES card(id),
    FOREIGN KEY (target_id) REFERENCES card(id)
);

CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    reaction_type INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (card_id) REFERENCES card(id),
    UNIQUE(user_id, card_id)
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    message TEXT NOT NULL,
    sent_at TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES user(id),
    FOREIGN KEY (receiver_id) REFERENCES user(id)
);

INSERT INTO category (name) VALUES ('General');
INSERT INTO category (name) VALUES ('Technology');
INSERT INTO category (name) VALUES ('Sports');
INSERT INTO category (name) VALUES ('Entertainment');
INSERT INTO category (name) VALUES ('Science');
INSERT INTO category (name) VALUES ('Food');
INSERT INTO category (name) VALUES ('Travel');
INSERT INTO category (name) VALUES ('Fashion');
INSERT INTO category (name) VALUES ('Art');
INSERT INTO category (name) VALUES ('Music');