import { Request, Response } from "express";
import { client } from "../../config/db";

const createSeller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    const sellerExist = await client.query(
      "SELECT * FROM seller WHERE email=$1",
      [email]
    );
    if (sellerExist.rows.length !== 0)
      return res.status(400).json({ message: "Seller already exist" });

    const seller = await client.query(
      "INSERT INTO seller (name,email,phoneNumber,address) VALUES ($1,$2,$3,$4)",
      [name, email, phoneNumber, address]
    );

    return res.status(200).json({ message: "Seller created" });
  } catch (error) {
    console.log("*************seller*****************");
    console.log(error);

    return res.status(500).json({
      message: "Somthing went wrong",
    });
  }
};

export { createSeller };
