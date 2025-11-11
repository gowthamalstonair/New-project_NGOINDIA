CREATE DATABASE IF NOT EXISTS ngoindia_db;
USE ngoindia_db;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    purpose VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    budget_allocation JSON,
    status VARCHAR(50) DEFAULT 'active',
    progress INT DEFAULT 0,
    spent DECIMAL(15,2) DEFAULT 0.00,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);