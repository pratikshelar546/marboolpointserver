import { Request, Response, query } from "express";
import { client } from "../../config/db";
import {
  genrateJwtToken,
  hashPasssword,
  comaprePassword,
} from "../../utils/auth";

interface Seller {
  seller_id: number;
  name: string;
}

const createSeller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, phoneNumber, address, password } = req.body;
    const sellerExist = await client.query(
      "SELECT * FROM seller WHERE email=$1",
      [email]
    );
    if (sellerExist?.rows[0]?.isdeleted === true) {
      const newPassword = await hashPasssword(password);

      await client.query(
        "UPDATE seller SET name= $1,email=$2,phoneNumber=$3,address=$4,password=$5 WHERE seller_id = $6",
        [
          name,
          email,
          phoneNumber,
          address,
          newPassword,
          sellerExist.rows[0].seller_id,
        ]
      );
      return res.status(200).json({ success: true, message: "User updated" });
    }

    // if (sellerExist.rows.length !== 0)
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Seller already exist" });

    const newPassword = await hashPasssword(password);

    const seller = await client.query(
      "INSERT INTO seller (name,email,phoneNumber,address,password) VALUES ($1,$2,$3,$4,$5) RETURNING seller_id",
      [name, email, phoneNumber, address, newPassword]
    );

    const token = await genrateJwtToken(seller.rows[0].seller_id, "seller");

    return res
      .status(200)
      .json({ success: true, message: "Seller created", token });
  } catch (error) {
    console.log("*************add seller*****************");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Somthing went wrong",
    });
  }
};

const loginSeller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "creadentials required" });

    const sellerExist = await client.query(
      "SELECT * FROM seller WHERE email =$1",
      [email]
    );

    const seller = sellerExist.rows[0];
    if (!seller || seller.isdeleted === true)
      return res
        .status(404)
        .json({ success: false, message: "Seller dose not exist" });

    const compare = await comaprePassword(password, seller.password);
    if (!compare)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = await genrateJwtToken(seller.seller_id, "seller");

    return res
      .status(200)
      .json({ success: true, message: "Login succesfully", token });
  } catch (error) {
    console.log("*************add seller*****************");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Somthing went wrong",
    });
  }
};

const getAllSeller = async (req: Request, res: Response): Promise<any> => {
  try {
    const sellers = await client.query("SELECT * FROM seller WHERE isdeleted = false");
    if (sellers.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });

    return res.status(200).json({
      success: true,
      message: "Fetched all sellers",
      count: sellers.rowCount,
      data: sellers.rows,
    });
  } catch (error) {
    console.log("*************get all seller*****************");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Somthing went wrong",
    });
  }
};

const updateSelller = async (req: Request, res: Response): Promise<any> => {
  try {

    // const user: string = req?.user;
    const { seller_id } = req.user as Seller;

    const sellerExist = await client.query(
      "SELECT * FROM seller WHERE seller_id=$1",
      [seller_id]
    );

    const seller = sellerExist.rows[0];

    if (!seller || seller.isdeleted === true)
      return res
        .status(404)
        .json({ success: false, message: "USer not found" });

    let query = "UPDATE SELLER SET";
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(req.body)) {
      query += ` ${key} =$${index}, `;
      values.push(value);
      index++;
    }
    query = query.slice(0, -2);
    query += ` WHERE seller_id = $${values.length + 1} RETURNING seller_id, `;
    values.push(seller_id);

    for (const [key] of Object.entries(req.body)) {
      query += ` ${key},`;
    }
    query = query.slice(0, -1);

    const updateSeller = await client.query(query, values);

    return res.status(200).json({
      success: true,
      message: "user details updated",
      data: updateSeller.rows[0],
    });
  } catch (error) {
    console.log("*************update seller*****************");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Somthing went wrong",
    });
  }
};

const deleteSeller = async (req: Request, res: Response): Promise<any> => {
  try {
    const { seller_id } = req.params;

    const seller = await client.query(
      "SELECT isdeleted FROM seller WHERE seller_id = $1",
      [seller_id]
    );

    if (seller.rows[0].length === 0 || seller.rows[0].isdeleted == true)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    await client.query(
      "UPDATE seller SET isdeleted = true WHERE seller_id =$1",
      [seller_id]
    );

    return res
      .status(200)
      .json({ success: true, message: "USer deleted successfully" });
  } catch (error) {
    console.log("*************get seller*****************");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Somthing went wrong",
    });
  }
};

const getSellerById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const seller = await client.query(
      "SELECT * FROM seller WHERE seller_id= $1",
      [id]
    );

    if (seller.rows.length === 0 || seller.rows[0].isdeleted === true) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Product fetched", data: seller.rows[0] });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const updatePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const hashPass = await hashPasssword(password);
    const updatePass = await client.query("UPDATE seller set password =$1 WHERE seller_id =$2 RETURNING name", [hashPass, id]);

    if (updatePass.rowCount !== 0) return res.status(200).json({ message: "Password chnaged", success: true })
    return res.status(404).json({ message: "Check creadential", success: false })

  } catch (error) {
    console.log("*************update admin pass*****************");

    return res.status(500).json({
      success: false,
      message: "Somthing went wrong",
    });
  }
}
export { createSeller, getAllSeller, loginSeller, updateSelller, deleteSeller, getSellerById, updatePassword };
