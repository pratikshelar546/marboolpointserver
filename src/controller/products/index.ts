import { Request, Response } from "express";
import { client } from "../../config/db";
import { v2 as cloudinary } from "cloudinary";
import QRCode from "qrcode";
import { generateUniqueCode } from "../../utils/auth";

const addProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, rate, size, stock, supplier_id } = req.body;

    const userNotExist = await client.query(
      "SELECT * FROM supplier WHERE supplier_id = $1",
      [supplier_id]
    );
    if (!userNotExist) res.status(404).json({success:false, message: "user not exist" });
    let photo = "";
    if (req.file) {
      const filePath = req?.file?.path;

      const uploadPromise: Promise<{ public_id: string; url: string }> =
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            filePath,
            { folder: "products" },
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  public_id: result!.public_id,
                  url: result!.secure_url,
                });
              }
            }
          );
        });

      const { url } = await uploadPromise; // Await the promise and destructure the URL
      photo = url; // Assign URL to photo
    }

    const frontendurl = `${process.env.FRONTEND_URL}/products/`;
    // const uniqueCode = `${name.split(0, 2)}${userNotExist.rows[0].name.split(0,2)}`;
    const uniqueCode = generateUniqueCode(name, userNotExist.rows[0].name);

    const qrcode = await QRCode.toDataURL(frontendurl + uniqueCode);

    const qrCodeStore = await cloudinary.uploader.upload(qrcode, {
      folder: "Product_QRcode",
    });

    const ProductQrCode = qrCodeStore.secure_url;

    const addProduct = await client.query(
      "INSERT INTO product (name,supplier_id,description,rate,size,stock,photo,qr_code) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING name,description,rate,size,stock,photo,qr_code",
      [name, supplier_id, description, rate, size, stock, photo, ProductQrCode]
    );

    return res.status(200).json({success: true,
      product: addProduct.rows[0],
      message: "Produt added successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({success:false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getAllProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await client.query(
      "SELECT * FROM product WHERE isdeleted=false"
    );
    if (products.rows.length === 0) {
      return res.status(204).json({success:false, message: "There is no product exist" });
    }

    return res.status(200).json({success: true,
      data: products.rows,
      message: "All Product fetched",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({success:false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const product = await client.query(
      "SELECT * FROM product WHERE product_id= $1",
      [id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({success:false, message: "product not found" });
    }
    return res
      .status(200)
      .json({success: true, message: "Product fetched", data: product.rows[0] });
  } catch (error) {
    console.log(error);

    return res.status(500).json({success:false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    // const query = `UPDATE product Set name =$2, description=$3,rate=$4,size=$5, stock =$6  WHERE product_id=$1`;
    // const values = [id, name, description, rate, size, stock];
    // const updatedProduct = await client.query(query, values);

    const product = await client.query(
      "SELECT * FROM product WHERE product_id= $1",
      [id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({success:false, message: "product not found" });
    }
    let query = "UPDATE product SET ";
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(req.body)) {
      query += `${key}= $${index}, `;
      values.push(value);
      index++;
    }

    query = query.slice(0, -2);
    query += ` WHERE product_id = $${values.length + 1} RETURNING product_id,`;
    values.push(id);

    for (const [key] of Object.entries(req.body)) {
      query += ` ${key},`;
    }
    query = query.slice(0, -1);
    const updatedProduct = await client.query(query, values);

    return res
      .status(200)
      .json({success: true, message: "Product updated", data: updatedProduct.rows });
  } catch (error) {
    console.log(error);

    return res.status(500).json({success:false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await client.query(
      `UPDATE product set isdeleted=true WHERE product_id=${id}`
    );

    return res.status(200).json({success: true, message: "product deleted successfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success:false,
      message: "Something went wrong",
      error: error,
    });
  }
};

export {
  addProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
