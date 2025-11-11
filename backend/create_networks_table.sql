CREATE DATABASE IF NOT EXISTS ngoindia_db;
USE ngoindia_db;

CREATE TABLE IF NOT EXISTS networks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ngo_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    focus_area VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    members INT DEFAULT 0,
    projects INT DEFAULT 0,
    logo TEXT,
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2,1) DEFAULT 4.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);