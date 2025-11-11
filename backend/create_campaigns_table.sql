CREATE TABLE IF NOT EXISTS fund_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    full_story TEXT NOT NULL,
    goal DECIMAL(12,2) NOT NULL,
    raised DECIMAL(12,2) DEFAULT 0,
    category ENUM('education', 'healthcare', 'water', 'food', 'skills', 'empowerment', 'environment', 'emergency') NOT NULL,
    end_date DATE NOT NULL,
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    organizer_phone VARCHAR(20) NOT NULL,
    image_url VARCHAR(500) NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);