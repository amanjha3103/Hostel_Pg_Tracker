CREATE DATABASE IF NOT EXISTS hostel_pg_tracker;

USE hostel_pg_tracker;

CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    location VARCHAR(160) NOT NULL,
    monthly_rent DECIMAL(10,2) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO listings
    (name, location, monthly_rent, available)
VALUES
    ('Sunrise PG', 'Gandhinagar, Sector 7', 8500.00, TRUE),
    ('Green View Hostel', 'Gandhinagar, Sector 11', 7000.00, TRUE),
    ('City Comfort PG', 'Ahmedabad, Chandkheda', 9500.00, FALSE),
    ('Student Stay', 'Gandhinagar, Raysan', 6000.00, TRUE);