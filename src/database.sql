
-- CREATE DATABASE marboolpoint;


-- \c marboolpoint;

-- create admin table
CREATE TABLE Admin (admin_id SERIAL PRIMARY KEY,name VARCHAR(100) NOT NULL,email VARCHAR(150) UNIQUE NOT NULL,isdeleted BOOLEAN DEFAULT false,password VARCHAR(255) NOT NULL);

CREATE TABLE supplier (
    supplier_id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phoneNumber VARCHAR(13) UNIQUE,
    address TEXT,
    isdeleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin (admin_id) ON DELETE CASCADE
);


-- create table seller
CREATE TABLE seller(seller_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL,email VARCHAR(150) NOT NULL, phoneNumber VARCHAR(13),address TEXT,password VARCHAR(100),isdeleted BOOLEAN DEFAULT false,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- create product tbable
CREATE TABLE product(product_id SERIAL PRIMARY KEY,name VARCHAR(100),supplier_id INT NOT NULL,description TEXT,rate INT NOT NULL,buyPrice INT NOT NULL,size VARCHAR(75) NOT NULL, photo TEXT ,qr_code TEXT,id VARCHAR(50),isdeleted BOOLEAN DEFAULT false,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  ,FOREIGN KEY (supplier_id) REFERENCES supplier (supplier_id) ON DELETE CASCADE);

CREATE TABLE orders(order_id SERIAL PRIMARY KEY, product_id INT NOT NULL,seller_id INT NOT NULL,qyt INT NOT NULL CHECK (qyt> 0), orderdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, status VARCHAR(50) DEFAULT 'pending',isdeleted BOOLEAN DEFAULT false,description VARCHAR(175) NOT NULL,FOREIGN KEY (product_id) REFERENCES product(product_id), FOREIGN KEY (seller_id) REFERENCES seller(seller_id));