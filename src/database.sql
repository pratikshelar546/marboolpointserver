
CREATE DATABASE marboolpoint;


\c marboolpoint;

-- create admin table
CREATE TABLE Admin (admin_id SERIAL PRIMARY KEY,name VARCHAR(100) NOT NULL,email VARCHAR(150) UNIQUE NOT NULL,password VARCHAR(255) NOT NULL);

CREATE TABLE supplier (supplier_id SERIAL PRIMARY KEY,admin_id INT NOT NULL,name VARCHAR(100) NOT NULL,email VARCHAR(150) UNIQUE NOT NULL,phoneNumber VARCHAR(13), address TEXT, password VARCHAR(150),FOREIGN KEY (admin_id) REFERENCES admin (admin_id) ON DELETE CASCADE);

-- create table seller
CREATE TABLE seller(seller_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL,email VARCHAR(150) NOT NULL, phoneNumber VARCHAR(13),address TEXT);

-- create product tbable
CREATE TABLE product(product_id SE RIAL PRIMARY KEY,name VARCHAR(100),supplier_id INT,description TEXT,price INIT NOT NULL,size INIT NOT NULL,stock INIT, FOREIGN KEY (supplier_id) REFERENCE supplier (supplier_id) ON DELETE CASCADE);