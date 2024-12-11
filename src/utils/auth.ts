import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret_key = "MARBOL_ADMIN";

export const comaprePassword = async (
  password: string,
  savedpassowrd: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, savedpassowrd);
  } catch (error) {
    console.log(error);
    throw new Error("Somthing went wrong! try again!");
  }
};

export const genrateJwtToken = async (credenstials: string) => {
  try {
    const token = jwt.sign({ admin: credenstials }, secret_key, {
      expiresIn: "15d",
    });
    return token;
  } catch (error) {
    console.log("jwt error", error);

    throw new Error("JWT token genration falied");
  }
};
