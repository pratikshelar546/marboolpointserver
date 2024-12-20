import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret_key = "MARBOL_ADMIN";

export const hashPasssword = async (password: string): Promise<string> => {
  const hash = bcrypt.hash(password, 8);
  return hash;
};

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

export const genrateJwtToken = async (
  credenstials: number,
  role: "admin" | "seller"
) => {
  try {
    const token = jwt.sign({ user: credenstials, role: role }, secret_key, {
      expiresIn: "10d",
    });
    return token;
  } catch (error) {
    console.log("jwt error", error);

    throw new Error("JWT token genration falied");
  }
};

export const generateUniqueCode = (
  name: string,
  supplierName: string
): string => {
  // Get first 2 letters of name (if available)
  const namePart = name.slice(0, 2).toUpperCase();

  // Get first 2 letters of supplier name (if available)
  const supplierPart = supplierName.slice(0, 2).toUpperCase();

  // Get the current year
  const year = new Date().getFullYear();

  // Generate 4 random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Ensures 4 digits

  // Combine all parts
  return `MU${namePart}${supplierPart}${year}${randomDigits}`;
};
