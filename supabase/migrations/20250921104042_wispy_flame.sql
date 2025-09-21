-- Menggeris Database Schema
-- MySQL Database for Wooden Watch E-commerce

CREATE DATABASE IF NOT EXISTS menggeris_db;
USE menggeris_db;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    images JSON, -- Store array of image filenames
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100) DEFAULT 'Menggeris',
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    about TEXT,
    maps TEXT, -- Google Maps embed code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT IGNORE INTO categories (name, description) VALUES
('Wooden Watches', 'Handcrafted wooden timepieces made from Kompassia excelsa'),
('Automatic Skeleton', 'Premium automatic skeleton watches with wooden cases'),
('Leather Combination', 'Wooden watches with premium leather straps'),
('Eyewear', 'Wooden eyeglasses and sunglasses'),
('Accessories', 'Wooden card holders, Apple Watch straps, and other accessories');

-- Insert sample settings
INSERT IGNORE INTO settings (
    company_name, 
    address, 
    phone, 
    email, 
    about
) VALUES (
    'Menggeris',
    'Bumi Sempaja City, Block CD No.22, Samarinda – East Borneo, Indonesia',
    '+62 811-1111-1412',
    'menggerisofficial@gmail.com',
    'Rooted in the rich biodiversity heritage of East Borneo, Menggeris stands as a manifestation of harmony between nature, tradition, and modern design. Our collections are crafted from the rare buttress wood of Kompassia excelsa, a material admired for its natural strength, captivating grain patterns, and graceful maroon tones.'
);

-- Insert sample products
INSERT IGNORE INTO products (name, description, price, category_id, images) VALUES
(
    'Classic Menggeris Automatic',
    '<p>Our flagship timepiece featuring the world\'s first wooden automatic skeleton watch. Crafted from rare Kompassia excelsa wood with Seiko Automatic Skeleton Movement.</p><p><strong>Features:</strong></p><ul><li>Kompassia excelsa wooden case</li><li>Seiko Automatic Skeleton Movement</li><li>Sapphire crystal glass</li><li>Water resistance: 3ATM</li><li>SVLK certified sustainable wood</li></ul>',
    1250.00,
    2,
    '[]'
),
(
    'Heritage Wooden Watch',
    '<p>A tribute to traditional craftsmanship with modern precision. Each piece tells a story of East Borneo\'s rich biodiversity.</p><p><strong>Specifications:</strong></p><ul><li>100% handcrafted wooden case</li><li>Swiss movement</li><li>Genuine leather strap</li><li>Limited edition piece</li><li>Certificate of authenticity</li></ul>',
    890.00,
    1,
    '[]'
),
(
    'Skeleton Maroon Edition',
    '<p>Showcasing the natural maroon tones of Kompassia excelsa wood, this skeleton watch reveals the intricate mechanical movement through the transparent case back.</p><p><strong>Highlights:</strong></p><ul><li>Transparent case back</li><li>Automatic skeleton movement</li><li>Deep maroon wood grains</li><li>Anti-reflective coating</li><li>Adjustable wooden bracelet</li></ul>',
    1450.00,
    2,
    '[]'
),
(
    'Wooden Sunglasses Classic',
    '<p>Stylish eyewear crafted from the same premium Kompassia excelsa wood as our timepieces. Perfect complement to your wooden watch collection.</p><p><strong>Features:</strong></p><ul><li>UV400 protection</li><li>Polarized lenses</li><li>Lightweight wooden frames</li><li>Adjustable nose pads</li><li>Protective wooden case included</li></ul>',
    295.00,
    4,
    '[]'
),
(
    'Premium Card Holder',
    '<p>Elegant wooden card holder showcasing the beautiful grain patterns of East Borneo\'s finest wood. A perfect executive accessory.</p><p><strong>Details:</strong></p><ul><li>Holds up to 8 cards</li><li>RFID blocking technology</li><li>Smooth finish</li><li>Compact design</li><li>Gift box included</li></ul>',
    125.00,
    5,
    '[]'
);

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created ON products(created_at);

-- Views for easier querying
CREATE OR REPLACE VIEW product_details AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.images,
    p.created_at,
    p.updated_at,
    c.name as category_name,
    c.id as category_id
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Show tables and basic info
SHOW TABLES;

-- Display sample data
SELECT 'Categories' as Table_Name;
SELECT * FROM categories;

SELECT 'Sample Products' as Table_Name;
SELECT id, name, price, category_id FROM products LIMIT 5;

SELECT 'Settings' as Table_Name;
SELECT company_name, phone, email FROM settings LIMIT 1;