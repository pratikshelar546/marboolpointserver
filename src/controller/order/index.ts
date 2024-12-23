import { Response, Request } from "express";
import { client } from "../../config/db";

interface Order {
  seller_id?: number;
  qyt?: Number;
  product_id?: Number;
}

const placeOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { product_id, qyt } = req.body as Order;
    const { seller_id } = req.user as Order;

    if (!product_id || !qyt || !seller_id)
      return res.status(400).json({ message: "Invalid data", success: false });

    const productExist = await client.query(
      "SELECT * FROM product WHERE product_id=$1",
      [product_id]
    );
    const product = productExist.rows[0];

    if (!product || product.isdeleted)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const order = await client.query(
      "INSERT INTO orders(product_id,seller_id,qyt) values($1,$2,$3) RETURNING order_id",
      [product_id, seller_id, qyt]
    );

    res.status(200).json({
      success: true,
      message: "Order has been placed",
      data: {
        order_id: order.rows[0].order_id,
        productName: product.name,
        productImage: product.photo,
        productPrice: product.rate,
        productSize: product.size,
        productUniqueCode: product.id,
      },
    });
  } catch (error) {
    console.log("--------------placeOrder-------------");
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Somthing went wrong", error: error });
  }
};

const updateOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { qyt, order_id, status } = req.body;

    if (!order_id)
      return res
        .status(400)
        .json({ success: false, message: "Invalid data order id required" });

    const orderExist = await client.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [order_id]
    );

    if (orderExist.rowCount === 0 || orderExist.rows[0] === "delivered") {
      return res
        .status(404)
        .json({ success: false, message: "Order dose not exist or delivered" });
    }

    if (qyt && orderExist.rows[0].status === "pending") {
      await client.query(
        "UPDATE orders SET qyt =$1 WHERE order_id = $2 RETURNING qyt",
        [qyt, order_id]
      );
      return res
        .status(200)
        .json({ success: true, message: "Quantity updated" });
    }

    if (status && orderExist.rows[0].status === "pending") {
      await client.query(
        "UPDATE orders SET status =$1 WHERE order_id = $2 RETURNING status",
        [status, order_id]
      );
      return res.status(200).json({ success: true, message: "Status updated" });
    }
  } catch (error) {
    console.log("--------------update Order-------------");
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Somthing went wrong", error: error });
  }
};

export { placeOrder, updateOrder };
