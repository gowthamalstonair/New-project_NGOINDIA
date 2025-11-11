CREATE DATABASE IF NOT EXISTS ngoindia_db;
USE ngoindia_db;

CREATE TABLE IF NOT EXISTS `staff_login` ( 
  `email_address` VARCHAR(255) UNIQUE NOT NULL, 
  `password` VARCHAR(255) NOT NULL
);

INSERT INTO `staff_login` (`email_address`, `password`) VALUES 
('staff@ngoindia.org', 'Ngoindia123@');