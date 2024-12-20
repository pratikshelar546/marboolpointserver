import { Request, Response, query } from "express";
import { client } from "../../config/db";
import {
  genrateJwtToken,
  hashPasssword,
  comaprePassword,
} from "../../utils/auth";

const createSeller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, phoneNumber, address, password } = req.body;
    const sellerExist = await client.query(
      "SELECT * FROM seller WHERE email=$1",
      [email]
    );
    if (sellerExist.rows.length !== 0)
      return res.status(400).json({ message: "Seller already exist" });

    const newPassword = await hashPasssword(password);

    const seller = await client.query(
      "INSERT INTO seller (name,email,phoneNumber,address,password) VALUES ($1,$2,$3,$4,$5) RETURNING seller_id",
      [name, email, phoneNumber, address, newPassword]
    );

    const token = await genrateJwtToken(seller.rows[0].seller_id, "seller");

    return res.status(200).json({ message: "Seller created", token });
  } catch (error) {
    console.log("*************add seller*****************");
    console.log(error);

    return res.status(500).json({
      message: "Somthing went wrong",
    });
  }
};

const loginSeller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "creadentials required" });

    const sellerExist = await client.query(
      "SELECT * FROM seller WHERE email =$1",
      [email]
    );

    const seller = sellerExist.rows[0];
    console.log(seller.seller_id);
    if (!seller)
      return res.status(404).json({ message: "Seller dose not exist" });

    const compare = await comaprePassword(password, seller.password);

    console.log(compare);

    if (!compare)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = await genrateJwtToken(seller.seller_id, "seller");

    return res.status(200).json({ message: "Login succesfully", token });
  } catch (error) {
    console.log("*************add seller*****************");
    console.log(error);

    return res.status(500).json({
      message: "Somthing went wrong",
    });
  }
};

const getAllSeller = async (req: Request, res: Response): Promise<any> => {
  try {
    const sellers = await client.query("SELECT * FROM seller");
    if (sellers.rows.length === 0)
      return res.status(404).json({ message: "Seller not found" });

    return res.status(200).json({
      message: "Fetched all sellers",
      count: sellers.rowCount,
      sellers: sellers.rows,
    });
  } catch (error) {
    console.log("*************get seller*****************");
    console.log(error);

    return res.status(500).json({
      message: "Somthing went wrong",
    });
  }
};

const updateSelller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const sellerExist = await client.query(
      "SELECT * FROM seller WHERE seller_id=$1",
      [id]
    );

    const seller = sellerExist.rows[0];

    if (!seller) return res.status(404).json({ message: "USer not found" });

    let query = " UPDATE SELLER SET";

    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(req.body)) {
      query += ` ${key} =$${index}, `;
      values.push(value);
      index++;
    }
    query = query.slice(0, -2);
    query += ` WHERE seller_id = $${values.length + 1} RETURNING supplier_id`;

    console.log(query, values);
  } catch (error) {
    console.log("*************update seller*****************");
    console.log(error);

    return res.status(500).json({
      message: "Somthing went wrong",
    });
  }
};

export { createSeller, getAllSeller, loginSeller };
