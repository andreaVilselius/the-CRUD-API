import { convertDBOrderToDTO, OrderModel } from "../models/order.mjs";
import { convertDBOrderItemToDTO } from "../models/OrderItem.mjs";
import { Order, OrderItem, Product } from "../models/types.mjs";
import type QueryString from "qs";
//CRUD - order

//read

export const getOrders = async (
  q:
    | string
    | QueryString.ParsedQs
    | (string | QueryString.ParsedQs)[]
    | undefined,
  sort:
    | string
    | QueryString.ParsedQs
    | (string | QueryString.ParsedQs)[]
    | undefined,
) => {
  const ordersFromDB = await OrderModel.find();
  let filteredList = [...ordersFromDB];
  if (q) {
    filteredList = filteredList.filter((t) =>
      t.name.toLowerCase().startsWith(q as string),
    );
  }
  if (sort) {
    filteredList.sort((a, b) => {
      if ((sort as string) === "asc") {
        return a.name.toLowerCase() < b.name.toLowerCase()
          ? 1
          : a.name.toLowerCase() > b.name.toLowerCase()
            ? -1
            : 0;
      }
      return a.name.toLowerCase() < b.name.toLowerCase()
        ? -1
        : a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : 0;
    });
  }
  return filteredList.map((filtered) => convertDBOrderToDTO(filtered));
};

export const getOrder = async (orderId: string) => {
  const orderFromDB = await OrderModel.findOne({ id: +orderId });
  if (orderFromDB) return convertDBOrderToDTO(orderFromDB);
};

export const getProductsByOrder = async (
  orderName: string,
  q:
    | string
    | QueryString.ParsedQs
    | (string | QueryString.ParsedQs)[]
    | undefined,
  sort:
    | string
    | QueryString.ParsedQs
    | (string | QueryString.ParsedQs)[]
    | undefined,
) => {
  const orderFromDB = await OrderModel.findOne({
    name: orderName,
  });
  let filteredList = [...(orderFromDB?.orderItems ?? [])];

  if (q) {
    filteredList = filteredList.filter((item) =>
      item.product?.name.toLowerCase().startsWith(q as string),
    );
  }
  if (sort) {
    filteredList.sort((a, b) => {
      if ((sort as string) === "asc") {
        return (a.product?.name ?? "").toLowerCase() >
          (b.product?.name ?? "").toLowerCase()
          ? 1
          : (a.product?.name ?? "").toLowerCase() <
              (b.product?.name ?? "").toLowerCase()
            ? -1
            : 0;
      }
      return (a.product?.name ?? "").toLowerCase() >
        (b.product?.name ?? "").toLowerCase()
        ? -1
        : (a.product?.name ?? "").toLowerCase() <
            (b.product?.name ?? "").toLowerCase()
          ? 1
          : 0;
    });
  }
  return filteredList.map(convertDBOrderItemToDTO);
};

export const getProductByOrder = async (orderId: string, productId: string) => {
  const orderFromDB = await OrderModel.findOne({ id: +orderId });
  if (!orderFromDB) return;

  return convertDBOrderToDTO(orderFromDB).orderItems.find(
    (item) => item.product?.id == +productId,
  );
};

//CREATE
/** create order */

export const createOrder = async (name: string, address: string) => {
  const theNewOrder = {
    id: Date.now(),
    name,
    address,
    dateOfOrder: new Date(),
    orderItems: [],
  };

  const createdOrder = await OrderModel.create(theNewOrder);
  return convertDBOrderToDTO(createdOrder);
};

export const addProduct = async (orderId: string, item: OrderItem) => {
  const foundOrder = await OrderModel.findOne({ id: +orderId });
  if (!foundOrder) return false;

  const newOrderItem = {
    nrOfProducts: item.nrOfProducts,
    product: {
      id: Date.now(),
      name: item.product.name,
      price: item.product.price,
    },
  };

  foundOrder.orderItems.push(newOrderItem);
  const newOrderIndex = foundOrder.orderItems.length - 1;

  await foundOrder.save();

  return convertDBOrderToDTO(foundOrder).orderItems[newOrderIndex];
};

//PUT - update

export const updateOrder = async (order: Order) => {
  const orderFromDB = await OrderModel.findOneAndUpdate(
    { id: order.id },
    order,
  );
  if (!orderFromDB) return false;

  await orderFromDB.save();
  return convertDBOrderToDTO(orderFromDB);
};

export const updateProduct = async (orderId: string, product: Product) => {
  const foundOrder = await OrderModel.findOne({ id: +orderId });
  if (!foundOrder) return false;

  const foundProduct = foundOrder.orderItems.find(
    (item) => item.product?.id === product.id, //hittar id i body
  );
  if (!foundProduct || !foundProduct.product) return false;

  foundProduct.product.name = product.name;
  foundProduct.product.price = product.price;

  await foundOrder.save();

  const index = foundOrder.orderItems.findIndex(
    (item) => item.product?.id === product.id,
  );

  return convertDBOrderToDTO(foundOrder).orderItems[index];
};

//DELETE
//remove order
export const removeOrder = async (orderId: string) => {
  const removeOrder = await OrderModel.findOneAndDelete({ id: +orderId });
  if (removeOrder) {
    return true;
  }
  return false;
};

//remove one product
export const removeOneProductFromOrder = async (
  orderId: string,
  productId: string,
) => {
  const foundOrder = await OrderModel.findOne({ id: +orderId });
  if (!foundOrder) return false;
  const index = foundOrder.orderItems.findIndex(
    (item) => item.product?.id === +productId,
  );
  if (index >= 0) {
    foundOrder.orderItems.splice(index, 1);
  }
  foundOrder.save();
  return true;
};

//remove all items from order
export const removeProducts = async (orderId: string) => {
  const foundOrder = await OrderModel.findOne({ id: +orderId });
  if (!foundOrder) return false;

  foundOrder.orderItems.splice(0, foundOrder.orderItems.length);

  await foundOrder.save();
  return true;
};
