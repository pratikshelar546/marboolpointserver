import { Request, Response } from "express";

import { comaprePassword, genrateJwtToken } from "../../utils/auth";
import { client } from "../../config/db";

const findadminwitheemail = "SELECT * FROM admin WHERE email =$1";

const signupAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "inavild data" });

    const existAdmin = await client.query(findadminwitheemail, email);

    if (existAdmin.rows.length === 0)
      return res
        .status(404)
        .json({ message: "Admin with this creadential not found" });
    const admin = existAdmin.rows[0];
    // const passwordMatch = await comaprePassword(password, admin.password);
    // if (!passwordMatch)
    //   return res.status(401).json({ message: "Inavalid credenstials" });

    const token = genrateJwtToken(admin.id);

    res.status(200).json({
      message: "sign up successfully",
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error,
    });
  }
};

export { signupAdmin };
