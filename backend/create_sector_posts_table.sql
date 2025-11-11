CREATE TABLE IF NOT EXISTS sector_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    type ENUM('Need Help', 'Can Help') NOT NULL,
    urgency ENUM('Immediate', 'This Week', 'This Month') NOT NULL,
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    responses INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);