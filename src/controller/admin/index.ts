import { Request, Response } from "express";

import {
  comaprePassword,
  genrateJwtToken,
  hashPasssword,
} from "../../utils/auth";
import { client } from "../../config/db";
import passport from 'passport';
import { compare } from "bcrypt";

const findadminwitheemail = "SELECT * FROM admin WHERE email =$1";

interface CreateAdmin {
  name?: string;
  email?: string;
  password: string;
}

interface Admin {
  admin_id: number
}

const signupAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password }: CreateAdmin = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "inavild data" });

    const existAdmin = await client.query(findadminwitheemail, [email]);

    if (existAdmin.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Admin with this creadential not found" });
    const admin = existAdmin.rows[0];
    const passwordMatch = await compare(password, admin.password);

    if (!passwordMatch)
      return res.status(401).json({ success: false, message: "Inavalid credenstials" });

    const token = await genrateJwtToken(admin.admin_id, "admin");

    return res.status(200).json({
      success: true,
      message: "sign up successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error,
    });
  }
};

const createAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password }: CreateAdmin = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Invalid data" });

    const hashPass = await hashPasssword(password);

    const admin = await client.query(
      "INSERT INTO admin (name,email,password) VALUES ($1,$2,$3) RETURNING admin_id",
      [name, email, hashPass]
    );

    const token = await genrateJwtToken(admin.rows[0].admin_id, "admin");

    return res.status(200).json({ success: true, message: "Admin created", token: token });
  } catch (error) {
    console.log("*************update seller*****************");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Somthing went wrong",
    });
  }
};

const updatePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { password, seller_id } = req.body;
    const { admin_id } = req.user as Admin

    const hashPass = await hashPasssword(password);
    const updatePass = await client.query("UPDATE seller set password =$1 WHERE seller_id =$2 RETURNING name", [hashPass, seller_id]);
    console.log(hashPass, updatePass);

    if (updatePass.rowCount !== 0) return res.status(200).json({ message: "Password chnaged", success: true })
    return res.status(404).json({ message: "Check creadential", success: false })

  } catch (error) {
    console.log("*************update admin pass*****************");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Somthing went wrong",
    });
  }
}
export { signupAdmin, createAdmin, updatePassword };
