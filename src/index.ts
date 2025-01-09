  import express from "express";
  import { client } from "./config/db";
  import supplierRounter from "./routes/Supplier";
  import productRouter from "./routes/Products";
  import sellerRouter from "./routes/Seller";
  import adminRoute from "./routes/Admin";
  import orderRoutes from "./routes/order";
  import dotenv from "dotenv";
  import { v2 as cloudinary } from "cloudinary";
  import passport from "passport";
  import session from "express-session";
  import privateRouteConfig from "./config/auth";
  import cors from "cors";

  dotenv.config();
  const app = express();
  app.use(express.json());
  privateRouteConfig(passport);
  // googleConfig(passport);
  app.use(express.json());
  app.use(session({ secret: "MARBOL_ADMIN" }));
  app.use(passport.initialize());
  app.use(passport.session());

  const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  client
    .connect()
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log("somthing went wrong", err));

  // CREATE TABLE admin(email VARCHAR(70) UNIQUE NOT NULL,name VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

  // INSERT INTO admin(email, name, password) VALUES('pratik@fhfh.cncn','pratik','121212')

  app.use("/api/v1/supplier", supplierRounter);
  app.use("/api/v1/admin", adminRoute);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/seller", sellerRouter);
  app.use("/api/v1/order", orderRoutes);
  app.listen(8081, () => {
    console.log("Server is running on port 8080");
  });
