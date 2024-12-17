import { Request, Response } from "express";
import { client } from "../../config/db";

const addProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, rate, size, stock, supplier_id } = req.body;

    const userNotExist = await client.query(
      "SELECT * FROM supplier WHERE supplier_id = $1",
      [supplier_id]
    );
    if (!userNotExist) res.status(404).json({ message: "user not exist" });
    const addProduct = await client.query(
      "INSERT INTO product (name,supplier_id,description,rate,size,stock) VALUES ($1,$2,$3,$4,$5,$6)",
      [name, supplier_id, description, rate, size, stock]
    );

    res.status(200).json({
      product: addProduct.rows[0],
      message: "Produt added successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
};

const getAllProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await client.query("SELECT * FROM product");
    res.status(200).json({
      product: products.rows,
      message: "All Product fetched",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
};

export { addProduct, getAllProduct };
