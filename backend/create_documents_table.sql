CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    ngo_name VARCHAR(255) NOT NULL,
    category ENUM('Education', 'Healthcare', 'Rural Development', 'Child Welfare', 'Education & Nutrition') NOT NULL,
    type ENUM('Annual Report', 'Impact Report', 'Project Report', 'Progress Report', 'Program Report', 'Research Paper', 'Strategy Document', 'Initiative Report') NOT NULL,
    description TEXT NOT NULL,
    tags TEXT,
    image VARCHAR(500),
    file_size VARCHAR(20),
    pages INT DEFAULT 0,
    upload_date DATE DEFAULT CURRENT_DATE,
    downloads INT DEFAULT 0,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);