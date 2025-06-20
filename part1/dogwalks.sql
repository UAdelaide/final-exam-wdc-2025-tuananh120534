DROP DATABASE IF EXISTS DogWalkService;
CREATE DATABASE DogWalkService;
USE DogWalkService;
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('owner', 'walker') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Dogs (
    dog_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    size ENUM('small', 'medium', 'large') NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);

CREATE TABLE WalkRequests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    dog_id INT NOT NULL,
    requested_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
);

CREATE TABLE WalkApplications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    walker_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
    FOREIGN KEY (walker_id) REFERENCES Users(user_id),
    CONSTRAINT unique_application UNIQUE (request_id, walker_id)
);

CREATE TABLE WalkRatings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    walker_id INT NOT NULL,
    owner_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
    FOREIGN KEY (walker_id) REFERENCES Users(user_id),
    FOREIGN KEY (owner_id) REFERENCES Users(user_id),
    CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
);

INSERT INTO Users (username, email, password_hash, role)
VALUES
 ('alice123', 'alice@example.com', 'hashed123', 'owner'),
 ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
 ('carol123', 'carol@example.com', 'hashed789', 'owner'),
 ('phuc', 'phuc@example.com', 'hashed123456', 'walker'),
 ('anh', 'anh@example.com', 'hashed1234', 'owner');


INSERT INTO Dogs (owner_id, name, size)
VALUES
 ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
 ((SELECT user_id FROM Users WHERE username = 'bob123'), 'Thinh', 'small'),
 ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'large'),
 ((SELECT user_id FROM Users WHERE username = 'phuc'), 'Thai', 'medium'),
 ((SELECT user_id FROM Users WHERE username = 'anh'), 'Khai', 'small');


INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES
 ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-8 07:00:00', 30, 'Parklands', 'open'),
 ((SELECT dog_id FROM Dogs WHERE name = 'Thinh'), '2025-06-9 16:30:00', 40, 'Zoo', 'accepted'),
 ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-9 10:30:00', 45, 'Beachside Ave', 'accepted'),
 ((SELECT dog_id FROM Dogs WHERE name = 'Thai'), '2025-06-13 13:15:00', 50, 'Botanic Garden', 'open'),
 ((SELECT dog_id FROM Dogs WHERE name = 'Khai'), '2025-06-12 17:00:00', 60, 'Beach', 'open');