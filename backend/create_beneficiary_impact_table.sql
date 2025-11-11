-- Create beneficiary_impact_records table in ngoindia_db database
-- Execute this in phpMyAdmin SQL tab at localhost:3307/phpmyadmin

USE ngoindia_db;

CREATE TABLE IF NOT EXISTS `beneficiary_impact_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `beneficiary_name` varchar(255) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `indicator_name` varchar(255) NOT NULL,
  `baseline_value` decimal(10,2) DEFAULT 0.00,
  `current_value` decimal(10,2) DEFAULT 0.00,
  `measurement_date` date NOT NULL,
  `remarks` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_beneficiary` (`beneficiary_name`),
  KEY `idx_project` (`project_name`),
  KEY `idx_measurement_date` (`measurement_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes for better performance
CREATE INDEX idx_beneficiary_impact_beneficiary ON beneficiary_impact_records(beneficiary_name);
CREATE INDEX idx_beneficiary_impact_project ON beneficiary_impact_records(project_name);
CREATE INDEX idx_beneficiary_impact_date ON beneficiary_impact_records(measurement_date);