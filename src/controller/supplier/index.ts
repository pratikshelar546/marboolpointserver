import { query, Request, Response } from "express";
import { client } from "../../config/db";
import { comaprePassword } from "../../utils/auth";
import { user } from "../../commanTypes/types";

const findSupplierviaEmail = "SELECT * FROM supplier WHERE phoneNumber = $1";

const addSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, phoneNumber, address } = req.body;

    if (!name || !phoneNumber || !address) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const exituser = await client.query(findSupplierviaEmail, [phoneNumber]);
    if (exituser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Supplier already exists with this phone number",
      });
    }

    const addSupplier = await client.query(
      "INSERT INTO supplier (name,phoneNumber,address,admin_id) VALUES ($1, $2, $3, $4)",
      [name, phoneNumber, address, 1]
    );

    res
      .status(200)
      .json({ success: true, message: "Supplier added successfully" });
  } catch (error) {
    console.log("Supplier");

    console.log(error);

    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const loginSuplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber)
      return res.status(400).json({ success: false, message: "Invalid data" });

    const userExist: user = (
      await client.query(findSupplierviaEmail, [phoneNumber])
    ).rows[0];

    console.log(userExist);
    if (!userExist || userExist.isdeleted === true)
      return res
        .status(404)
        .json({ success: false, message: "Supplier dose not exist" });

    return res
      .status(200)
      .json({ success: true, message: "Login Successfully.." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const getSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const allSupplier = await client.query(
      "SELECT * FROM supplier WHERE isDeleted=false;"
    );

    if (allSupplier.rows.length === 0) {
      return res
        .status(204)
        .json({ success: false, message: "There is no supplier exist" });
    }
    return res.status(200).json({
      success: true,
      message: "Fetched all supplier",
      data: allSupplier.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getSupplierById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const supplier = await client.query(
      `SELECT * FROM supplier WHERE supplier_id=$1`,
      [id]
    );

    if (supplier.rows.length === 0 || supplier.rows[0].isdeleted === true) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    return res.status(200).json({ success: true, data: supplier.rows[0] });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const updateSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const supplier = await client.query(
      `SELECT * FROM supplier WHERE supplier_id=$1`,
      [id]
    );

    if (supplier.rows.length === 0 || supplier.rows[0].isdeleted === true) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    let qurey = "UPDATE supplier SET ";
    let values = [];
    let index = 1;
    for (const [key, value] of Object.entries(req.body)) {
      qurey += `${key}=$${index}, `;
      values.push(value);
      index++;
    }

    qurey = qurey.slice(0, -2);
    qurey += ` WHERE supplier_id = $${
      values.length + 1
    } RETURNING supplier_id,`;

    values.push(id);

    for (const [key] of Object.entries(req.body)) {
      qurey += ` ${key},`;
    }
    qurey = qurey.slice(0, -1);
    const updateSupplier = await client.query(qurey, values);

    return res.status(200).json({
      success: true,
      message: "supplier udpated",
      data: updateSupplier,
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const deleteSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const supplier = await client.query(
      `SELECT * FROM supplier WHERE supplier_id=$1`,
      [id]
    );

    if (supplier.rows.length === 0 || supplier.rows[0].isdeleted === true) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    await client.query(
      "UPDATE supplier SET isDeleted=true WHERE supplier_id=$1",
      [id]
    );

    return res.status(200).json({ message: "Supplier deleted", success: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

export {
  addSupplier,
  loginSuplier,
  getSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
