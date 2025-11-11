USE ngoindia_db;

CREATE TABLE IF NOT EXISTS grant_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20) NULL,
    organization_name VARCHAR(255) NULL,
    project_title VARCHAR(255) NOT NULL,
    project_description TEXT NOT NULL,
    requested_amount DECIMAL(12,2) NOT NULL,
    project_duration VARCHAR(100) NULL,
    category ENUM('education', 'healthcare', 'infrastructure', 'environment', 'other') NOT NULL,
    status ENUM('submitted', 'under_review', 'approved', 'rejected') DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_grant_applications_email ON grant_applications(applicant_email);
CREATE INDEX idx_grant_applications_status ON grant_applications(status);
CREATE INDEX idx_grant_applications_category ON grant_applications(category);
CREATE INDEX idx_grant_applications_created_at ON grant_applications(created_at);