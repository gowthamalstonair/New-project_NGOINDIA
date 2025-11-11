USE ngoindia_db;

CREATE TABLE IF NOT EXISTS partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level ENUM('local', 'regional', 'national', 'international') NOT NULL,
    address TEXT NULL,
    country VARCHAR(100) DEFAULT 'India',
    region VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    description TEXT NULL,
    website VARCHAR(255) NULL,
    established VARCHAR(10) NULL,
    status ENUM('active', 'pending', 'inactive') DEFAULT 'pending',
    projects JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_partners_name ON partners(name);
CREATE INDEX idx_partners_level ON partners(level);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partners_created_at ON partners(created_at);