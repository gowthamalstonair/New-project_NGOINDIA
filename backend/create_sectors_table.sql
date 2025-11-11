CREATE DATABASE IF NOT EXISTS ngoindia_db;
USE ngoindia_db;

CREATE TABLE IF NOT EXISTS sectors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sector_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'Target',
    color VARCHAR(50) DEFAULT 'bg-blue-500',
    ngo_count INT DEFAULT 0,
    active_discussions INT DEFAULT 0,
    resources INT DEFAULT 0,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default sectors
INSERT IGNORE INTO sectors (sector_name, description, icon, color, ngo_count, active_discussions, resources) VALUES
('Education', 'Empowering communities through quality education and skill development', 'BookOpen', 'bg-blue-500', 10, 23, 45),
('Healthcare', 'Providing accessible healthcare services and medical support', 'Target', 'bg-green-500', 10, 18, 32),
('Environment', 'Protecting nature and promoting sustainable development', 'Globe', 'bg-emerald-500', 10, 15, 28),
('Women Empowerment', 'Supporting women through skill development and leadership programs', 'Users', 'bg-pink-500', 10, 21, 38);