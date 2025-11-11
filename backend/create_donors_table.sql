CREATE DATABASE IF NOT EXISTS ngoindia_db;
USE ngoindia_db;

CREATE TABLE IF NOT EXISTS donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    donation_type VARCHAR(50) NOT NULL,
    purpose VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);