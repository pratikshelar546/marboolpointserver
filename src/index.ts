import express from "express";
import { client } from "./config/db";
import supplierRounter from "./routes/supplier";
import productRouter from "./routes/Products";
const app = express();
app.use(express.json());

client
  .connect()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("somthing went wrong", err));

// {
//     host:"localhost",
//     user: "postgres",
//     port:5432,
//     password:"pratik",
//     database:"postgres"
// }
// CREATE TABLE admin(email VARCHAR(70) UNIQUE NOT NULL,name VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

// INSERT INTO admin(email, name, password) VALUES('pratik@fhfh.cncn','pratik','121212')

app.use("/api/v1/supplier", supplierRounter);

app.use("/api/v1/products", productRouter);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
