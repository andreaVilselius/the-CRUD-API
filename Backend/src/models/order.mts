import { InferSchemaType, model, Schema } from "mongoose";
import { orderItemSchema } from "./OrderItem.mjs";

import { OrderItemDTO } from "./OrderItemDTO.mjs";
import { productDTO } from "./ProductDTO.mjs";
import { OrderDTO } from "./OrderDTO.mjs";

const orderSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  dateOfOrder: { type: Date, required: true },
  orderItems: [orderItemSchema],
});

export const OrderModel = model("order", orderSchema);
export type OrderFromDB = InferSchemaType<typeof orderSchema>;

export const convertDBOrderToDTO = (dbOrder: OrderFromDB): OrderDTO => {
  return {
    id: dbOrder.id,
    name: dbOrder.name,
    address: dbOrder.address,
    dateOfOrder: dbOrder.dateOfOrder,
    orderItems: dbOrder.orderItems.map((t) => {
      return {
        nrOfProducts: t.nrOfProducts,
        product: {
          id: t.product?.id,
          name: t.product?.name,
          price: t.product?.price,
        } satisfies productDTO,
      } satisfies OrderItemDTO;
    }),
  } satisfies OrderDTO;
};
