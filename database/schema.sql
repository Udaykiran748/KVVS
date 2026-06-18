-- Futuristic Generator Launch Event MySQL Database Schema

CREATE DATABASE IF NOT EXISTS kvvsai_electronic_db;
USE kvvsai_electronic_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  mobile VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(100) NULL,
  pincode VARCHAR(20) NULL,
  role VARCHAR(50) DEFAULT 'user',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Products Table (Magnetic Energy Generators)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  kw_capacity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  specifications JSON NOT NULL, -- Specs: Efficiency, Dimensions, Weight, Magnet Type, Output Voltage etc.
  benefits JSON NOT NULL, -- Key marketing bullet points
  image_url VARCHAR(255) NOT NULL,
  availability_status VARCHAR(50) DEFAULT 'available', -- available, backorder, out_of_stock
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Events Table (Launch Events Showcase)
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATETIME NOT NULL,
  venue VARCHAR(255) NOT NULL,
  ticket_price DECIMAL(10, 2) NOT NULL,
  total_slots INT NOT NULL,
  available_slots INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL,
  transaction_id VARCHAR(255) NULL, -- Razorpay Payment ID
  order_id VARCHAR(255) NOT NULL, -- Razorpay Order ID
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, captured, failed
  signature VARCHAR(255) NULL, -- Verification signature
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Passes Table (Generated Launch Event Tickets)
CREATE TABLE IF NOT EXISTS passes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL,
  pass_id VARCHAR(100) NOT NULL UNIQUE, -- Unique alphanumeric Pass Code
  qr_code_url TEXT NOT NULL, -- Data URL of the QR code
  pdf_url VARCHAR(255) NULL, -- Local relative or cloud path to downloadable PDF
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Attendance Table (Gate Verification Logs)
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pass_id INT NOT NULL,
  scanned_by INT NOT NULL, -- Admin ID who scanned
  scanned_at DATETIME NOT NULL,
  status VARCHAR(50) DEFAULT 'checked_in',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (pass_id) REFERENCES passes(id) ON DELETE CASCADE,
  FOREIGN KEY (scanned_by) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS booking_generators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    event_id INT NOT NULL,
    booking_id VARCHAR(255) NOT NULL UNIQUE,
    kw_capacity INT NULL,
    customer_name VARCHAR(255) NULL,
    mobile_number VARCHAR(255) NULL,
    email_address VARCHAR(255) NULL,
    company_name VARCHAR(255) NULL,
    booking_date DATE NULL,
    start_time VARCHAR(255) NULL,
    end_time VARCHAR(255) NULL,
    number_of_days INT NULL,
    delivery_address TEXT NULL,
    city VARCHAR(255) NULL,
    state VARCHAR(255) NULL,
    pincode VARCHAR(255) NULL,
    payment_method VARCHAR(255) NULL,
    motor_condition VARCHAR(255) NULL,
    motor_age VARCHAR(255) NULL,
    motor_hp VARCHAR(255) NULL,
    generator_kw VARCHAR(255) NULL,
    generator_hp VARCHAR(255) NULL,
    generator_others VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'pending',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);