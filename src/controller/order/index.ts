import { Response, Request } from "express";

const placeOrder = async (req: Request, res: Response): Promise<any> => {
  try {
const {productId,}

  } catch (error) {
    console.log("--------------placeOrder-------------");
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Somthing went wrong" });
  }
};
