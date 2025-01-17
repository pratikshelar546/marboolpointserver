"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProduct = exports.addProduct = void 0;
const db_1 = require("../../config/db");
const cloudinary_1 = require("cloudinary");
const auth_1 = require("../../utils/auth");
function extractPublicId(url) {
    const parts = url.split("/");
    const fileName = parts.pop() || ""; // Get the file name with extension
    const folder = parts.slice(parts.indexOf("upload") + 2).join("/"); // Get the folder
    const publicId = fileName.split(".")[0]; // Remove the file extension
    return folder ? `${folder}/${publicId}` : publicId;
}
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, rate, size, supplier_id, photo, buyprice } = req.body;
        const userNotExist = yield db_1.client.query("SELECT * FROM supplier WHERE supplier_id = $1", [supplier_id]);
        if (!userNotExist)
            res.status(404).json({ success: false, message: "Supplier not exist" });
        const productMatch = yield db_1.client.query("SELECT * FROM product WHERE supplier_id =$1 AND name=$2", [supplier_id, name]);
        if (productMatch.rowCount !== 0) {
            return res.status(400).json({
                success: false,
                message: "Product already exist with same name for same supplier",
            });
        }
        const uniqueCode = (0, auth_1.generateUniqueCode)(name, userNotExist.rows[0].name);
        // const qrcode = await QRCode.toDataURL(frontendurl + uniqueCode);
        // const qrCodeStore = await cloudinary.uploader.upload(qrcode, {
        //   folder: "Product_QRcode",
        // });
        // const ProductQrCode = qrCodeStore.secure_url;
        const addProduct = yield db_1.client.query("INSERT INTO product (name,supplier_id,description,rate,size,photo,id,buyprice) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING product_id, name,description,rate,size,photo,id,buyprice", [
            name,
            supplier_id,
            description,
            rate,
            size,
            photo,
            // ProductQrCode,
            uniqueCode,
            buyprice
        ]);
        return res.status(200).json({
            success: true,
            product: addProduct.rows[0],
            message: "Produt added successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error });
    }
});
exports.addProduct = addProduct;
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.client.query("SELECT product.*, supplier.name as supplier_name FROM product JOIN supplier ON product.supplier_id = supplier.supplier_id");
        if (products.rows.length === 0) {
            return res
                .status(200)
                .json({ success: true, message: "There is no product exist" });
        }
        return res.status(200).json({
            success: true,
            data: products.rows,
            message: "All Product fetched",
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error });
    }
});
exports.getAllProduct = getAllProduct;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let query;
    let values;
    if (/^\d+$/.test(id)) {
        query = "SELECT product.*, supplier.name as supplier_name FROM product JOIN supplier ON product.supplier_id = supplier.supplier_id WHERE product.product_id = $1::INTEGER ";
        values = id;
    }
    else {
        query = "SELECT product.*, supplier.name as supplier_name FROM product JOIN supplier ON product.supplier_id = supplier.supplier_id WHERE product.id = $1::TEXT ";
        values = id;
    }
    try {
        const product = yield db_1.client.query(query, [values]);
        if (product.rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "product not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Product fetched",
            data: product.rows[0],
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        // const query = `UPDATE product Set name =$2, description=$3,rate=$4,size=$5, stock =$6  WHERE product_id=$1`;
        // const values = [id, name, description, rate, size, stock];
        // const updatedProduct = await client.query(query, values);
        const product = yield db_1.client.query("SELECT * FROM product WHERE product_id= $1", [id]);
        if (product.rows.length === 0 || product.rows[0].isdelted === true) {
            return res
                .status(404)
                .json({ success: false, message: "product not found" });
        }
        let query = "UPDATE product SET ";
        const values = [];
        let index = 1;
        for (const [key, value] of Object.entries(req.body)) {
            query += `${key}= $${index}, `;
            values.push(value);
            index++;
        }
        let photo = "";
        if (req.file) {
            const filePath = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path;
            const uploadPromise = new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.upload(filePath, { folder: "products" }, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({
                            public_id: result.public_id,
                            url: result.secure_url,
                        });
                    }
                });
            });
            const { url, public_id } = yield uploadPromise; // Await the promise and destructure the URL
            photo = url; // Assign URL to photo
            console.log(public_id, url);
            query += `photo =$${index} , `;
            values.push(photo);
            index++;
        }
        query = query.slice(0, -2);
        query += ` WHERE product_id = $${values.length + 1} RETURNING product_id,`;
        values.push(id);
        for (const [key] of Object.entries(req.body)) {
            query += ` ${key},`;
        }
        if (req.file) {
            query += "photo,";
        }
        console.log(query, values);
        query = query.slice(0, -1);
        const updatedProduct = yield db_1.client.query(query, values);
        return res.status(200).json({
            success: true,
            message: "Product updated",
            data: updatedProduct.rows,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productExist = yield db_1.client.query(`SELECT * FROM product WHERE product_id=$1`, [id]);
        console.log(productExist.rows);
        if (productExist.rowCount === 0)
            return res.status(404).json({ messgae: "product not found", success: false });
        yield db_1.client.query(`DELETE FROM orders WHERE product_id=$1`, [id]);
        yield db_1.client.query(`DELETE FROM product WHERE product_id=$1`, [id]);
        const publicId = extractPublicId(productExist.rows[0].photo);
        const result = yield cloudinary_1.v2.uploader.destroy(publicId);
        console.log(result);
        return res
            .status(200)
            .json({ success: true, message: "product deleted successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error,
        });
    }
});
exports.deleteProduct = deleteProduct;
