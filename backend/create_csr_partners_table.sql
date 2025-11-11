CREATE TABLE IF NOT EXISTS csr_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    website VARCHAR(255),
    csr_policy TEXT NOT NULL,
    focus_areas TEXT NOT NULL,
    status ENUM('pending', 'approved', 'active') DEFAULT 'pending',
    registration_date DATE NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0,
    total_funding DECIMAL(15,2) DEFAULT 0,
    active_projects INT DEFAULT 0,
    completed_projects INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);