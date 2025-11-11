USE ngoindia_db;

CREATE TABLE IF NOT EXISTS fcradonation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_name VARCHAR(255) NOT NULL,
    donor_country VARCHAR(100) NULL,
    is_foreign BOOLEAN DEFAULT FALSE,
    remittance_ref VARCHAR(100) NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    amount DECIMAL(10,2) NOT NULL,
    converted_amount DECIMAL(10,2) NOT NULL,
    conversion_rate DECIMAL(8,4) DEFAULT 1,
    firc VARCHAR(100) NULL,
    purpose_tag VARCHAR(255) NOT NULL,
    usage_restriction TEXT NULL,
    notes TEXT NULL,
    attachments JSON NULL,
    created_by VARCHAR(255) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    type ENUM('one-time', 'recurring') DEFAULT 'one-time',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_fcradonation_donor ON fcradonation(donor_name);
CREATE INDEX idx_fcradonation_foreign ON fcradonation(is_foreign);
CREATE INDEX idx_fcradonation_created_at ON fcradonation(created_at);