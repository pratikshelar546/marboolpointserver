import { Response, Request } from "express";
import { client } from "../../config/db";

interface Order {
  seller_id?: number;
  qyt?: Number;
  product_id?: Number;
  description: String
}
interface Seller {
  role: String;
}

const fetchQuery = (table: string, where: string) => {
  return `SELECT * FROM ${table}  WHERE ${where} = $1`;
};

const fetchOrder = (where: string) => {
  return `SELECT 
  orders.order_id,
  orders.qyt, 
  orders.status, 
  orders.seller_id AS sellerId,
  orders.orderdate, 
  orders.description,
  product.id AS id, 
  product.product_id, 
  product.name AS productName, 
  product.rate, 
  product.photo, 
  product.size,
  product.supplier_id,
  supplier.name AS supplierName,
  seller.name AS sellerName
FROM 
  orders 
JOIN 
  product 
ON 
  orders.product_id = product.product_id 
JOIN
  supplier
ON
  product.supplier_id = supplier.supplier_id 
JOIN
  seller
ON
  orders.seller_id = seller.seller_id
WHERE 
  orders.${where} = $1
  AND orders.isDeleted = false
  AND product.isDeleted = false;
`;
};
const placeOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { product_id, qyt, description } = req.body as Order;
    const { seller_id } = req.user as Order;

    if (!product_id || !qyt || !seller_id)
      return res.status(400).json({ message: "Invalid data", success: false });

    const productExist = await client.query(
      fetchQuery("product", "product_id"),
      [product_id]
    );

    const product = productExist.rows[0];
    if (!product || product.isdeleted)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const order = await client.query(
      "INSERT INTO orders(product_id,seller_id,qyt,description) values($1,$2,$3,$4) RETURNING order_id",
      [product_id, seller_id, qyt, description]
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
    const {order_id}=req.params;
    const { qyt, status, description } = req.body;

    if (!order_id)
      return res
        .status(400)
        .json({ success: false, message: "Invalid data order id required" });

    const orderExist = await client.query(fetchQuery("orders", "order_id"), [
      order_id,
    ]);

    if (orderExist.rowCount === 0 || orderExist.rows[0] === "delivered") {
      return res
        .status(404)
        .json({ success: false, message: "Order dose not exist or delivered" });
    }

    if (qyt && orderExist.rows[0].status === "pending") {
      await client.query(
        "UPDATE orders SET qyt =$1, description=$2 WHERE order_id = $3 RETURNING qyt",
        [qyt, description, order_id]
      );
      return res
        .status(200)
        .json({ success: true, message: "Quantity updated" });
    }

    if (status) {
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

const getAllOrderBySeller = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { seller_id } = req.user as Order;

    const orders = await client.query(fetchOrder("seller_id"), [seller_id]);

    if (orders.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Dose not found any order" });

    return res
      .status(200)
      .json({ success: true, message: "fetched all order", data: orders.rows });
  } catch (error) {
    console.log("--------------get all Order by seller-------------");
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Somthing went wrong", error: error });
  }
};

const getProductOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const productExist = await client.query(
      fetchQuery("product", "product_id"),
      [id]
    );

    if (productExist.rowCount === 0 || productExist.rows[0].isdeleted === true)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const orders = await client.query(fetchOrder("product_id"), [id]);

    if (orders.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Order not placed" });

    return res
      .status(200)
      .json({ success: true, message: "Order fetched", data: orders.rows });
  } catch (error) {
    console.log("--------------placeOrder-------------");
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Somthing went wrong", error: error });
  }
};

const getOrderById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const order = await client.query(fetchOrder("order_id"), [id]);

    if (order.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Order dose not exist" });
    return res.status(200).json({
      success: true,
      message: "Fetched all orders",
      data: order.rows[0],
    });
  } catch (error) {
    console.log("--------------get all Order by seller-------------");
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Somthing went wrong", error: error });
  }
};

const deleteOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const order = await client.query(fetchQuery("orders", "order_id"), [id]);

    if (order.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    await client.query("UPDATE orders set isdeleted=true WHERE order_id =$1", [
      id,
    ]);

    return res
      .status(200)
      .json({ success: true, message: "ORder deleted successfully" });
  } catch (error) {
    console.log("--------------update Order-------------");
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Somthing went wrong", error: error });
  }
};

const getAllOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const { role } = req.user as Seller;

    if (role === "seller") return res.status(401).json({ message: "You dont have access", success: false })
    const orders = await client.query(
      "SELECT order_id, orders.qyt, orders.status, orders.seller_id, orders.orderdate, product.id AS id, product.product_id, product.name AS productName, product.rate, product.photo, product.size, product.supplier_id, supplier.name AS supplierName, seller.name AS  sellerName FROM orders JOIN product ON orders.product_id = product.product_id JOIN supplier ON product.supplier_id = supplier.supplier_id JOIN seller ON orders.seller_id = seller.seller_id WHERE orders.isDeleted = false AND product.isDeleted = false"
    );

    return res.status(200).json({
      success: true,
      message: "Fetched All orders",
      data: orders.rows,
    });
  } catch (error) {
    console.log("--------------update Order-------------");
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Somthing went wrong", error: error });
  }
};

export {
  placeOrder,
  updateOrder,
  getAllOrderBySeller,
  getProductOrder,
  getOrderById,
  deleteOrder,
  getAllOrders,
};
