CREATE TABLE IF NOT EXISTS legal_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_name VARCHAR(255) NOT NULL,
    policy_type VARCHAR(100) NOT NULL,
    description TEXT,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size INT,
    uploaded_by VARCHAR(100) NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    effective_date DATE,
    expiry_date DATE,
    status ENUM('Active', 'Draft', 'Expired', 'Archived') DEFAULT 'Active',
    version VARCHAR(50) DEFAULT '1.0',
    department VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);