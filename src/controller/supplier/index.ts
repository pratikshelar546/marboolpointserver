import { Request, Response } from "express";
import { client } from "../../config/db";
import { comaprePassword } from "../../utils/auth";
import { user } from "../../commanTypes/types";

const findSupplierviaEmail = "SELECT * FROM supplier WHERE phoneNumber = $1";

const addSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, phoneNumber, address } = req.body;

    if (!name || !phoneNumber || !address) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const exituser = await client.query(findSupplierviaEmail, [phoneNumber]);
    if (exituser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Supplier already exists with this phone number" });
    }

    const addSupplier = await client.query(
      "INSERT INTO supplier (name,phoneNumber,address,admin_id) VALUES ($1, $2, $3, $4)",
      [name, phoneNumber, address, 1]
    );

    res.status(200).json({ data: addSupplier.rows[0] });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
};

const loginSuplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Invalid data" });

    const userExist: user = (await client.query(findSupplierviaEmail, [email]))
      .rows[0];

    if (!userExist)
      return res.status(404).json({ message: "Supplier dose not exist" });
    console.log(userExist);

    const savedpassowrd = userExist.password;
    if (await comaprePassword(password, savedpassowrd))
      return res.status(200).json({ message: "Login Successfully.." });

    return res.status(401).json({ message: "Authentication falied" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
};

export { addSupplier, loginSuplier };
