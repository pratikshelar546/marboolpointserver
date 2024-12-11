import { Request, Response } from "express";
import { client } from "../../config/db";

const findSupplierviaEmail = "SELECT * FROM supplier WHERE email = $1";

const addSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const exituser = await client.query(findSupplierviaEmail, [email]);
    if (exituser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Supplier already exists with this email id" });
    }

    console.log([name, email, password, address]);

    const addSupplier = await client.query(
      "INSERT INTO supplier (name, email, password,admin_id) VALUES ($1, $2, $3, $4) RETURNING name, email, supplier_id",
      [name, email, password, 1]
    );
    console.log(addSupplier);

    res.status(200).json({ data: addSupplier.rows[0] });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
};

export { addSupplier };
