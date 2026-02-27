import express from "express";
import {
  addProduct,
  createOrder,
  getOrder,
  getOrders,
  getProductByOrder,
  getProductsByOrder,
  removeOneProductFromOrder,
  removeOrder,
  removeProducts,
  updateOrder,
  updateProduct,
} from "../controllers/controller.mjs";
import { Order, OrderItem, Product } from "../models/types.mjs";
export const OrderRouter = express.Router();
//CRUD
//read

//delete all  products
OrderRouter.delete("/products/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const removedProduct = await removeProducts(orderId);
    if (removedProduct) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

OrderRouter.get("/", async (req, res) => {
  try {
    const { q, sort } = req.query;

    const orders = await getOrders(q, sort);

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

OrderRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const found = await getOrder(id);
    if (found) {
      res.status(200).json(found);
    } else {
      res.status(400).json({ message: "Cannot find order with if: " + id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(JSON.stringify(error));
  }
});

OrderRouter.get("/products/:name", async (req, res) => {
  try {
    const { q, sort } = req.query;
    const { name } = req.params;

    const products = await getProductsByOrder(name, q, sort);
    console.log(products);
    if (products) {
      res.status(200).json(products);
    } else {
      res.status(400).json({ message: "Cannot find order with name " + name });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(JSON.stringify(error));
  }
});

OrderRouter.get("/:orderId/:productId", async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const found = await getProductByOrder(orderId, productId);
    if (found) {
      res.status(200).json(found);
    } else {
      res.status(400).json({
        message:
          "Cannot find order with if: " +
          orderId +
          " or product with id " +
          productId,
      });
    }
  } catch (error) {
    res.status(500).send(JSON.stringify(error));
  }
});

//create order
OrderRouter.post("/", async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name || name === "" || !address || address === "") {
      res.status(400).json({ message: "name or address is missing in body" });
      return;
    }
    const theNewOrder = await createOrder(name, address);
    res.status(200).json(theNewOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//create product
OrderRouter.post("/addproduct/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const item = req.body as OrderItem;

    if (!item || !item.product) {
      res.status(400).json({ message: "Missing producttext in body" });
      return;
    }
    const theNewProduct = await addProduct(orderId, item);

    res.status(201).json(theNewProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//PUT
//update order
//update products

OrderRouter.put("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderText = req.body as Order;

    if (+orderId != orderText.id) {
      res.status(400).json({ message: "Parameter and body does not match" });
    } else {
      const found = await updateOrder(orderText);
      if (found) {
        res.status(200).json(found);
      } else {
        res.status(404).json({ message: "Could not find the order" });
        return;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

OrderRouter.put("/:orderId/:productId", async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const updatedProduct = req.body as Product;

    if (+productId != updatedProduct.id) {
      return res
        .status(400)
        .json({ message: "Parameter and body does not match" });
    } else {
      const found = await updateProduct(orderId, updatedProduct);
      if (found) {
        // res.status(204).send();
        res.status(200).json(found);
      } else {
        res.status(404).json({ message: "the order lacks products" });
        return;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//DELETE

//delete order
OrderRouter.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const success = await removeOrder(orderId);

    if (success) {
      res.status(204).json();
    } else {
      res
        .status(400)
        .json({ message: "Cannot find order with id: " + orderId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

//delete product
OrderRouter.delete("/:orderId/:productId", async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const removedProduct = await removeOneProductFromOrder(orderId, productId);
    if (removedProduct) {
      res.status(204).json();
    } else {
      res.status(400).json({ message: "order or product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});
